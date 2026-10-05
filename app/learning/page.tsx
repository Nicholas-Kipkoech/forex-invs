"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpenCheck,
  LineChart,
  Brain,
  ShieldCheck,
  Compass,
  Globe,
  DollarSign,
  TrendingUp,
  Copy,
  Monitor,
  BookOpen,
  PlayCircle,
  FileText,
} from "lucide-react";

const categories = [
  {
    title: "Forex Basics",
    desc: "Introduction to forex trading, currency pairs, pips, lots, and market fundamentals.",
    icon: Globe,
    slug: "forex-basics",
    level: "Beginner",
  },
  {
    title: "Currency Pairs",
    desc: "Understanding major, minor, and exotic pairs. Learn about the most traded currencies.",
    icon: DollarSign,
    slug: "currency-pairs",
    level: "Beginner",
  },
  {
    title: "Technical Analysis",
    desc: "Candlestick patterns, indicators, support & resistance, and chart patterns for forex.",
    icon: LineChart,
    slug: "technical-analysis",
    level: "Intermediate",
  },
  {
    title: "Fundamental Analysis",
    desc: "Economic indicators, central bank policies, news trading, and market sentiment.",
    icon: TrendingUp,
    slug: "fundamental-analysis",
    level: "Intermediate",
  },
  {
    title: "Trading Strategies",
    desc: "Scalping, day trading, swing trading, trend following, and breakout strategies.",
    icon: Compass,
    slug: "trading-strategies",
    level: "Advanced",
  },
  {
    title: "Risk Management",
    desc: "Position sizing, stop-losses, leverage, margin, and protecting your capital.",
    icon: ShieldCheck,
    slug: "risk-management",
    level: "Intermediate",
  },
  {
    title: "Copy Trading Guide",
    desc: "How to use copy trading effectively, choosing traders, risk management, and best practices.",
    icon: Copy,
    slug: "copy-trading-guide",
    level: "Beginner",
  },
  {
    title: "MT5 Platform Guide",
    desc: "Complete guide to MetaTrader 5: charts, indicators, Expert Advisors, and order execution.",
    icon: Monitor,
    slug: "mt5-guide",
    level: "Beginner",
  },
  {
    title: "Market Psychology",
    desc: "Emotions, discipline, FOMO, greed, fear, and building consistent trading habits.",
    icon: Brain,
    slug: "market-psychology",
    level: "Intermediate",
  },
  {
    title: "Forex Glossary",
    desc: "Comprehensive dictionary of forex terms, definitions, and trading jargon explained simply.",
    icon: BookOpen,
    slug: "forex-glossary",
    level: "All Levels",
  },
];

export default function LearningPage() {
  return (
    <div className="min-h-screen px-6 md:px-12 py-20 bg-slate-950 text-white">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent"
      >
        Learning Center
      </motion.h1>

      <p className="text-slate-400 text-center max-w-2xl mx-auto mt-4">
        Comprehensive forex trading education from beginner to advanced. Learn at your own pace and master currency trading.
      </p>

      {/* Quick Stats */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 mb-14">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">10+</div>
          <div className="text-sm text-gray-400">Learning Modules</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">100+</div>
          <div className="text-sm text-gray-400">Topics Covered</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">Free</div>
          <div className="text-sm text-gray-400">All Resources</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Link key={i} href={`/learning/${cat.slug}`}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-slate-900 border border-emerald-500/20 rounded-2xl shadow-lg hover:shadow-emerald-500/20 cursor-pointer h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                    <h3 className="text-xl font-semibold text-emerald-300">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                    {cat.level}
                  </span>
                </div>

                <p className="text-slate-300 text-sm mb-4 flex-1">{cat.desc}</p>

                <div className="text-emerald-400 font-medium text-sm hover:underline flex items-center gap-1">
                  Learn More
                  <span>→</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-20 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Additional Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-6">
            <PlayCircle className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-400">
              Step-by-step video guides covering all aspects of forex trading.
            </p>
          </div>
          <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-6">
            <FileText className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Trading Plans</h3>
            <p className="text-sm text-gray-400">
              Downloadable trading plan templates and strategy worksheets.
            </p>
          </div>
          <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-6">
            <BookOpenCheck className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Practice Account</h3>
            <p className="text-sm text-gray-400">
              Try our demo account to practice trading without risk.
            </p>
            <Link href="/dashboard/demo" className="text-emerald-400 text-sm mt-2 inline-block hover:underline">
              Open Demo Account →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
