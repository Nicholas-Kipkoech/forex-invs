"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, BookOpen, Compass } from "lucide-react";

export default function TradingBasics() {
      const sections = [
    {
      title: "Understand Order Types",
      icon: Compass,
      content: [
        "Market Order – Buy/sell immediately at current market price",
        "Limit Order – Buy/sell at a specific price or better",
        "Stop-Loss Order – Automatically close position to limit losses",
        "Take-Profit Order – Automatically close position to lock in profits",
        "Pending Orders – Buy Limit, Sell Limit, Buy Stop, Sell Stop",
      ],
    },
    {
      title: "Choose a Forex Broker",
      icon: BookOpen,
      content: [
        "Look for low spreads, fast execution, and reliable platform (MT5).",
        "Check regulation, deposit/withdrawal options, and customer support.",
        "Compare spreads on major pairs (EUR/USD should be under 2 pips).",
        "Test with demo account before depositing real money.",
      ],
    },
    {
      title: "Read Forex Charts",
      icon: Compass,
      content: [
        "Learn candlestick patterns, support/resistance levels, and trend lines.",
        "Use MetaTrader 5 (MT5) or TradingView for professional charts.",
        "Understand bid/ask prices and spreads.",
        "Practice identifying trends and chart patterns.",
      ],
    },
    {
      title: "Forex Timeframes",
      icon: Compass,
      content: [
        "M1, M5, M15 – For scalping and day trading",
        "H1, H4 – For swing trading and medium-term positions",
        "D1, W1 – For position trading and long-term analysis",
        "Choose timeframes that match your trading style and schedule.",
      ],
    },
    {
      title: "Risk Management Basics",
      icon: CheckCircle,
      content: [
        "Never risk more than 1-2% of account per trade.",
        "Always use stop-loss orders to limit losses.",
        "Maintain proper risk/reward ratio (aim for 2:1 or better).",
        "Don't trade with money you can't afford to lose.",
      ],
    },
    {
      title: "Practice on Demo",
      icon: CheckCircle,
      content: [
        "Start with demo account to practice without risk.",
        "Focus on learning and developing consistency first.",
        "Treat demo trading seriously - it builds real habits.",
        "Only go live after consistent profitability on demo.",
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
          Forex Trading Basics
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Learn how forex markets work, order types, charting, and essential concepts to start
          trading currencies with confidence.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {sections.map((sec, i) => {
          const Icon = sec.icon;
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
                  {sec.title}
                </h2>
              </div>
              <ul className="text-slate-300 text-sm space-y-2 list-inside list-disc">
                {sec.content.map((line, idx) => (
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
          Ready to put your knowledge into action?
        </p>
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
          >
            Start Trading Today
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
