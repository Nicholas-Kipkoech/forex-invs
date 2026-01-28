"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Clock, TrendingUp, Target, BarChart3, ArrowRight } from "lucide-react";

export default function TradingStrategies() {
  const strategies = [
    {
      name: "Scalping",
      icon: Zap,
      timeframe: "M1, M5",
      holdingTime: "Seconds to minutes",
      description: "Quick trades capturing small price movements. High frequency, low profit per trade.",
      pros: [
        "Quick profits",
        "Less exposure to market risk",
        "Many opportunities daily",
      ],
      cons: [
        "Requires constant attention",
        "High transaction costs",
        "Stressful and demanding",
      ],
      bestFor: "Experienced traders with fast execution",
      riskLevel: "High",
    },
    {
      name: "Day Trading",
      icon: Clock,
      timeframe: "M15, H1",
      holdingTime: "Hours",
      description: "Open and close positions within the same trading day. No overnight positions.",
      pros: [
        "No overnight risk",
        "Clear daily routine",
        "Good for active traders",
      ],
      cons: [
        "Requires full-time attention",
        "Emotionally demanding",
        "Need strong discipline",
      ],
      bestFor: "Full-time traders with time to monitor markets",
      riskLevel: "Medium-High",
    },
    {
      name: "Swing Trading",
      icon: TrendingUp,
      timeframe: "H4, D1",
      holdingTime: "Days to weeks",
      description: "Capture medium-term price swings. Hold positions for several days.",
      pros: [
        "Less time-intensive",
        "Capture larger moves",
        "More relaxed approach",
      ],
      cons: [
        "Overnight risk",
        "Requires patience",
        "Need larger stop losses",
      ],
      bestFor: "Part-time traders with patience",
      riskLevel: "Medium",
    },
    {
      name: "Trend Following",
      icon: ArrowRight,
      timeframe: "H4, D1, W1",
      holdingTime: "Weeks to months",
      description: "Ride strong trends until they reverse. 'The trend is your friend'.",
      pros: [
        "Profits from strong moves",
        "Clear entry/exit signals",
        "Works in trending markets",
      ],
      cons: [
        "False breakouts",
        "Late entries",
        "Requires trend identification",
      ],
      bestFor: "Patient traders who can ride trends",
      riskLevel: "Medium",
    },
    {
      name: "Breakout Trading",
      icon: Target,
      timeframe: "H1, H4",
      holdingTime: "Hours to days",
      description: "Trade when price breaks through support/resistance levels.",
      pros: [
        "Clear entry signals",
        "High profit potential",
        "Works in volatile markets",
      ],
      cons: [
        "False breakouts common",
        "Need confirmation",
        "Can be whipsawed",
      ],
      bestFor: "Traders who understand support/resistance",
      riskLevel: "Medium-High",
    },
    {
      name: "Range Trading",
      icon: BarChart3,
      timeframe: "H1, H4",
      holdingTime: "Hours to days",
      description: "Buy at support, sell at resistance in sideways markets.",
      pros: [
        "Clear boundaries",
        "Predictable patterns",
        "Lower risk in ranges",
      ],
      cons: [
        "Limited profit potential",
        "Breakouts can cause losses",
        "Requires range identification",
      ],
      bestFor: "Traders comfortable with sideways markets",
      riskLevel: "Low-Medium",
    },
  ];

  const strategySteps = [
    {
      step: "1",
      title: "Choose Your Strategy",
      description: "Select a strategy that matches your personality, time availability, and risk tolerance.",
    },
    {
      step: "2",
      title: "Learn the Rules",
      description: "Understand entry signals, exit rules, and risk management for your chosen strategy.",
    },
    {
      step: "3",
      title: "Backtest",
      description: "Test your strategy on historical data to see if it would have been profitable.",
    },
    {
      step: "4",
      title: "Demo Trade",
      description: "Practice on a demo account for at least 1-2 months before going live.",
    },
    {
      step: "5",
      title: "Start Small",
      description: "Begin with small position sizes and gradually increase as you gain confidence.",
    },
    {
      step: "6",
      title: "Review & Improve",
      description: "Keep a trading journal, review your trades, and continuously refine your strategy.",
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
          Forex Trading Strategies
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Discover proven trading strategies from scalping to swing trading. Find the approach that fits your style and goals.
        </p>
      </motion.div>

      {/* Strategies Grid */}
      <div className="mt-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy, i) => {
            const Icon = strategy.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-xl font-semibold text-emerald-300">{strategy.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    strategy.riskLevel === "High" ? "bg-red-500/20 text-red-400" :
                    strategy.riskLevel === "Medium-High" ? "bg-orange-500/20 text-orange-400" :
                    strategy.riskLevel === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {strategy.riskLevel}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-slate-300 text-sm mb-2">{strategy.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Timeframe: {strategy.timeframe}</span>
                    <span>Hold: {strategy.holdingTime}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-emerald-400 font-semibold mb-2">Pros:</p>
                  <ul className="space-y-1 mb-3">
                    {strategy.pros.map((pro, idx) => (
                      <li key={idx} className="text-slate-300 text-xs flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-red-400 font-semibold mb-2">Cons:</p>
                  <ul className="space-y-1">
                    {strategy.cons.map((con, idx) => (
                      <li key={idx} className="text-slate-300 text-xs flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Best for:</strong> {strategy.bestFor}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Implementation Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          How to Implement a Trading Strategy
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategySteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-cyan-300">{step.title}</h3>
              </div>
              <p className="text-slate-300 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Strategy Selection Tips</h2>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Match your personality:</strong> If you're patient, swing trading fits better than scalping.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Consider your schedule:</strong> Day trading requires full-time attention; swing trading is more flexible.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Start simple:</strong> Master one strategy before trying others.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Test thoroughly:</strong> Never trade a strategy live without extensive demo testing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Adapt to market conditions:</strong> Some strategies work better in trending markets, others in ranges.</span>
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
          Practice these strategies on our demo account before going live.
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
          <Link href="/learning/copy-trading-guide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl border border-emerald-500/20"
            >
              Learn Copy Trading →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}


