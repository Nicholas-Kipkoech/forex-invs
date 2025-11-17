"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpenCheck,
  LineChart,
  Brain,
  ShieldCheck,
  Compass,
} from "lucide-react";

const categories = [
  {
    title: "Trading Basics",
    desc: "Understanding markets, order types, brokers, and charting foundations.",
    icon: Compass,
    slug: "trading-basics",
  },
  {
    title: "Technical Analysis",
    desc: "Candlestick patterns, indicators, support & resistance, and trends.",
    icon: LineChart,
    slug: "technical-analysis",
  },
  {
    title: "Risk Management",
    desc: "Position sizing, stop-losses, compounding, and maximizing longevity.",
    icon: ShieldCheck,
    slug: "risk-management",
  },
  {
    title: "Market Psychology",
    desc: "Emotions, discipline, FOMO, greed, fear, and building consistency.",
    icon: Brain,
    slug: "market-psychology",
  },
  {
    title: "Halal & Ethical Investing",
    desc: "Shariah-compliant investing, screening ETFs, and ethical approaches.",
    icon: BookOpenCheck,
    slug: "halal-investing",
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
        Beginner-friendly lessons, in-depth guides, and expert-backed
        strategies. Learn at your own pace and master the markets.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-slate-900 border border-emerald-500/20 rounded-2xl shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <Icon className="h-8 w-8 text-emerald-400" />
                <h3 className="text-xl font-semibold text-emerald-300">
                  {cat.title}
                </h3>
              </div>

              <p className="text-slate-300 text-sm mb-4">{cat.desc}</p>

              <Link
                href={`/learning/${cat.slug}`}
                className="text-emerald-400 font-medium text-sm hover:underline"
              >
                Read more →
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
