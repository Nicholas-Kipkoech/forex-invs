"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LogItem {
  ts: string;
  text: string;
  kind?: "info" | "success" | "error";
}

interface ActivityLogProps {
  logs: LogItem[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="bg-black text-green-300 font-mono text-sm p-4 rounded-2xl border border-emerald-900 max-h-80 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-400">Activity Log</div>
        <div className="text-xs text-slate-500">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
      <div className="space-y-1">
        {logs.length === 0 && (
          <div className="text-slate-600">
            No activity — start the feed and place orders.
          </div>
        )}
        <AnimatePresence initial={false}>
          {logs
            .slice()
            .reverse()
            .map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                layout
                className={
                  l.kind === "error"
                    ? "text-rose-400"
                    : l.kind === "success"
                    ? "text-emerald-300"
                    : "text-green-300"
                }
              >
                <span className="text-slate-500 mr-2">[{l.ts}]</span>
                {l.text}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
