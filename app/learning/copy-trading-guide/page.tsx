"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, Users, TrendingUp, Shield, Target, CheckCircle, AlertTriangle } from "lucide-react";

export default function CopyTradingGuide() {
  const whatIsCopyTrading = [
    "Copy trading allows you to automatically replicate trades from experienced traders.",
    "You select traders to follow based on their performance, strategy, and risk level.",
    "Every trade they make is automatically copied to your account in real-time.",
    "You control how much capital to allocate and can stop copying anytime.",
  ];

  const benefits = [
    {
      icon: Users,
      title: "Learn from Experts",
      description: "Observe how professional traders analyze markets and execute trades.",
    },
    {
      icon: TrendingUp,
      title: "Passive Income",
      description: "Generate profits without actively trading yourself.",
    },
    {
      icon: Shield,
      title: "Diversification",
      description: "Copy multiple traders to spread risk across different strategies.",
    },
    {
      icon: Target,
      title: "Time Efficient",
      description: "No need to spend hours analyzing charts - let experts do it.",
    },
  ];

  const howToChoose = [
    {
      metric: "Win Rate",
      description: "Percentage of profitable trades. Look for 55%+ win rate.",
      ideal: "60-70%",
    },
    {
      metric: "Total Return",
      description: "Overall profit percentage over time. Check long-term performance.",
      ideal: "Consistent 10-20% monthly",
    },
    {
      metric: "Maximum Drawdown",
      description: "Largest peak-to-trough decline. Lower is better.",
      ideal: "Under 20%",
    },
    {
      metric: "Risk Score",
      description: "Trader's risk level. Match it to your risk tolerance.",
      ideal: "Low-Medium for beginners",
    },
    {
      metric: "Number of Trades",
      description: "Trading frequency. More trades = more opportunities.",
      ideal: "50+ trades/month",
    },
    {
      metric: "Average Trade Duration",
      description: "How long positions are held. Shorter = more active.",
      ideal: "Match your preference",
    },
  ];

  const bestPractices = [
    {
      title: "Start Small",
      description: "Begin with small copy amounts to test traders before increasing allocation.",
    },
    {
      title: "Diversify",
      description: "Copy 3-5 different traders with different strategies to spread risk.",
    },
    {
      title: "Monitor Regularly",
      description: "Check performance weekly and adjust allocations based on results.",
    },
    {
      title: "Set Stop Losses",
      description: "Use stop-loss features to limit losses if a trader underperforms.",
    },
    {
      title: "Understand Strategies",
      description: "Know what type of trading each trader uses (scalping, swing, etc.).",
    },
    {
      title: "Review Performance",
      description: "Regularly review trader statistics and remove underperformers.",
    },
  ];

  const risks = [
    "Past performance doesn't guarantee future results.",
    "Traders can have losing streaks - diversify to mitigate this.",
    "Market conditions change - strategies that worked may stop working.",
    "You're still responsible for risk management and capital allocation.",
    "Copy trading fees can eat into profits over time.",
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
          Copy Trading Guide
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Learn how to use copy trading effectively. Choose the right traders, manage risk, and maximize your profits.
        </p>
      </motion.div>

      {/* What is Copy Trading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Copy className="h-8 w-8 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">What is Copy Trading?</h2>
          </div>
          <ul className="space-y-3 text-slate-200">
            {whatIsCopyTrading.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Benefits of Copy Trading
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 text-center"
              >
                <Icon className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-emerald-300 mb-2">{benefit.title}</h3>
                <p className="text-slate-300 text-sm">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* How to Choose Traders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          How to Choose Traders to Copy
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howToChoose.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{item.metric}</h3>
              <p className="text-slate-300 text-sm mb-3">{item.description}</p>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
                <p className="text-xs text-cyan-400">
                  <strong>Ideal:</strong> {item.ideal}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Best Practices
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestPractices.map((practice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-emerald-300">{practice.title}</h3>
              </div>
              <p className="text-slate-300 text-sm">{practice.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Risks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Important Risks to Consider</h2>
          </div>
          <ul className="space-y-3 text-slate-200">
            {risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Step by Step */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Getting Started with Copy Trading
        </h2>
        <div className="space-y-6">
          {[
            { step: "1", title: "Research Traders", desc: "Browse our trader network, check performance stats, win rates, and risk levels." },
            { step: "2", title: "Select Traders", desc: "Choose 3-5 traders with different strategies and risk levels for diversification." },
            { step: "3", title: "Set Copy Amount", desc: "Decide how much capital to allocate to each trader. Start small and increase gradually." },
            { step: "4", title: "Configure Settings", desc: "Set stop-loss limits, maximum number of open positions, and risk multipliers." },
            { step: "5", title: "Start Copying", desc: "Activate copy trading. Trades will be automatically copied to your account." },
            { step: "6", title: "Monitor & Adjust", desc: "Regularly review performance and adjust allocations or stop copying underperformers." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="flex items-start gap-4 bg-slate-900/80 border border-emerald-500/20 rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900 flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-300 mb-1">{item.title}</h3>
                <p className="text-slate-300 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-300 mb-4 text-lg">
          Ready to start copy trading?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/copy-trading">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
            >
              Browse Traders
            </motion.button>
          </Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl border border-emerald-500/20"
            >
              Create Account →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}



