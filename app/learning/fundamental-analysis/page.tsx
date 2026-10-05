"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Calendar, Building2, Newspaper, BarChart3, Globe } from "lucide-react";

export default function FundamentalAnalysis() {
  const economicIndicators = [
    {
      name: "GDP (Gross Domestic Product)",
      description: "Measures total economic output. Higher GDP = stronger economy = stronger currency.",
      impact: "High",
      frequency: "Quarterly",
    },
    {
      name: "Interest Rates",
      description: "Set by central banks. Higher rates attract foreign investment = stronger currency.",
      impact: "Very High",
      frequency: "Monthly",
    },
    {
      name: "Inflation (CPI)",
      description: "Consumer Price Index measures price changes. Moderate inflation is healthy.",
      impact: "High",
      frequency: "Monthly",
    },
    {
      name: "Employment Data (NFP)",
      description: "Non-Farm Payrolls show job creation. Strong employment = strong economy.",
      impact: "Very High",
      frequency: "Monthly",
    },
    {
      name: "Retail Sales",
      description: "Measures consumer spending. Higher spending = economic growth.",
      impact: "Medium",
      frequency: "Monthly",
    },
    {
      name: "Trade Balance",
      description: "Difference between exports and imports. Surplus = stronger currency.",
      impact: "Medium",
      frequency: "Monthly",
    },
  ];

  const centralBanks = [
    {
      name: "Federal Reserve (Fed)",
      country: "United States",
      currency: "USD",
      importance: "Very High",
      description: "Most influential central bank. FOMC meetings drive USD movements.",
    },
    {
      name: "European Central Bank (ECB)",
      country: "Eurozone",
      currency: "EUR",
      importance: "Very High",
      description: "Manages monetary policy for 19 EU countries.",
    },
    {
      name: "Bank of England (BoE)",
      country: "United Kingdom",
      currency: "GBP",
      importance: "High",
      description: "MPC meetings significantly impact GBP pairs.",
    },
    {
      name: "Bank of Japan (BoJ)",
      country: "Japan",
      currency: "JPY",
      importance: "High",
      description: "Known for ultra-low interest rates and intervention.",
    },
  ];

  const tradingStrategies = [
    {
      title: "News Trading",
      icon: Newspaper,
      description: "Trade around major economic announcements.",
      steps: [
        "Monitor economic calendar for high-impact events",
        "Prepare positions before news release",
        "Use pending orders to catch breakouts",
        "Manage risk with tight stop losses",
      ],
    },
    {
      title: "Interest Rate Differentials",
      icon: TrendingUp,
      description: "Trade based on interest rate differences between countries.",
      steps: [
        "Identify countries with different interest rates",
        "Buy currency with higher interest rate",
        "Hold positions for longer periods (carry trade)",
        "Monitor central bank policy changes",
      ],
    },
    {
      title: "Economic Calendar Trading",
      icon: Calendar,
      description: "Plan trades around scheduled economic releases.",
      steps: [
        "Mark high-impact events on calendar",
        "Avoid trading during uncertain periods",
        "Wait for volatility to settle after news",
        "Trade breakouts or reversals post-release",
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
          Fundamental Analysis
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Learn how economic indicators, central bank policies, and global events drive currency movements.
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">What is Fundamental Analysis?</h2>
          <p className="text-slate-200 leading-relaxed">
            Fundamental analysis evaluates currencies by examining economic, social, and political factors that affect supply and demand.
            Unlike technical analysis (chart patterns), fundamental analysis looks at the underlying economic health of countries.
          </p>
        </div>
      </motion.div>

      {/* Economic Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-8 w-8 text-emerald-400" />
          <h2 className="text-3xl font-bold text-white">Key Economic Indicators</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {economicIndicators.map((indicator, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-emerald-300">{indicator.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  indicator.impact === "Very High" ? "bg-red-500/20 text-red-400" :
                  indicator.impact === "High" ? "bg-orange-500/20 text-orange-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {indicator.impact}
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{indicator.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Frequency: {indicator.frequency}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Central Banks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="h-8 w-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Major Central Banks</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {centralBanks.map((bank, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300">{bank.name}</h3>
                  <p className="text-slate-400 text-sm">{bank.country}</p>
                </div>
                <span className="text-lg font-bold text-cyan-400">{bank.currency}</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{bank.description}</p>
              <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">
                {bank.importance} Impact
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trading Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Fundamental Trading Strategies</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tradingStrategies.map((strategy, i) => {
            const Icon = strategy.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-slate-900/80 border border-yellow-500/20 rounded-2xl p-6"
              >
                <Icon className="h-8 w-8 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">{strategy.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{strategy.description}</p>
                <ul className="space-y-2">
                  {strategy.steps.map((step, idx) => (
                    <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Fundamental Analysis Tips</h2>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Use Economic Calendar:</strong> Always check scheduled releases before trading.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Compare Expectations:</strong> Market reaction depends on actual vs expected data.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Central Bank Statements:</strong> Read between the lines - tone matters more than words.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Combine with Technicals:</strong> Use fundamentals for direction, technicals for entry/exit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Avoid Trading During News:</strong> Spreads widen and volatility spikes unpredictably.</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-300 mb-4 text-lg">
          Combine fundamental and technical analysis for better trading results.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/learning/technical-analysis">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
            >
              Learn Technical Analysis
            </motion.button>
          </Link>
          <Link href="/learning/trading-strategies">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl border border-emerald-500/20"
            >
              Explore Trading Strategies →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}



