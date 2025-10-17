"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * World-class Demo Trading Simulator
 * - realistic, balance-relative ticks (percent-based)
 * - strategies (Conservative / Balanced / Aggressive)
 * - speed control (Slow/Normal/Fast)
 * - pause/resume + stop
 * - download logs
 * - mini chart of cumulative P/L over the current trade
 * - safe clamping: balance never negative
 */

type LogItem = {
  ts: string;
  text: string;
  kind?: "info" | "success" | "error";
};

const strategies = {
  Conservative: {
    winProb: 0.88,
    gainPct: [0.002, 0.01],
    lossPct: [0.001, 0.006],
  },
  Balanced: { winProb: 0.8, gainPct: [0.005, 0.02], lossPct: [0.002, 0.01] },
  Aggressive: { winProb: 0.7, gainPct: [0.01, 0.04], lossPct: [0.005, 0.03] },
};

export default function DemoPage() {
  const [balance, setBalance] = useState<number>(1000);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [takeProfit, setTakeProfit] = useState<number>(100);
  const [stopLoss, setStopLoss] = useState<number>(50);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [strategy, setStrategy] = useState<keyof typeof strategies>("Balanced");
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");

  // runtime state for a single "trade session"
  const profitRef = useRef<number>(0); // running P/L for current trade session
  const baseBalanceRef = useRef<number>(balance);
  const tickIntervalRef = useRef<number | null>(null);

  // chart data (small window)
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  // auto-scroll logs
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // helper: push log
  function pushLog(text: string, kind: LogItem["kind"] = "info") {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { ts, text, kind }].slice(-500)); // cap 500
  }

  // create a timestamp string
  function ts() {
    return new Date().toLocaleTimeString();
  }

  // reset chart and profit when starting
  function initSession() {
    profitRef.current = 0;
    baseBalanceRef.current = balance;
    setChartData([{ name: "0s", value: 0 }]);
  }

  // start simulation
  async function startTrade() {
    if (running) return;
    initSession();
    setRunning(true);
    setPaused(false);
    setLogs([]);
    pushLog("Initializing connection to demo engine...");
    await delay(400);
    pushLog("Loading market data and indicators...");
    await delay(600);
    pushLog(`Strategy selected: ${strategy}`);
    await delay(400);
    pushLog("Trade session started", "success");

    // choose interval from speed
    const intervalMs = speed === "slow" ? 1200 : speed === "fast" ? 350 : 700;
    let tickCount = 0;

    tickIntervalRef.current = window.setInterval(() => {
      if (paused) return;
      tickCount += 1;
      const outcome = simulateTick(baseBalanceRef.current, strategy);
      profitRef.current =
        Math.round((profitRef.current + outcome.pnl) * 100) / 100;

      // update chart
      setChartData((prev) => {
        const next = [
          ...prev,
          { name: `${tickCount}s`, value: profitRef.current },
        ];
        return next.slice(-40);
      });

      // push tick log
      pushLog(
        `${outcome.side} ${outcome.pair} | ${outcome.pnl >= 0 ? "▲" : "▼"} ${
          outcome.pnl >= 0 ? "+" : ""
        }${outcome.pnl.toFixed(2)} | Cumulative: ${profitRef.current.toFixed(
          2
        )}`
      );

      // check TP/SL
      if (profitRef.current >= takeProfit) {
        pushLog(
          `✅ Take Profit reached at +$${profitRef.current.toFixed(2)}`,
          "success"
        );
        stopTrade(true);
      } else if (profitRef.current <= -Math.abs(stopLoss)) {
        pushLog(
          `❌ Stop Loss hit at $${profitRef.current.toFixed(2)}`,
          "error"
        );
        stopTrade(false);
      }
    }, intervalMs);
  }

  function pauseResume() {
    if (!running) return;
    setPaused((p) => !p);
    pushLog(paused ? "Resuming session" : "Pausing session");
  }

  function stopTrade(isProfitClose?: boolean) {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    setRunning(false);
    setPaused(false);

    const finalProfit = Math.round(profitRef.current * 100) / 100;
    if (finalProfit > 0) {
      pushLog(`Trade closed in profit: +$${finalProfit.toFixed(2)}`, "success");
    } else if (finalProfit < 0) {
      pushLog(`Trade closed in loss: $${finalProfit.toFixed(2)}`, "error");
    } else {
      pushLog("Trade stopped.", "info");
    }

    // Apply final profit to balance safely (never negative)
    setBalance((prev) => {
      const next = Math.max(0, Math.round((prev + finalProfit) * 100) / 100);
      pushLog(
        `Balance updated: $${prev.toFixed(2)} → $${next.toFixed(2)}`,
        "info"
      );
      return next;
    });
    // reset profit and chart for next session
    profitRef.current = 0;
    setChartData((c) => [...c, { name: "end", value: 0 }].slice(-40));
  }

  function resetDemo() {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    setRunning(false);
    setPaused(false);
    profitRef.current = 0;
    setChartData([{ name: "0s", value: 0 }]);
    setLogs([]);
    setBalance(1000);
    pushLog("Demo reset", "info");
  }

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

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  // small helper
  function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-700">
            Demo Trading Simulator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            AI bot simulation — realistic, safe, and configurable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={downloadLogs}
            variant="outline"
            className="hidden sm:inline-flex"
          >
            Download Logs
          </Button>
          <Button onClick={resetDemo} variant="ghost">
            Reset Demo
          </Button>
        </div>
      </header>

      {/* top grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance card */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <div className="text-sm text-slate-500">Balance</div>
            <div className="text-2xl font-semibold text-emerald-700">
              ${balance.toFixed(2)}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Base deposit:{" "}
              <span className="font-medium">
                ${(baseBalanceRef.current || balance).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="text-xs text-slate-500">Strategy</div>
            <select
              className="col-span-1 border rounded p-2 text-sm"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as any)}
              disabled={running}
            >
              {Object.keys(strategies).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="text-xs text-slate-500">Speed</div>
            <select
              className="col-span-1 border rounded p-2 text-sm"
              value={speed}
              onChange={(e) => setSpeed(e.target.value as any)}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>

        {/* TP/SL card */}
        <div className="bg-white border p-4 rounded-lg">
          <div className="text-sm text-slate-500">Trade Settings</div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs text-slate-500">Take Profit ($)</label>
              <Input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(Number(e.target.value))}
                disabled={running}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Stop Loss ($)</label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                disabled={running}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {!running && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startTrade}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold shadow"
              >
                Start Trade
              </motion.button>
            )}

            {running && (
              <>
                <Button
                  onClick={pauseResume}
                  className="flex-1"
                  variant="outline"
                >
                  {paused ? "Resume" : "Pause"}
                </Button>
                <Button
                  onClick={() => stopTrade(true)}
                  className="flex-1 bg-emerald-600 text-white"
                >
                  Close (Take)
                </Button>
              </>
            )}
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Tip: change strategy or speed before starting for different
            behavior.
          </div>
        </div>

        {/* Mini chart */}
        <div className="bg-white border p-3 rounded-lg">
          <div className="text-sm text-slate-500 mb-2">Session P/L</div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis tickFormatter={(v) => `$${v}`} width={60} />
                <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Realtime cumulative P/L for the current session
          </div>
        </div>
      </div>

      {/* Terminal / Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 bg-black text-green-300 font-mono text-sm p-4 rounded-lg h-72 overflow-y-auto border border-emerald-900"
          ref={logContainerRef}
        >
          {logs.length === 0 ? (
            <div className="opacity-60">
              No activity yet — click Start Trade to simulate a session.
            </div>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="mb-1">
                <span className="text-slate-400 mr-2">[{l.ts}]</span>
                <span
                  className={`${
                    l.kind === "error"
                      ? "text-rose-400"
                      : l.kind === "success"
                      ? "text-emerald-300"
                      : "text-green-300"
                  }`}
                >
                  {l.text}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Summary panel */}
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <div>
            <div className="text-xs text-slate-500">Session P/L</div>
            <div className="text-xl font-semibold text-emerald-700">
              ${profitRef.current.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Status</div>
            <div className="mt-1">
              {running ? (
                <span className="inline-flex items-center gap-2 text-sm text-emerald-700">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      paused ? "bg-yellow-400" : "bg-emerald-500"
                    }`}
                  />
                  {paused ? "Paused" : "Running"}
                </span>
              ) : (
                <span className="text-sm text-slate-500">Idle</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Actions</div>
            <div className="mt-2 flex flex-col gap-2">
              <Button onClick={downloadLogs} variant="outline">
                Download Session Logs
              </Button>
              <Button onClick={resetDemo} variant="ghost">
                Reset Demo
              </Button>
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-3">
            Note: This is a demo simulator and not connected to live markets.
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Simulation helpers -------------------- */

/** simulateTick: generates a single tick result based on strategy and balance
 * Returns { pair, side, pnl }
 */
function simulateTick(
  currentBalance: number,
  strategyKey: keyof typeof strategies
) {
  const cfg = strategies[strategyKey];
  const isWin = Math.random() < cfg.winProb;
  const pairOptions = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "BTC/USD"];
  const pair = pairOptions[Math.floor(Math.random() * pairOptions.length)];
  const side = Math.random() < 0.5 ? "BUY" : "SELL";

  const pctRange = isWin ? cfg.gainPct : cfg.lossPct;
  const pct = pctRange[0] + Math.random() * (pctRange[1] - pctRange[0]); // fraction (e.g., 0.005 => 0.5%)
  const rawPnl = currentBalance * pct * (isWin ? 1 : -1);

  // round to 2 decimals and clamp tiny noise
  const pnl = Math.round(rawPnl * 100) / 100;
  return { pair, side, pnl };
}
