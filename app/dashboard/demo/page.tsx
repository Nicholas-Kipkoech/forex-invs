"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DemoPage() {
  const [balance, setBalance] = useState(1000);
  const [profit, setProfit] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [trading, setTrading] = useState(false);
  const [takeProfit, setTakeProfit] = useState(100);
  const [stopLoss, setStopLoss] = useState(50);
  const logRef = useRef<HTMLDivElement | null>(null);
  const tradeInterval = useRef<NodeJS.Timeout | null>(null);

  const baseLogs = [
    "Connecting to broker API...",
    "Fetching live market data...",
    "Analyzing trend and volatility...",
    "Applying strategy rules...",
    "Opening trade position...",
  ];

  // Scroll logs automatically
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  function pushLog(message: string) {
    setLogs((prev) => [...prev, message]);
  }

  async function startTrade() {
    if (trading) return;
    setTrading(true);
    setLogs([]);
    setProfit(0);

    // Initial setup logs
    for (const msg of baseLogs) {
      pushLog(`> ${msg}`);
      await new Promise((r) => setTimeout(r, 700));
    }

    pushLog("> Trade started. Monitoring market movements...");

    // Begin streaming simulated logs
    tradeInterval.current = setInterval(() => {
      const change = Math.random() * 20 - 10; // small random change (-10 to +10)
      setProfit((prev) => {
        const newProfit = prev + change;
        pushLog(
          `> Market tick: ${change >= 0 ? "+" : ""}${change.toFixed(
            2
          )} | Total: ${newProfit.toFixed(2)}`
        );

        // Auto close if TP or SL hit
        if (newProfit >= takeProfit) {
          pushLog(`✅ Take Profit reached (+$${newProfit.toFixed(2)})`);
          stopTrade(newProfit);
        } else if (Math.abs(newProfit) >= stopLoss && newProfit < 0) {
          pushLog(`❌ Stop Loss hit ($${newProfit.toFixed(2)})`);
          stopTrade(newProfit);
        }

        return newProfit;
      });
    }, 1000);
  }

  function stopTrade(finalProfit?: number) {
    if (tradeInterval.current) clearInterval(tradeInterval.current);
    setTrading(false);

    const result =
      finalProfit && finalProfit > 0
        ? `✅ Trade closed in profit: +$${finalProfit.toFixed(2)}`
        : finalProfit && finalProfit < 0
        ? `❌ Trade closed in loss: $${finalProfit.toFixed(2)}`
        : "⚙️ Trade stopped manually.";

    pushLog(`> ${result}`);
    setBalance((prev) => prev + (finalProfit || 0));
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-700">
        Demo Trading Simulator
      </h2>

      {/* Balance info */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-md">
        <p className="text-lg font-medium text-emerald-700">
          Balance: ${balance.toFixed(2)}
        </p>
        <p
          className={`text-sm mt-1 ${
            profit >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          Current P/L: {profit >= 0 ? "+" : ""}
          {profit.toFixed(2)}
        </p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Take Profit ($)
          </label>
          <Input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(Number(e.target.value))}
            disabled={trading}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Stop Loss ($)
          </label>
          <Input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            disabled={trading}
          />
        </div>
      </div>

      {/* Log terminal */}
      <div
        ref={logRef}
        className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-64 overflow-y-auto border border-emerald-800 shadow-inner"
      >
        {logs.length === 0 ? (
          <p className="opacity-50">
            No activity yet. Click “Start Trade” to begin...
          </p>
        ) : (
          logs.map((l, i) => (
            <div key={i} className="mb-1 animate-fadeIn">
              {l}
            </div>
          ))
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={startTrade}
          disabled={trading}
          className="bg-emerald-600 hover:bg-emerald-700 flex-1"
        >
          {trading ? "Running..." : "Start Trade"}
        </Button>
        <Button
          onClick={() => stopTrade(profit)}
          disabled={!trading}
          className="bg-rose-600 hover:bg-rose-700 flex-1"
        >
          Stop Trade
        </Button>
      </div>
    </div>
  );
}
