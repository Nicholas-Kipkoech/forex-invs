"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DollarSign, TrendingUp, Globe, Info } from "lucide-react";

export default function CurrencyPairs() {
  const majorPairs = [
    {
      pair: "EUR/USD",
      name: "Euro / US Dollar",
      nickname: "The Fiber",
      characteristics: [
        "Most liquid currency pair",
        "Tight spreads (0.5-2 pips)",
        "Best for beginners",
        "Active during London and US sessions",
      ],
      volatility: "Low-Medium",
    },
    {
      pair: "GBP/USD",
      name: "British Pound / US Dollar",
      nickname: "The Cable",
      characteristics: [
        "High volatility",
        "Wider spreads (1-3 pips)",
        "Sensitive to UK economic data",
        "Strong trends",
      ],
      volatility: "High",
    },
    {
      pair: "USD/JPY",
      name: "US Dollar / Japanese Yen",
      nickname: "The Gopher",
      characteristics: [
        "Safe haven currency",
        "Low spreads (0.5-2 pips)",
        "Influenced by Bank of Japan",
        "Popular for carry trades",
      ],
      volatility: "Medium",
    },
    {
      pair: "USD/CHF",
      name: "US Dollar / Swiss Franc",
      nickname: "The Swissy",
      characteristics: [
        "Safe haven currency",
        "Low volatility",
        "Inverse correlation with EUR/USD",
        "Stable movements",
      ],
      volatility: "Low",
    },
    {
      pair: "AUD/USD",
      name: "Australian Dollar / US Dollar",
      nickname: "The Aussie",
      characteristics: [
        "Commodity currency",
        "Correlated with gold prices",
        "Active during Asian session",
        "Higher interest rates",
      ],
      volatility: "Medium-High",
    },
    {
      pair: "USD/CAD",
      name: "US Dollar / Canadian Dollar",
      nickname: "The Loonie",
      characteristics: [
        "Commodity currency",
        "Correlated with oil prices",
        "Stable economy",
        "Good for swing trading",
      ],
      volatility: "Medium",
    },
    {
      pair: "NZD/USD",
      name: "New Zealand Dollar / US Dollar",
      nickname: "The Kiwi",
      characteristics: [
        "Commodity currency",
        "Higher volatility",
        "Correlated with dairy prices",
        "Smaller economy",
      ],
      volatility: "High",
    },
  ];

  const minorPairs = [
    { pair: "EUR/GBP", name: "Euro / British Pound" },
    { pair: "EUR/JPY", name: "Euro / Japanese Yen" },
    { pair: "GBP/JPY", name: "British Pound / Japanese Yen" },
    { pair: "AUD/JPY", name: "Australian Dollar / Japanese Yen" },
    { pair: "EUR/AUD", name: "Euro / Australian Dollar" },
    { pair: "GBP/CHF", name: "British Pound / Swiss Franc" },
  ];

  const exoticPairs = [
    { pair: "USD/ZAR", name: "US Dollar / South African Rand" },
    { pair: "USD/TRY", name: "US Dollar / Turkish Lira" },
    { pair: "USD/MXN", name: "US Dollar / Mexican Peso" },
    { pair: "EUR/TRY", name: "Euro / Turkish Lira" },
    { pair: "GBP/ZAR", name: "British Pound / South African Rand" },
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
          Currency Pairs Guide
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Understand major, minor, and exotic currency pairs. Learn their characteristics, volatility, and best trading times.
        </p>
      </motion.div>

      {/* Major Pairs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <DollarSign className="h-8 w-8 text-emerald-400" />
          <h2 className="text-3xl font-bold text-white">Major Currency Pairs</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Major pairs include the US Dollar and are the most traded pairs, offering high liquidity and tight spreads.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {majorPairs.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-1">{pair.pair}</h3>
                  <p className="text-slate-300 text-sm">{pair.name}</p>
                  <p className="text-emerald-500/70 text-xs mt-1">"{pair.nickname}"</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  pair.volatility === "High" ? "bg-red-500/20 text-red-400" :
                  pair.volatility === "Low" ? "bg-green-500/20 text-green-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {pair.volatility}
                </span>
              </div>
              <ul className="space-y-2">
                {pair.characteristics.map((char, idx) => (
                  <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                    <Info className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Minor Pairs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Minor Currency Pairs</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Minor pairs (cross pairs) don't include the US Dollar. They typically have wider spreads and less liquidity.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {minorPairs.map((pair, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-1">{pair.pair}</h3>
              <p className="text-slate-300 text-sm">{pair.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Exotic Pairs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Exotic Currency Pairs</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Exotic pairs include one major currency and one from an emerging economy. High volatility, wide spreads, and higher risk.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {exoticPairs.map((pair, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-yellow-500/20 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-yellow-400 mb-1">{pair.pair}</h3>
              <p className="text-slate-300 text-sm">{pair.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trading Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Trading Tips</h2>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Start with majors:</strong> EUR/USD, GBP/USD, and USD/JPY offer the best liquidity and tightest spreads.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Understand volatility:</strong> High volatility pairs (GBP/JPY) offer more profit potential but higher risk.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Consider spreads:</strong> Wider spreads on exotic pairs can eat into profits - factor this into your strategy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Session awareness:</strong> Trade pairs during their most active sessions for better liquidity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Correlation:</strong> Understand correlations between pairs (e.g., EUR/USD vs USD/CHF are inversely correlated).</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-300 mb-4 text-lg">
          Ready to trade currency pairs?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
            >
              Practice on Demo Account
            </motion.button>
          </Link>
          <Link href="/learning/technical-analysis">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl border border-emerald-500/20"
            >
              Learn Technical Analysis →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

