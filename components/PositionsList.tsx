"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Position {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  shares: number;
  target?: number;
  stop?: number;
  pnl?: number;
  closed?: boolean;
}

interface PositionsListProps {
  positions: Position[];
  closePosition: (id: string) => void;
}

export function PositionsList({
  positions,
  closePosition,
}: PositionsListProps) {
  return (
    <div className="bg-[#071018] border border-[#102427] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-400">Positions</div>
        <div className="text-xs text-slate-500">{positions.length} total</div>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {positions.length === 0 && (
          <div className="text-slate-500 text-sm">No open positions yet.</div>
        )}

        <AnimatePresence>
          {positions.map((pos) => (
            <motion.div
              key={pos.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
              className="flex items-center justify-between p-3 bg-[#06161a] rounded-lg border border-[#123022]"
            >
              <div>
                <div className="text-sm font-semibold">
                  {pos.symbol} • {pos.side}
                </div>
                <div className="text-xs text-slate-400">
                  Entry ${pos.entryPrice.toFixed(2)} • {pos.shares} shares
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  TP {pos.target ? `$${pos.target.toFixed(2)}` : "—"} • SL{" "}
                  {pos.stop ? `$${pos.stop.toFixed(2)}` : "—"}
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
                  {pos.pnl !== undefined ? `$${pos.pnl.toFixed(2)}` : "-"}
                </div>
                {!pos.closed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => closePosition(pos.id)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
