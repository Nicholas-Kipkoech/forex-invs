"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { ChartCard } from "@/components/ChartCard";
import { OrderPanel } from "@/components/OrderPanel";
import { PositionsList } from "@/components/PositionsList";
import { ActivityLog } from "@/components/ActivityLog";

/* ---------------------- Types ---------------------- */

type StrategyKey = "Conservative" | "Balanced" | "Aggressive";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  vol: number;
}

interface Position {
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
}

interface LogItem {
  ts: string;
  text: string;
  kind?: "info" | "success" | "error";
}

interface Strategy {
  aggression: number;
  winBias: number;
  note: string;
}

/* ---------------------- Config ---------------------- */

const STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.12, vol: 0.015 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 380.5, vol: 0.012 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 1260.0, vol: 0.03 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 170.4, vol: 0.02 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 225.3, vol: 0.04 },
];

const STRATEGIES: Record<StrategyKey, Strategy> = {
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

/* ---------------------- Utils ---------------------- */

// Seeded random generator (mulberry32)
const seededRng = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

// Money formatter
const fmt = (n: number) =>
  `$${(Math.round(n * 100) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* ---------------------- Component ---------------------- */

export default function DemoStocksPage() {
  /* ---------------------- State ---------------------- */
  const [balance, setBalance] = useState<number>(5000);
  const [selected, setSelected] = useState<string>(STOCKS[0].symbol);
  const selectedStock = useMemo(
    () => STOCKS.find((s) => s.symbol === selected)!,
    [selected]
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [strategy, setStrategy] = useState<StrategyKey>("Balanced");
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");

  const [shares, setShares] = useState<number>(1);
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [tpMode, setTpMode] = useState<"percent" | "dollar">("percent");
  const [tpValue, setTpValue] = useState<number>(2);
  const [slMode, setSlMode] = useState<"percent" | "dollar">("percent");
  const [slValue, setSlValue] = useState<number>(1);

  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [priceSeries, setPriceSeries] = useState<
    { name: string; price: number }[]
  >([{ name: "0s", price: selectedStock.price }]);
  const [plSeries, setPlSeries] = useState<{ name: string; value: number }[]>([
    { name: "0s", value: 0 },
  ]);

  const livePriceRef = useRef<number>(selectedStock.price);
  const rngRef = useRef(seededRng(Date.now() % 100000));
  const tickRef = useRef<number | null>(null);

  /* ---------------------- Helpers ---------------------- */
  const pushLog = (text: string, kind: LogItem["kind"] = "info") => {
    setLogs((prev) =>
      [...prev, { ts: new Date().toLocaleTimeString(), text, kind }].slice(
        -1000
      )
    );
  };

  const resetDemo = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    rngRef.current = seededRng(Date.now() % 100000);
    livePriceRef.current = selectedStock.price;
    setPriceSeries([{ name: "0s", price: selectedStock.price }]);
    setPlSeries([{ name: "0s", value: 0 }]);
    setPositions([]);
    setBalance(5000);
    setRunning(false);
    setPaused(false);
    setLogs([]);
    pushLog("Demo reset.", "info");
  };

  const nextPriceTick = (s: Stock) => {
    const rng = rngRef.current;
    const drift = (rng() - 0.5) * 0.1 * (s.price / 100);
    const last = livePriceRef.current || s.price;
    const vol = s.vol * STRATEGIES[strategy].aggression;
    const noise = (rng() - 0.5) * 2 * vol * last;
    const meanRevert = (s.price - last) * 0.005;
    const next = Math.max(
      0.01,
      Math.round((last + drift + noise + meanRevert) * 100) / 100
    );
    livePriceRef.current = next;
    return next;
  };

  const startFeed = () => {
    if (tickRef.current) return;
    setRunning(true);
    setPaused(false);
    pushLog(`Feed started: ${selected} — strategy: ${strategy}`, "success");
    const interval = speed === "slow" ? 1200 : speed === "fast" ? 350 : 700;
    let tick = 0;

    tickRef.current = window.setInterval(() => {
      if (paused) return;
      tick++;
      const price = nextPriceTick(selectedStock);
      const label = `${tick}s`;

      setPriceSeries((prev) => [...prev, { name: label, price }].slice(-80));
      updatePlSeries(price, label);
      evaluatePositions(price);

      if (Math.random() < 0.08)
        pushLog(`Tick ${label}: ${selected} ${fmt(price)}`);
    }, interval);
  };

  const togglePause = () => {
    if (!running) return;
    setPaused((p) => !p);
    pushLog(paused ? "Resumed feed" : "Paused feed");
  };

  const stopFeed = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setRunning(false);
    setPaused(false);
    pushLog("Feed stopped", "info");
  };

  const updatePlSeries = (currentPrice: number, label?: string) => {
    const cum = positions.reduce((acc, p) => {
      if (p.closed) return acc;
      const dir = p.side === "BUY" ? 1 : -1;
      return acc + (currentPrice - p.entryPrice) * p.shares * dir;
    }, 0);
    setPlSeries((prev) =>
      [
        ...prev,
        {
          name: label ?? `${prev.length}s`,
          value: Math.round(cum * 100) / 100,
        },
      ].slice(-80)
    );
  };

  const evaluatePositions = (currentPrice: number) => {
    setPositions((prev) =>
      prev.map((p) => {
        if (p.closed) return p;
        const dir = p.side === "BUY" ? 1 : -1;
        const pnl =
          Math.round((currentPrice - p.entryPrice) * p.shares * dir * 100) /
          100;
        let hit = false;
        if (
          p.target !== undefined &&
          ((dir === 1 && currentPrice >= p.target) ||
            (dir === -1 && currentPrice <= p.target))
        )
          hit = true;
        if (
          p.stop !== undefined &&
          ((dir === 1 && currentPrice <= p.stop) ||
            (dir === -1 && currentPrice >= p.stop))
        )
          hit = true;

        if (hit) {
          pushLog(
            `${p.symbol} ${p.side} closed automatically — P/L ${fmt(pnl)}`,
            pnl >= 0 ? "success" : "error"
          );
          applyPnlToBalance(pnl);
          return {
            ...p,
            closed: true,
            exitPrice: currentPrice,
            exitTime: new Date().toLocaleTimeString(),
            pnl,
          };
        }
        return { ...p, pnl };
      })
    );
  };

  const applyPnlToBalance = (pnl: number) => {
    setBalance((prev) => Math.max(0, Math.round((prev + pnl) * 100) / 100));
  };

  const placeOrder = () => {
    if (!running) return pushLog("Start feed first", "error");
    const p = livePriceRef.current;
    if (!p || shares <= 0) return pushLog("Invalid order", "error");

    const dir = side === "BUY" ? 1 : -1;
    const target =
      tpMode === "percent"
        ? Math.round(p * (1 + (tpValue / 100) * dir) * 100) / 100
        : Math.round((p + tpValue * dir) * 100) / 100;
    const stop =
      slMode === "percent"
        ? Math.round(p * (1 - (slValue / 100) * dir) * 100) / 100
        : Math.round((p - slValue * dir) * 100) / 100;

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

    if (side === "BUY") {
      const cost = Math.round(p * shares * 100) / 100;
      setBalance((prev) => Math.max(0, Math.round((prev - cost) * 100) / 100));
      pushLog(`BUY ${shares} ${selected} @ ${fmt(p)}`, "success");
    } else {
      pushLog(
        `SELL ${shares} ${selected} @ ${fmt(p)} (short simulated)`,
        "success"
      );
    }

    setPositions((prev) => [pos, ...prev]);
  };

  const closePosition = (id: string) => {
    const price = livePriceRef.current;
    setPositions((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.closed) return p;
        const dir = p.side === "BUY" ? 1 : -1;
        const pnl =
          Math.round((price - p.entryPrice) * p.shares * dir * 100) / 100;
        pushLog(
          `${p.symbol} ${p.side} manually closed — P/L ${fmt(pnl)}`,
          pnl >= 0 ? "success" : "error"
        );
        applyPnlToBalance(pnl);
        return {
          ...p,
          closed: true,
          exitPrice: price,
          exitTime: new Date().toLocaleTimeString(),
          pnl,
        };
      })
    );
  };

  /* ---------------------- Effects ---------------------- */
  useEffect(() => {
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
    };
  }, []);

  useEffect(() => {
    livePriceRef.current = selectedStock.price;
    setPriceSeries([{ name: "0s", price: selectedStock.price }]);
    setPlSeries([{ name: "0s", value: 0 }]);
    pushLog(`Switched to ${selectedStock.symbol}`, "info");
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#071018] border border-[#123022] rounded-lg px-4 py-2 text-sm">
              Balance{" "}
              <div className="font-semibold text-emerald-300">
                {fmt(balance)}
              </div>
            </div>
            <Button onClick={resetDemo} variant="ghost">
              Reset
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard
            priceSeries={priceSeries}
            livePrice={livePriceRef.current}
            symbol={selectedStock.symbol}
            name={selectedStock.name}
            vol={selectedStock.vol}
            running={running}
            paused={paused}
            onStart={startFeed}
            onPause={togglePause}
            onStop={stopFeed}
          />

          <OrderPanel
            side={side}
            setSide={setSide}
            shares={shares}
            setShares={setShares}
            tpMode={tpMode}
            setTpMode={setTpMode}
            tpValue={tpValue}
            setTpValue={setTpValue}
            slMode={slMode}
            setSlMode={setSlMode}
            slValue={slValue}
            setSlValue={setSlValue}
            strategy={strategy}
            setStrategy={setStrategy}
            strategies={STRATEGIES}
            speed={speed}
            setSpeed={setSpeed}
            placeOrder={placeOrder}
            clearPositions={() => setPositions([])}
          />

          <PositionsList positions={positions} closePosition={closePosition} />
          <ActivityLog logs={logs} />
        </div>
      </div>
    </div>
  );
}
