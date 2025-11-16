"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderPanelProps {
  side: "BUY" | "SELL";
  setSide: (s: "BUY" | "SELL") => void;
  shares: number;
  setShares: (n: number) => void;
  tpMode: "percent" | "dollar";
  setTpMode: (s: "percent" | "dollar") => void;
  tpValue: number;
  setTpValue: (n: number) => void;
  slMode: "percent" | "dollar";
  setSlMode: (s: "percent" | "dollar") => void;
  slValue: number;
  setSlValue: (n: number) => void;
  strategy: string;
  setStrategy: (s: any) => void;
  speed: "slow" | "normal" | "fast";
  setSpeed: (s: any) => void;
  placeOrder: () => void;
  clearPositions: () => void;
  strategies: Record<string, { note: string }>;
}

export function OrderPanel({
  side,
  setSide,
  shares,
  setShares,
  tpMode,
  setTpMode,
  tpValue,
  setTpValue,
  slMode,
  setSlMode,
  slValue,
  setSlValue,
  strategy,
  setStrategy,
  strategies,
  speed,
  setSpeed,
  placeOrder,
  clearPositions,
}: OrderPanelProps) {
  return (
    <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Stock & Strategy */}
      <div className="md:col-span-1 p-2">
        <label className="text-xs text-slate-400">Strategy</label>
        <select
          className="w-full mt-2 p-2 rounded-md bg-[#06161a] border border-[#123022] text-slate-200"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          {Object.keys(strategies).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <div className="text-xs text-slate-500 mt-2">
          {strategies[strategy].note}
        </div>
      </div>

      {/* Order Inputs */}
      <div className="md:col-span-1 p-2">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setSide("BUY")}
            className={`flex-1 py-2 rounded ${
              side === "BUY"
                ? "bg-emerald-500 text-black"
                : "border border-[#123022]"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("SELL")}
            className={`flex-1 py-2 rounded ${
              side === "SELL"
                ? "bg-rose-500 text-black"
                : "border border-[#123022]"
            }`}
          >
            Sell
          </button>
        </div>

        <label className="text-xs text-slate-400">Shares</label>
        <Input
          type="number"
          min={1}
          value={shares}
          onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
        />

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
            <Input
              type="number"
              value={tpValue}
              onChange={(e) => setTpValue(Number(e.target.value))}
              className="mt-2"
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
            <Input
              type="number"
              value={slValue}
              onChange={(e) => setSlValue(Number(e.target.value))}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
            onClick={clearPositions}
            className="text-black"
            variant="outline"
          >
            Clear Positions
          </Button>
        </div>
      </div>
    </div>
  );
}
