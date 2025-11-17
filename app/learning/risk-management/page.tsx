"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  DollarSign,
  ShieldCheck,
  PieChart,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function RiskManagement() {
  const topics = [
    {
      title: "Position Sizing",
      icon: DollarSign,
      content: [
        "Determine how much capital to risk per trade",
        "Example: 1-2% of your account",
      ],
    },
    {
      title: "Stop-Loss & Take-Profit",
      icon: ShieldCheck,
      content: [
        "Set automatic exits to limit losses",
        "Lock in profits with take-profit levels",
      ],
    },
    {
      title: "Diversification",
      icon: PieChart,
      content: [
        "Spread capital across assets, sectors, or strategies",
        "Reduce overall portfolio risk",
      ],
    },
    {
      title: "Risk/Reward Ratio",
      icon: TrendingUp,
      content: [
        "Aim for trades with higher reward than risk",
        "Example ratios: 2:1 or 3:1",
      ],
    },
    {
      title: "Continuous Review",
      icon: RefreshCw,
      content: [
        "Track trades and analyze mistakes",
        "Adjust strategies based on performance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 md:px-12 py-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
          Risk Management
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Protect your capital, control losses, and maintain consistency with
          smart risk strategies.
        </p>
      </motion.div>

      {/* Topics */}
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 shadow-lg flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-emerald-300">
                  {topic.title}
                </h2>
              </div>
              <ul className="text-slate-300 text-sm space-y-2 list-inside list-disc">
                {topic.content.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-300 mb-4 text-lg">
          Want to safeguard your trades and grow steadily?
        </p>
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
          >
            Learn Risk Strategies
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
