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
import { Play, Pause, Square, X, ChevronDown, ChevronUp } from "lucide-react";

/* ---------------------- Types ---------------------- */

type StrategyKey = "Conservative" | "Balanced" | "Aggressive";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  vol: number;
  bid: number;
  ask: number;
  spread: number;
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
  {
    symbol: "EURUSD",
    name: "Euro vs US Dollar",
    price: 1.085,
    vol: 0.015,
    bid: 1.0848,
    ask: 1.0852,
    spread: 0.0004,
  },
  {
    symbol: "GBPUSD",
    name: "British Pound vs US Dollar",
    price: 1.265,
    vol: 0.012,
    bid: 1.2648,
    ask: 1.2652,
    spread: 0.0004,
  },
  {
    symbol: "USDJPY",
    name: "US Dollar vs Japanese Yen",
    price: 149.5,
    vol: 0.03,
    bid: 149.48,
    ask: 149.52,
    spread: 0.04,
  },
  {
    symbol: "AUDUSD",
    name: "Australian Dollar vs US Dollar",
    price: 0.654,
    vol: 0.02,
    bid: 0.6538,
    ask: 0.6542,
    spread: 0.0004,
  },
  {
    symbol: "USDCAD",
    name: "US Dollar vs Canadian Dollar",
    price: 1.352,
    vol: 0.04,
    bid: 1.3518,
    ask: 1.3522,
    spread: 0.0004,
  },
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

const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN1"];

/* ---------------------- Utils ---------------------- */

const seededRng = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const fmt = (n: number, decimals: number = 2) =>
  `${(
    Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

/* ---------------------- Component ---------------------- */

export default function DemoStocksPage() {
  /* ---------------------- State ---------------------- */
  const [balance, setBalance] = useState<number>(10000);
  const [equity, setEquity] = useState<number>(10000);
  const [margin, setMargin] = useState<number>(0);
  const [freeMargin, setFreeMargin] = useState<number>(10000);
  const [selected, setSelected] = useState<string>(STOCKS[0].symbol);
  const [timeframe, setTimeframe] = useState<string>("M15");
  const selectedStock = useMemo(
    () => STOCKS.find((s) => s.symbol === selected)!,
    [selected],
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [strategy, setStrategy] = useState<StrategyKey>("Balanced");
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");

  const [lotSize, setLotSize] = useState<number>(0.01);
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [tpValue, setTpValue] = useState<number>(50);
  const [slValue, setSlValue] = useState<number>(30);

  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [priceSeries, setPriceSeries] = useState<
    { name: string; price: number; bid: number; ask: number }[]
  >([
    {
      name: "0s",
      price: selectedStock.price,
      bid: selectedStock.bid,
      ask: selectedStock.ask,
    },
  ]);

  const [terminalTab, setTerminalTab] = useState<"trade" | "history" | "news">(
    "trade",
  );
  const [showMarketWatch, setShowMarketWatch] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  const livePriceRef = useRef<number>(selectedStock.price);
  const liveBidRef = useRef<number>(selectedStock.bid);
  const liveAskRef = useRef<number>(selectedStock.ask);
  const rngRef = useRef(seededRng(Date.now() % 100000));
  const tickRef = useRef<number | null>(null);

  /* ---------------------- Helpers ---------------------- */
  const pushLog = (text: string, kind: LogItem["kind"] = "info") => {
    setLogs((prev) =>
      [...prev, { ts: new Date().toLocaleTimeString(), text, kind }].slice(
        -1000,
      ),
    );
  };

  const resetDemo = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    rngRef.current = seededRng(Date.now() % 100000);
    livePriceRef.current = selectedStock.price;
    liveBidRef.current = selectedStock.bid;
    liveAskRef.current = selectedStock.ask;
    setPriceSeries([
      {
        name: "0s",
        price: selectedStock.price,
        bid: selectedStock.bid,
        ask: selectedStock.ask,
      },
    ]);
    setPositions([]);
    setOrders([]);
    setBalance(10000);
    setEquity(10000);
    setMargin(0);
    setFreeMargin(10000);
    setRunning(false);
    setPaused(false);
    setLogs([]);
    pushLog("Demo account reset.", "info");
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
      Math.round((last + drift + noise + meanRevert) * 10000) / 10000,
    );
    livePriceRef.current = next;
    const spread = s.spread;
    liveBidRef.current = Math.round((next - spread / 2) * 10000) / 10000;
    liveAskRef.current = Math.round((next + spread / 2) * 10000) / 10000;
    return { price: next, bid: liveBidRef.current, ask: liveAskRef.current };
  };

  const startFeed = () => {
    if (tickRef.current) return;
    setRunning(true);
    setPaused(false);
    pushLog(`Market feed started: ${selected} — ${timeframe}`, "success");
    const interval = speed === "slow" ? 1200 : speed === "fast" ? 350 : 700;
    let tick = 0;

    tickRef.current = window.setInterval(() => {
      if (paused) return;
      tick++;
      const { price, bid, ask } = nextPriceTick(selectedStock);
      const label = `${tick}s`;

      setPriceSeries((prev) =>
        [...prev, { name: label, price, bid, ask }].slice(-200),
      );
      evaluatePositions(price);
      updateEquity(price);

      if (Math.random() < 0.05)
        pushLog(`${selected} ${fmt(bid, 4)} / ${fmt(ask, 4)}`);
    }, interval);
  };

  const togglePause = () => {
    if (!running) return;
    setPaused((p) => !p);
    pushLog(paused ? "Market feed resumed" : "Market feed paused");
  };

  const stopFeed = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setRunning(false);
    setPaused(false);
    pushLog("Market feed stopped", "info");
  };

  const updateEquity = (currentPrice: number) => {
    const openPnL = positions
      .filter((p) => !p.closed)
      .reduce((acc, p) => {
        const dir = p.side === "BUY" ? 1 : -1;
        return acc + (currentPrice - p.entryPrice) * p.shares * dir;
      }, 0);
    const newEquity = balance + openPnL;
    setEquity(newEquity);
    setFreeMargin(newEquity - margin);
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
            `${p.symbol} ${p.side} ${p.shares} closed — P/L ${fmt(pnl)}`,
            pnl >= 0 ? "success" : "error",
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
      }),
    );
  };

  const applyPnlToBalance = (pnl: number) => {
    setBalance((prev) => Math.max(0, Math.round((prev + pnl) * 100) / 100));
    setEquity((prev) => Math.max(0, Math.round((prev + pnl) * 100) / 100));
  };

  const placeOrder = () => {
    if (!running) return pushLog("Start market feed first", "error");
    const price = side === "BUY" ? liveAskRef.current : liveBidRef.current;
    if (!price || lotSize <= 0)
      return pushLog("Invalid order parameters", "error");

    const shares = Math.round(lotSize * 100); // 0.01 lot = 1 share
    const dir = side === "BUY" ? 1 : -1;
    const target =
      side === "BUY"
        ? Math.round((price + tpValue / 10000) * 10000) / 10000
        : Math.round((price - tpValue / 10000) * 10000) / 10000;
    const stop =
      side === "BUY"
        ? Math.round((price - slValue / 10000) * 10000) / 10000
        : Math.round((price + slValue / 10000) * 10000) / 10000;

    const pos: Position = {
      id: `POS-${Date.now()}`,
      symbol: selected,
      side,
      entryPrice: price,
      shares,
      entryTime: new Date().toLocaleTimeString(),
      target,
      stop,
      pnl: 0,
      closed: false,
    };

    const marginRequired = price * shares * 0.01; // 1% margin
    if (freeMargin < marginRequired) {
      pushLog("Insufficient margin", "error");
      return;
    }

    setMargin((prev) => prev + marginRequired);
    setFreeMargin((prev) => prev - marginRequired);

    pushLog(`${side} ${lotSize} lot ${selected} @ ${fmt(price, 4)}`, "success");
    setPositions((prev) => [pos, ...prev]);
  };

  const closePosition = (id: string) => {
    const price = side === "BUY" ? liveBidRef.current : liveAskRef.current;
    setPositions((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.closed) return p;
        const dir = p.side === "BUY" ? 1 : -1;
        const pnl =
          Math.round((price - p.entryPrice) * p.shares * dir * 100) / 100;
        pushLog(
          `${p.symbol} ${p.side} ${p.shares} closed — P/L ${fmt(pnl)}`,
          pnl >= 0 ? "success" : "error",
        );
        applyPnlToBalance(pnl);
        const marginRequired = p.entryPrice * p.shares * 0.01;
        setMargin((prev) => prev - marginRequired);
        return {
          ...p,
          closed: true,
          exitPrice: price,
          exitTime: new Date().toLocaleTimeString(),
          pnl,
        };
      }),
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
    liveBidRef.current = selectedStock.bid;
    liveAskRef.current = selectedStock.ask;
    setPriceSeries([
      {
        name: "0s",
        price: selectedStock.price,
        bid: selectedStock.bid,
        ask: selectedStock.ask,
      },
    ]);
    pushLog(`Switched to ${selectedStock.symbol}`, "info");
  }, [selected]);

  /* ---------------------- Render ---------------------- */
  return (
    <div className="h-screen flex flex-col bg-[#1E2329] text-gray-200 overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-10 bg-[#2A2E39] border-b border-[#3A3E49] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={running ? togglePause : startFeed}
              className="p-1 hover:bg-[#3A3E49] rounded"
              title={running ? (paused ? "Resume" : "Pause") : "Start"}
            >
              {running && !paused ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={stopFeed}
              className="p-1 hover:bg-[#3A3E49] rounded"
              title="Stop"
            >
              <Square className="h-4 w-4" />
            </button>
            <button
              onClick={resetDemo}
              className="p-1 hover:bg-[#3A3E49] rounded"
              title="Reset"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-6 w-px bg-[#3A3E49]" />
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="bg-[#1E2329] border border-[#3A3E49] rounded px-2 py-1 text-xs"
          >
            {STOCKS.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol}
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs rounded ${
                  timeframe === tf
                    ? "bg-[#4A5568] text-white"
                    : "hover:bg-[#3A3E49] text-gray-400"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-gray-400">Balance: </span>
            <span className="text-white font-semibold">{fmt(balance)}</span>
          </div>
          <div>
            <span className="text-gray-400">Equity: </span>
            <span
              className={`font-semibold ${equity >= balance ? "text-emerald-400" : "text-red-400"}`}
            >
              {fmt(equity)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Margin: </span>
            <span className="text-white font-semibold">{fmt(margin)}</span>
          </div>
          <div>
            <span className="text-gray-400">Free: </span>
            <span className="text-white font-semibold">{fmt(freeMargin)}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Market Watch */}
        {showMarketWatch && (
          <div className="w-64 bg-[#1E2329] border-r border-[#3A3E49] flex flex-col flex-shrink-0">
            <div className="h-8 bg-[#2A2E39] border-b border-[#3A3E49] flex items-center justify-between px-3">
              <span className="text-xs font-semibold text-gray-300">
                Market Watch
              </span>
              <button
                onClick={() => setShowMarketWatch(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#2A2E39] sticky top-0">
                  <tr className="border-b border-[#3A3E49]">
                    <th className="px-2 py-1 text-left text-gray-400 font-normal">
                      Symbol
                    </th>
                    <th className="px-2 py-1 text-right text-gray-400 font-normal">
                      Bid
                    </th>
                    <th className="px-2 py-1 text-right text-gray-400 font-normal">
                      Ask
                    </th>
                    <th className="px-2 py-1 text-right text-gray-400 font-normal">
                      Spread
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {STOCKS.map((stock) => {
                    const isSelected = stock.symbol === selected;
                    const currentBid = isSelected
                      ? liveBidRef.current
                      : stock.bid;
                    const currentAsk = isSelected
                      ? liveAskRef.current
                      : stock.ask;
                    const currentSpread = currentAsk - currentBid;
                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => setSelected(stock.symbol)}
                        className={`cursor-pointer hover:bg-[#2A2E39] ${
                          isSelected ? "bg-[#2A2E39]" : ""
                        }`}
                      >
                        <td
                          className={`px-2 py-1 ${isSelected ? "text-emerald-400 font-semibold" : "text-white"}`}
                        >
                          {stock.symbol}
                        </td>
                        <td className="px-2 py-1 text-right text-gray-300">
                          {fmt(currentBid, 4)}
                        </td>
                        <td className="px-2 py-1 text-right text-gray-300">
                          {fmt(currentAsk, 4)}
                        </td>
                        <td className="px-2 py-1 text-right text-gray-500">
                          {fmt(currentSpread, 4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chart Area */}
        <div className="flex-1 flex flex-col bg-[#1E2329]">
          {/* Chart Header */}
          <div className="h-10 bg-[#2A2E39] border-b border-[#3A3E49] flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-white">
                {selected}
              </span>
              <span className="text-xs text-gray-400">
                {selectedStock.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Bid:</span>
                <span className="text-xs text-red-400 font-mono">
                  {fmt(liveBidRef.current, 4)}
                </span>
                <span className="text-xs text-gray-400">Ask:</span>
                <span className="text-xs text-emerald-400 font-mono">
                  {fmt(liveAskRef.current, 4)}
                </span>
                <span className="text-xs text-gray-400">Spread:</span>
                <span className="text-xs text-gray-300 font-mono">
                  {fmt(liveAskRef.current - liveBidRef.current, 4)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showMarketWatch && (
                <button
                  onClick={() => setShowMarketWatch(true)}
                  className="px-2 py-1 text-xs hover:bg-[#3A3E49] rounded"
                >
                  Market Watch
                </button>
              )}
              {!showNavigator && (
                <button
                  onClick={() => setShowNavigator(true)}
                  className="px-2 py-1 text-xs hover:bg-[#3A3E49] rounded"
                >
                  Navigator
                </button>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 relative bg-[#0F1419]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceSeries}>
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1F26" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  width={80}
                  tickFormatter={(v) => fmt(v, 4)}
                />
                <Tooltip
                  formatter={(v: any) => fmt(Number(v), 4)}
                  contentStyle={{
                    backgroundColor: "#2A2E39",
                    border: "1px solid #3A3E49",
                    borderRadius: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#34d399"
                  fill="url(#priceGradient)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar - Order Panel */}
        <div className="w-72 bg-[#1E2329] border-l border-[#3A3E49] flex flex-col flex-shrink-0">
          <div className="h-8 bg-[#2A2E39] border-b border-[#3A3E49] flex items-center px-3">
            <span className="text-xs font-semibold text-gray-300">Order</span>
          </div>
          <div className="p-3 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setSide("BUY")}
                className={`flex-1 py-2 rounded text-sm font-semibold ${
                  side === "BUY"
                    ? "bg-emerald-500 text-white"
                    : "bg-[#2A2E39] text-gray-300 hover:bg-[#3A3E49]"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide("SELL")}
                className={`flex-1 py-2 rounded text-sm font-semibold ${
                  side === "SELL"
                    ? "bg-red-500 text-white"
                    : "bg-[#2A2E39] text-gray-300 hover:bg-[#3A3E49]"
                }`}
              >
                Sell
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Volume (lots)
              </label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={lotSize}
                onChange={(e) =>
                  setLotSize(Math.max(0.01, Number(e.target.value)))
                }
                className="bg-[#0F1419] border-[#3A3E49] text-white text-sm h-8"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Take Profit (pips)
              </label>
              <Input
                type="number"
                value={tpValue}
                onChange={(e) => setTpValue(Number(e.target.value))}
                className="bg-[#0F1419] border-[#3A3E49] text-white text-sm h-8"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Stop Loss (pips)
              </label>
              <Input
                type="number"
                value={slValue}
                onChange={(e) => setSlValue(Number(e.target.value))}
                className="bg-[#0F1419] border-[#3A3E49] text-white text-sm h-8"
              />
            </div>

            <Button
              onClick={placeOrder}
              className={`w-full py-2 ${
                side === "BUY"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {side} {lotSize} lot
            </Button>

            <div className="pt-3 border-t border-[#3A3E49]">
              <div className="text-xs text-gray-400 mb-2">Open Positions</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {positions.filter((p) => !p.closed).length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No open positions
                  </div>
                ) : (
                  positions
                    .filter((p) => !p.closed)
                    .map((pos) => (
                      <div
                        key={pos.id}
                        className="bg-[#0F1419] border border-[#3A3E49] rounded p-2 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-semibold ${pos.side === "BUY" ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {pos.symbol} {pos.side}
                          </span>
                          <span
                            className={`font-semibold ${pos.pnl && pos.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {pos.pnl !== undefined ? fmt(pos.pnl) : "0.00"}
                          </span>
                        </div>
                        <div className="text-gray-500 text-[10px]">
                          {fmt(pos.entryPrice, 4)} • {pos.shares} • TP:{" "}
                          {pos.target ? fmt(pos.target, 4) : "—"} • SL:{" "}
                          {pos.stop ? fmt(pos.stop, 4) : "—"}
                        </div>
                        <button
                          onClick={() => closePosition(pos.id)}
                          className="mt-1 w-full py-1 bg-[#2A2E39] hover:bg-[#3A3E49] rounded text-[10px]"
                        >
                          Close
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Terminal */}
      {showTerminal && (
        <div className="h-64 bg-[#1E2329] border-t border-[#3A3E49] flex flex-col flex-shrink-0">
          <div className="h-8 bg-[#2A2E39] border-b border-[#3A3E49] flex items-center">
            <button
              onClick={() => setTerminalTab("trade")}
              className={`px-4 h-full text-xs ${
                terminalTab === "trade"
                  ? "bg-[#1E2329] text-white border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Trade
            </button>
            <button
              onClick={() => setTerminalTab("history")}
              className={`px-4 h-full text-xs ${
                terminalTab === "history"
                  ? "bg-[#1E2329] text-white border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              History
            </button>
            <button
              onClick={() => setTerminalTab("news")}
              className={`px-4 h-full text-xs ${
                terminalTab === "news"
                  ? "bg-[#1E2329] text-white border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              News
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowTerminal(false)}
              className="px-2 text-gray-400 hover:text-white"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 text-xs font-mono">
            {terminalTab === "trade" && (
              <div className="space-y-1">
                {logs.slice(-50).map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.kind === "success"
                        ? "text-emerald-400"
                        : log.kind === "error"
                          ? "text-red-400"
                          : "text-gray-300"
                    }`}
                  >
                    <span className="text-gray-500">{log.ts}</span> {log.text}
                  </div>
                ))}
              </div>
            )}
            {terminalTab === "history" && (
              <div className="space-y-1">
                {positions.filter((p) => p.closed).length === 0 ? (
                  <div className="text-gray-500">No closed positions</div>
                ) : (
                  positions
                    .filter((p) => p.closed)
                    .map((pos) => (
                      <div
                        key={pos.id}
                        className="flex items-center justify-between py-1 border-b border-[#3A3E49]"
                      >
                        <div>
                          <span
                            className={
                              pos.side === "BUY"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }
                          >
                            {pos.symbol} {pos.side}
                          </span>
                          <span className="text-gray-500 ml-2">
                            {fmt(pos.entryPrice, 4)} →{" "}
                            {fmt(pos.exitPrice || 0, 4)}
                          </span>
                        </div>
                        <span
                          className={
                            pos.pnl && pos.pnl >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {pos.pnl !== undefined ? fmt(pos.pnl) : "0.00"}
                        </span>
                      </div>
                    ))
                )}
              </div>
            )}
            {terminalTab === "news" && (
              <div className="space-y-2 text-gray-400">
                <div>No news available</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="h-6 bg-[#2A2E39] border-t border-[#3A3E49] flex items-center justify-between px-4 text-xs text-gray-400 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Demo Account #12345678</span>
          <span className="text-emerald-400">●</span>
          <span>Connected</span>
          <span>Server: Demo-Server</span>
        </div>
        <div className="flex items-center gap-4">
          {!showTerminal && (
            <button
              onClick={() => setShowTerminal(true)}
              className="hover:text-white"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
