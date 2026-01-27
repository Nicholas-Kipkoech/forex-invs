"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Globe, DollarSign, TrendingUp, Clock, BookOpen } from "lucide-react";

export default function ForexBasics() {
  const sections = [
    {
      title: "What is Forex Trading?",
      icon: Globe,
      content: [
        "Forex (Foreign Exchange) is the global marketplace for trading currencies.",
        "It's the largest financial market in the world with over $7 trillion traded daily.",
        "Forex trading involves buying one currency while simultaneously selling another.",
        "The goal is to profit from changes in exchange rates between currency pairs.",
      ],
    },
    {
      title: "Understanding Currency Pairs",
      icon: DollarSign,
      content: [
        "Currency pairs show the exchange rate between two currencies (e.g., EUR/USD).",
        "Base currency (first) vs Quote currency (second).",
        "EUR/USD = 1.0850 means 1 Euro = 1.0850 US Dollars.",
        "Major pairs: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD.",
      ],
    },
    {
      title: "What are Pips?",
      icon: TrendingUp,
      content: [
        "Pip = Percentage In Point - smallest price movement in forex.",
        "For most pairs: 1 pip = 0.0001 (4 decimal places).",
        "For JPY pairs: 1 pip = 0.01 (2 decimal places).",
        "Example: EUR/USD moves from 1.0850 to 1.0851 = 1 pip movement.",
        "Pips measure profit/loss and spread costs.",
      ],
    },
    {
      title: "Understanding Lots",
      icon: BookOpen,
      content: [
        "Lot = standardized unit of currency traded.",
        "Standard lot = 100,000 units of base currency.",
        "Mini lot = 10,000 units (0.1 standard lot).",
        "Micro lot = 1,000 units (0.01 standard lot).",
        "Nano lot = 100 units (0.001 standard lot).",
        "Example: 1 standard lot EUR/USD = trading €100,000.",
      ],
    },
    {
      title: "Market Hours",
      icon: Clock,
      content: [
        "Forex market is open 24 hours, 5 days a week.",
        "Trading sessions: Sydney, Tokyo, London, New York.",
        "London session (8 AM - 4 PM GMT) = highest volume.",
        "Overlap periods (London + New York) = most volatility.",
        "Market closes Friday 5 PM EST, opens Sunday 5 PM EST.",
      ],
    },
    {
      title: "Getting Started",
      icon: CheckCircle,
      content: [
        "Open a demo account to practice without risk.",
        "Learn to read charts and understand price movements.",
        "Start with small position sizes (micro lots).",
        "Focus on major pairs (EUR/USD, GBP/USD) first.",
        "Develop a trading plan and stick to it.",
        "Never risk more than you can afford to lose.",
      ],
    },
  ];

  const keyConcepts = [
    {
      term: "Bid Price",
      definition: "The price at which you can sell a currency pair (lower price).",
    },
    {
      term: "Ask Price",
      definition: "The price at which you can buy a currency pair (higher price).",
    },
    {
      term: "Spread",
      definition: "The difference between bid and ask price (broker's commission).",
    },
    {
      term: "Long Position",
      definition: "Buying a currency pair, expecting it to rise in value.",
    },
    {
      term: "Short Position",
      definition: "Selling a currency pair, expecting it to fall in value.",
    },
    {
      term: "Leverage",
      definition: "Borrowed capital to increase trading position size (e.g., 1:100).",
    },
    {
      term: "Margin",
      definition: "Collateral required to open and maintain a leveraged position.",
    },
    {
      term: "Margin Call",
      definition: "Broker's demand for additional funds when account equity falls below margin requirement.",
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
          Master the fundamentals of forex trading. Learn about currency pairs, pips, lots, and how the forex market works.
        </p>
      </motion.div>

      {/* Main Sections */}
      <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        {sections.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-emerald-300">
                  {sec.title}
                </h2>
              </div>
              <ul className="text-slate-300 text-sm space-y-2">
                {sec.content.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Key Concepts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Key Forex Concepts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {keyConcepts.map((concept, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-4"
            >
              <h3 className="text-emerald-400 font-semibold mb-2">{concept.term}</h3>
              <p className="text-slate-300 text-sm">{concept.definition}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Example Trade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Example Trade</h2>
          <div className="space-y-3 text-slate-200">
            <p><strong className="text-emerald-400">Scenario:</strong> You believe EUR will strengthen against USD.</p>
            <p><strong className="text-emerald-400">Action:</strong> Buy EUR/USD at 1.0850</p>
            <p><strong className="text-emerald-400">Position Size:</strong> 0.1 lot (10,000 EUR)</p>
            <p><strong className="text-emerald-400">Price Moves:</strong> EUR/USD rises to 1.0900 (50 pips)</p>
            <p><strong className="text-emerald-400">Profit:</strong> 50 pips × 0.1 lot = $50 profit</p>
            <p className="text-sm text-gray-400 mt-4">
              Note: This is a simplified example. Real trading involves spreads, commissions, and risk management.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-300 mb-4 text-lg">
          Ready to start trading forex?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
            >
              Open Demo Account
            </motion.button>
          </Link>
          <Link href="/learning/currency-pairs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl border border-emerald-500/20"
            >
              Learn About Currency Pairs →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

