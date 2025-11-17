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
        "Market Order – Buy/sell immediately at current price",
        "Limit Order – Buy/sell at a specific price",
        "Stop-Loss Order – Automatically exit to limit losses",
      ],
    },
    {
      title: "Choose a Broker",
      icon: BookOpen,
      content: [
        "Look for low fees, good execution speed, and reliability.",
        "Examples: Interactive Brokers, eToro, Saxo Bank",
      ],
    },
    {
      title: "Read Charts",
      icon: Compass,
      content: [
        "Learn candlestick patterns, support/resistance, and trend lines.",
        "Use TradingView or broker charts.",
      ],
    },
    {
      title: "Timeframes",
      icon: Compass,
      content: [
        "Short-term (day trading) vs long-term (investing).",
        "Pick the timeframes that match your strategy.",
      ],
    },
    {
      title: "Practice",
      icon: CheckCircle,
      content: [
        "Start with demo accounts or paper trading.",
        "Focus on learning and consistency first.",
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
          Trading Basics
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Learn how markets work, order types, charting, and strategies to start
          trading with confidence.
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
