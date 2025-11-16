"use client";

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

interface ChartCardProps {
  priceSeries: { name: string; price: number }[];
  livePrice: number;
  symbol: string;
  name: string;
  vol: number;
  running: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  paused?: boolean;
}

export function ChartCard({
  priceSeries,
  livePrice,
  symbol,
  name,
  vol,
  running,
  paused,
  onStart,
  onPause,
  onStop,
}: ChartCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#071018] border border-[#102427] rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center font-bold text-black">
            {symbol}
          </div>
          <div>
            <div className="text-sm text-slate-400">{name}</div>
            <div className="text-2xl font-semibold text-emerald-200">{`$${livePrice.toFixed(
              2
            )}`}</div>
            <div className="text-xs text-slate-500">
              Volatility: {(vol * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!running && (
            <button
              onClick={onStart}
              className="bg-emerald-500 hover:bg-emerald-400 text-black py-1 px-3 rounded"
            >
              Start
            </button>
          )}
          {running && (
            <>
              <button
                onClick={onPause}
                className="border border-[#123022] rounded px-3 py-1"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={onStop}
                className="border border-[#123022] rounded px-3 py-1"
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div
        style={{ height: 320 }}
        className="rounded-lg overflow-hidden bg-[#06161a]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceSeries}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#082426" />
            <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
            <YAxis
              tick={{ fill: "#9CA3AF" }}
              width={80}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#34d399"
              fill="url(#priceGradient)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
