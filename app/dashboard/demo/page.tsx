// app/demo/page.tsx  (or pages/demo.tsx)
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Stocks Demo Simulator (Option 2 - Mock realistic data)
 *
 * Highlights:
 * - Stocks only (AAPL, MSFT, NVDA, AMZN, TSLA)
 * - Realistic seeded random-walk prices with per-stock volatility
 * - World-class UI (dark, emerald accents), responsive layout
 * - Controls: buy/sell, shares, TP/SL (absolute $ or %), speed, strategy
 * - Live chart for price + separate mini P/L area chart
 * - Logs terminal, download logs, download session JSON
 * - Balance is protected from going below zero
 *
 * No external API dependencies — self-contained and ready to swap in a live data source later.
 */

/* ---------------------- Config / Types ---------------------- */

type StrategyKey = "Conservative" | "Balanced" | "Aggressive";

const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.12, vol: 0.015 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 380.5, vol: 0.012 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 1260.0, vol: 0.03 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 170.4, vol: 0.02 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 225.3, vol: 0.04 },
];

const STRATEGIES: Record<
  StrategyKey,
  { aggression: number; winBias: number; note: string }
> = {
  Conservative: {
    aggression: 0.6,
    winBias: 0.85,
    note: "Small moves, high win rate",
  },
  Balanced: { aggression: 1.0, winBias: 0.78, note: "Balanced risk & return" },
  Aggressive: {
    aggression: 1.6,
    winBias: 0.65,
    note: "Bigger moves, higher variance",
  },
};

type LogItem = {
  ts: string;
  text: string;
  kind?: "info" | "success" | "error";
};

type Position = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  shares: number;
  entryTime: string;
  target?: number;
  stop?: number;
  pnl?: number;
  closed?: boolean;
  exitPrice?: number;
  exitTime?: string;
};

/* ---------------------- Helpers ---------------------- */

// simple seeded random number generator (mulberry32) for reproducible demo runs
function seededRng(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// format money safely
const fmt = (n: number) =>
  `$${(Math.round(n * 100) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* ---------------------- Component ---------------------- */

export default function DemoStocksPage() {
  // user-visible state
  const [balance, setBalance] = useState<number>(5000); // starting demo balance
  const [selected, setSelected] = useState(STOCKS[0].symbol);
  const selectedStock = useMemo(
    () => STOCKS.find((s) => s.symbol === selected)!,
    [selected]
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [strategy, setStrategy] = useState<StrategyKey>("Balanced");

  // order form
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [shares, setShares] = useState<number>(1);
  const [tpMode, setTpMode] = useState<"dollar" | "percent">("percent");
  const [tpValue, setTpValue] = useState<number>(2); // if percent, as %
  const [slMode, setSlMode] = useState<"dollar" | "percent">("percent");
  const [slValue, setSlValue] = useState<number>(1); // percent

  // runtime refs & state
  const seedRef = useRef<number>(Date.now() % 100000);
  const rngRef = useRef(seededRng(seedRef.current));
  const tickRef = useRef<number | null>(null);

  // price history per stock
  const [priceSeries, setPriceSeries] = useState<
    { name: string; price: number }[]
  >(() => {
    // seed initial series for selected stock
    const base = selectedStock.price;
    const arr = Array.from({ length: 40 }).map((_, i) => ({
      name: `${-39 + i}s`,
      price:
        Math.round((base + (Math.random() - 0.5) * base * 0.02) * 100) / 100,
    }));
    return arr;
  });

  // session P/L series
  const [plSeries, setPlSeries] = useState<{ name: string; value: number }[]>([
    { name: "0s", value: 0 },
  ]);

  // positions and logs
  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);

  // internal: current "live price" of selected stock
  const livePriceRef = useRef<number>(selectedStock.price);

  // small utility: push log
  function pushLog(text: string, kind: LogItem["kind"] = "info") {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { ts, text, kind }].slice(-1000));
  }

  // reset simulation to fresh state
  function resetDemo() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    seedRef.current = Date.now() % 100000;
    rngRef.current = seededRng(seedRef.current);
    setRunning(false);
    setPaused(false);
    setPositions([]);
    setLogs([]);
    setBalance(5000);
    setPriceSeries([{ name: "0s", price: selectedStock.price }]);
    setPlSeries([{ name: "0s", value: 0 }]);
    livePriceRef.current = selectedStock.price;
    pushLog("Demo reset.", "info");
  }

  // generate next price point for the currently selected stock using an OU-ish process + noise
  function nextPriceTick(symbol: string) {
    // find stock params
    const s = STOCKS.find((st) => st.symbol === symbol)!;
    const rng = rngRef.current;
    // base price tends toward a slightly drifting 'fair' value (small random drift)
    const drift = (rng() - 0.5) * 0.1 * (s.price / 100); // tiny long-term drift
    const last = livePriceRef.current || s.price;
    // volatility multiplier influenced by strategy
    const stratAgg = STRATEGIES[strategy].aggression;
    // use volatility + strategy to determine step size
    const vol = s.vol * stratAgg;
    const noise = (rng() - 0.5) * 2 * vol * last;
    const meanRevert = (s.price - last) * 0.005; // small pull to initial price
    const next = Math.max(
      0.01,
      Math.round((last + drift + noise + meanRevert) * 100) / 100
    );
    livePriceRef.current = next;
    return next;
  }

  // start the live simulated feed (only for the selected stock)
  function startFeed() {
    if (tickRef.current) return;
    setRunning(true);
    setPaused(false);
    pushLog(
      `Starting demo feed for ${selected} — strategy: ${strategy}.`,
      "success"
    );

    // choose interval by speed
    const ms = speed === "slow" ? 1200 : speed === "fast" ? 350 : 700;
    let tick = 0;

    tickRef.current = window.setInterval(() => {
      if (paused) return;
      tick += 1;
      const price = nextPriceTick(selected);
      const label = `${tick}s`;

      // append to price series (keep window)
      setPriceSeries((prev) => {
        const next = [...prev, { name: label, price }].slice(-80);
        return next;
      });

      // update PL series (cumulative P/L across open positions)
      updatePlSeries(price, label);

      // autoscan positions for TP/SL
      evaluatePositions(price);

      // log occasional ticks for transparency
      if (Math.random() < 0.08) {
        pushLog(`Tick ${label}: ${selected} ${fmt(price)}`, "info");
      }
    }, ms);
  }

  // pause/resume feed
  function togglePause() {
    if (!running) return;
    setPaused((p) => {
      const next = !p;
      pushLog(next ? "Resumed feed." : "Paused feed.");
      return next;
    });
  }

  // stop feed
  function stopFeed() {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setRunning(false);
    setPaused(false);
    pushLog("Feed stopped.", "info");
  }

  // compute cumulative P/L across open positions given current price
  function updatePlSeries(currentPrice: number, label?: string) {
    // compute P/L for open positions only
    const cum = positions.reduce((acc, pos) => {
      if (pos.closed) return acc;
      const direction = pos.side === "BUY" ? 1 : -1;
      const pnl = (currentPrice - pos.entryPrice) * pos.shares * direction;
      return acc + pnl;
    }, 0);
    const value = Math.round(cum * 100) / 100;
    setPlSeries((prev) =>
      [...prev, { name: label ?? `${prev.length}s`, value }].slice(-80)
    );
  }

  // evaluate open positions for TP/SL conditions and auto-close if hit
  function evaluatePositions(currentPrice: number) {
    setPositions((prev) => {
      const now = new Date().toLocaleTimeString();
      let updated = prev.map((p) => {
        if (p.closed) return p;
        const direction = p.side === "BUY" ? 1 : -1;
        const pnl =
          Math.round(
            (currentPrice - p.entryPrice) * p.shares * direction * 100
          ) / 100;
        // check TP/SL (both absolute $ targets and percent-based if stored)
        let hit = false;
        if (
          p.target !== undefined &&
          ((direction === 1 && currentPrice >= p.target) ||
            (direction === -1 && currentPrice <= p.target))
        ) {
          hit = true;
        }
        if (
          p.stop !== undefined &&
          ((direction === 1 && currentPrice <= p.stop) ||
            (direction === -1 && currentPrice >= p.stop))
        ) {
          hit = true;
        }

        if (hit) {
          // close position
          const exitPrice = currentPrice;
          pushLog(
            `${p.symbol} ${p.side} closed automatically — exit ${fmt(
              exitPrice
            )}, P/L ${fmt(pnl)}`,
            pnl >= 0 ? "success" : "error"
          );
          // apply to balance
          applyPnlToBalance(pnl);
          return { ...p, closed: true, exitPrice, exitTime: now, pnl };
        }
        // otherwise just update pnl
        return { ...p, pnl };
      });
      return updated;
    });
  }

  // apply P/L to balance safely (atomic style)
  function applyPnlToBalance(pnl: number) {
    setBalance((prev) => {
      const next = Math.round((prev + pnl) * 100) / 100;
      const clamped = Math.max(0, Math.round(next * 100) / 100);
      pushLog(`Balance updated: ${fmt(prev)} → ${fmt(clamped)}`, "info");
      return clamped;
    });
  }

  // place a manual trade (open position)
  function placeOrder() {
    if (!running) {
      pushLog("Start the feed (Start) before placing orders.", "error");
      return;
    }
    const p = livePriceRef.current;
    if (!p || shares <= 0) {
      pushLog("Invalid order parameters.", "error");
      return;
    }

    // compute target/stop based on mode
    let target: number | undefined;
    let stop: number | undefined;
    const direction = side === "BUY" ? 1 : -1;

    if (tpMode === "percent") {
      target = Math.round(p * (1 + (tpValue / 100) * direction) * 100) / 100;
    } else {
      target = Math.round((p + tpValue * direction) * 100) / 100;
    }

    if (slMode === "percent") {
      stop = Math.round(p * (1 - (slValue / 100) * direction) * 100) / 100;
    } else {
      stop = Math.round((p - slValue * direction) * 100) / 100;
    }

    // create position
    const pos: Position = {
      id: `POS-${Date.now()}`,
      symbol: selected,
      side,
      entryPrice: p,
      shares,
      entryTime: new Date().toLocaleTimeString(),
      target,
      stop,
      pnl: 0,
      closed: false,
    };

    // reserve notional on balance for buys (simplified: deduct entry price * shares)
    // For sells (short), we'll still allow but won't adjust balance up-front in demo.
    if (side === "BUY") {
      const cost = Math.round(p * shares * 100) / 100;
      setBalance((prev) => {
        const next = Math.max(0, Math.round((prev - cost) * 100) / 100);
        pushLog(
          `Order placed: BUY ${shares} ${selected} @ ${fmt(p)} — reserved ${fmt(
            cost
          )}.`,
          "success"
        );
        pushLog(`Balance reserved: ${fmt(prev)} → ${fmt(next)}`, "info");
        return next;
      });
    } else {
      pushLog(
        `Order placed: SELL ${shares} ${selected} @ ${fmt(
          p
        )} (short simulate).`,
        "success"
      );
    }

    setPositions((prev) => [pos, ...prev]);
  }

  // manually close position
  function closePosition(id: string) {
    const price = livePriceRef.current;
    const now = new Date().toLocaleTimeString();
    setPositions((prev) => {
      return prev.map((p) => {
        if (p.id !== id || p.closed) return p;
        const direction = p.side === "BUY" ? 1 : -1;
        const pnl =
          Math.round((price - p.entryPrice) * p.shares * direction * 100) / 100;
        pushLog(
          `${p.symbol} ${p.side} manually closed — exit ${fmt(
            price
          )}, P/L ${fmt(pnl)}`,
          pnl >= 0 ? "success" : "error"
        );
        applyPnlToBalance(pnl);
        return { ...p, closed: true, exitPrice: price, exitTime: now, pnl };
      });
    });
  }

  // download logs as txt
  function downloadLogs() {
    const text = logs.map((l) => `[${l.ts}] ${l.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demo-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // download session JSON (positions, priceSeries, plSeries, logs, balance)
  function downloadSession() {
    const session = {
      startedAt: new Date().toISOString(),
      balance,
      selected,
      strategy,
      positions,
      priceSeries,
      plSeries,
      logs,
    };
    const blob = new Blob([JSON.stringify(session, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demo-session-${selected}-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // when user switches stock, reset small series and live price reference
  useEffect(() => {
    // re-seed RNG so new symbol looks different
    rngRef.current = seededRng(seedRef.current + Math.random() * 1000);
    livePriceRef.current = selectedStock.price;
    setPriceSeries([{ name: "0s", price: selectedStock.price }]);
    setPlSeries([{ name: "0s", value: 0 }]);
    pushLog(
      `Switched to ${selectedStock.symbol} — ${selectedStock.name}`,
      "info"
    );
  }, [selected]);

  /* ---------------------- Render ---------------------- */

  return (
    <div className="min-h-screen p-6 bg-[#061016] text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400">
              Stocks Demo Simulator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Simulated equities feed with realistic volatility — practice
              orders without risk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#071018] border border-[#123022] rounded-lg px-4 py-2 text-sm">
              Balance{" "}
              <div className="font-semibold text-emerald-300">
                {fmt(balance)}
              </div>
            </div>
            <Button onClick={downloadLogs} variant="outline">
              Download Logs
            </Button>
            <Button
              onClick={downloadSession}
              className="bg-emerald-500 hover:bg-emerald-400 text-black"
            >
              Export Session
            </Button>
            <Button onClick={resetDemo} variant="ghost">
              Reset
            </Button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Chart & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart card */}
            <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center font-bold text-black">
                    {selectedStock.symbol}
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">
                      {selectedStock.name}
                    </div>
                    <div className="text-2xl font-semibold text-emerald-200">
                      {fmt(livePriceRef.current)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Volatility: {(selectedStock.vol * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!running && (
                    <Button
                      onClick={startFeed}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black"
                    >
                      Start
                    </Button>
                  )}
                  {running && (
                    <Button onClick={togglePause} variant="outline">
                      {paused ? "Resume" : "Pause"}
                    </Button>
                  )}
                  {running && (
                    <Button onClick={stopFeed} variant="ghost">
                      Stop
                    </Button>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div
                style={{ height: 320 }}
                className="rounded-lg overflow-hidden bg-[#071018]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceSeries}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#34d399"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="100%"
                          stopColor="#34d399"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#082426" />
                    <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
                    <YAxis
                      tickFormatter={(v) => `$${v}`}
                      tick={{ fill: "#9CA3AF" }}
                      width={80}
                    />
                    <Tooltip formatter={(v: any) => fmt(Number(v))} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#34d399"
                      fill="url(#g1)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trade / Order Panel */}
            <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left: stock selector */}
              <div className="md:col-span-1 p-2">
                <label className="text-xs text-slate-400">Stock</label>
                <select
                  className="w-full mt-2 p-2 rounded-md bg-[#06161a] border border-[#123022] text-slate-200"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {STOCKS.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} — {s.name}
                    </option>
                  ))}
                </select>

                <div className="mt-3">
                  <label className="text-xs text-slate-400">Strategy</label>
                  <select
                    className="w-full mt-2 p-2 rounded-md bg-[#06161a] border border-[#123022] text-slate-200"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value as StrategyKey)}
                  >
                    {Object.keys(STRATEGIES).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-slate-500 mt-2">
                    {STRATEGIES[strategy].note}
                  </div>
                </div>
              </div>

              {/* Middle: order inputs */}
              <div className="md:col-span-1 p-2">
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 rounded ${
                      side === "BUY"
                        ? "bg-emerald-500 text-black"
                        : "bg-transparent border border-[#123022]"
                    }`}
                    onClick={() => setSide("BUY")}
                  >
                    Buy
                  </button>
                  <button
                    className={`flex-1 py-2 rounded ${
                      side === "SELL"
                        ? "bg-rose-500 text-black"
                        : "bg-transparent border border-[#123022]"
                    }`}
                    onClick={() => setSide("SELL")}
                  >
                    Sell
                  </button>
                </div>

                <div className="mt-3">
                  <label className="text-xs text-slate-400">Shares</label>
                  <Input
                    type="number"
                    min={1}
                    value={shares}
                    onChange={(e: any) =>
                      setShares(Math.max(1, Number(e.target.value)))
                    }
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400">TP Mode</label>
                    <select
                      className="w-full mt-1 p-2 rounded-md bg-[#06161a] border border-[#123022]"
                      value={tpMode}
                      onChange={(e) => setTpMode(e.target.value as any)}
                    >
                      <option value="percent">Percent</option>
                      <option value="dollar">Dollar</option>
                    </select>
                    <input
                      className="w-full mt-2 p-2 rounded-md bg-[#06161a] border border-[#123022]"
                      type="number"
                      value={tpValue}
                      onChange={(e: any) => setTpValue(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">SL Mode</label>
                    <select
                      className="w-full mt-1 p-2 rounded-md bg-[#06161a] border border-[#123022]"
                      value={slMode}
                      onChange={(e) => setSlMode(e.target.value as any)}
                    >
                      <option value="percent">Percent</option>
                      <option value="dollar">Dollar</option>
                    </select>
                    <input
                      className="w-full mt-2 p-2 rounded-md bg-[#06161a] border border-[#123022]"
                      type="number"
                      value={slValue}
                      onChange={(e: any) => setSlValue(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Right: action */}
              <div className="md:col-span-1 p-2 flex flex-col justify-between">
                <div>
                  <label className="text-xs text-slate-400">Speed</label>
                  <select
                    className="w-full mt-2 p-2 rounded-md bg-[#06161a] border border-[#123022]"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value as any)}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>

                <div className="mt-4 grid gap-2">
                  <Button
                    onClick={placeOrder}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black"
                  >
                    Place Order
                  </Button>
                  <Button
                    onClick={() => {
                      setPositions([]);
                      pushLog("Cleared positions (demo only).", "info");
                    }}
                    variant="outline"
                  >
                    Clear Positions
                  </Button>
                </div>
              </div>
            </div>

            {/* PL small chart */}
            <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-slate-400">
                    Session Cumulative P/L
                  </div>
                  <div className="text-lg font-semibold text-emerald-200">
                    {fmt(plSeries[plSeries.length - 1]?.value ?? 0)}
                  </div>
                </div>
                <div className="text-xs text-slate-500">Real-time</div>
              </div>
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={plSeries}>
                    <defs>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#34d399"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="100%"
                          stopColor="#34d399"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#082426" />
                    <XAxis dataKey="name" hide />
                    <YAxis tickFormatter={(v) => fmt(v)} width={60} />
                    <Tooltip formatter={(v: any) => fmt(Number(v))} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#34d399"
                      fill="url(#g2)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Col: Positions & Logs */}
          <aside className="space-y-6">
            {/* Positions */}
            <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-400">Positions</div>
                <div className="text-xs text-slate-500">
                  {positions.length} total
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {positions.length === 0 ? (
                  <div className="text-slate-500 text-sm">
                    No open positions yet.
                  </div>
                ) : (
                  positions.map((pos) => (
                    <div
                      key={pos.id}
                      className="flex items-center justify-between p-3 bg-[#06161a] rounded-lg border border-[#123022]"
                    >
                      <div>
                        <div className="text-sm font-semibold">
                          {pos.symbol} • {pos.side}
                        </div>
                        <div className="text-xs text-slate-400">
                          Entry {fmt(pos.entryPrice)} • {pos.shares} shares
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          TP {pos.target ? fmt(pos.target) : "—"} • SL{" "}
                          {pos.stop ? fmt(pos.stop) : "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-semibold ${
                            pos.pnl && pos.pnl >= 0
                              ? "text-emerald-300"
                              : "text-rose-400"
                          }`}
                        >
                          {pos.pnl !== undefined ? fmt(pos.pnl) : "-"}
                        </div>
                        <div className="mt-2 flex gap-2">
                          {!pos.closed && (
                            <button
                              className="text-xs px-2 py-1 rounded bg-slate-800"
                              onClick={() => closePosition(pos.id)}
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Logs */}
            <div className="bg-black text-green-300 font-mono text-sm p-4 rounded-2xl border border-emerald-900 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-400">Activity Log</div>
                <div className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="space-y-1">
                {logs.length === 0 ? (
                  <div className="text-slate-600">
                    No activity — start the feed and place orders.
                  </div>
                ) : (
                  logs
                    .slice()
                    .reverse()
                    .map((l, i) => (
                      <div
                        key={i}
                        className={`${
                          l.kind === "error"
                            ? "text-rose-400"
                            : l.kind === "success"
                            ? "text-emerald-300"
                            : "text-green-300"
                        }`}
                      >
                        <span className="text-slate-500 mr-2">[{l.ts}]</span>
                        {l.text}
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4 flex flex-col gap-2">
              <Button onClick={downloadLogs} variant="outline">
                Download Logs
              </Button>
              <Button
                onClick={downloadSession}
                className="bg-emerald-500 hover:bg-emerald-400 text-black"
              >
                Export Session
              </Button>
              <div className="text-xs text-slate-500 mt-2">
                This simulator is for demo & learning only — not connected to
                live exchanges.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
