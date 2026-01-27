"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Monitor, BarChart3, Settings, Zap, Layers, BookOpen } from "lucide-react";

export default function MT5Guide() {
  const features = [
    {
      title: "Advanced Charting",
      icon: BarChart3,
      description: "Professional charts with 21 timeframes, 38+ technical indicators, and drawing tools.",
      details: [
        "Multiple chart types: candlestick, bar, line, tick",
        "21 timeframes from M1 to MN1",
        "38+ built-in technical indicators",
        "Drawing tools: trendlines, Fibonacci, shapes",
        "Customizable chart templates",
      ],
    },
    {
      title: "Market Watch",
      icon: Monitor,
      description: "Real-time price quotes for all trading instruments.",
      details: [
        "View bid/ask prices in real-time",
        "Monitor multiple symbols simultaneously",
        "Quick order placement from Market Watch",
        "Customizable columns and display",
        "Price alerts and notifications",
      ],
    },
    {
      title: "Order Management",
      icon: Settings,
      description: "Place and manage orders with advanced execution types.",
      details: [
        "Market orders: instant execution",
        "Pending orders: Buy Limit, Sell Limit, Buy Stop, Sell Stop",
        "Trailing stop for automatic profit protection",
        "One-click trading for fast execution",
        "Order history and trade journal",
      ],
    },
    {
      title: "Expert Advisors (EAs)",
      icon: Zap,
      description: "Automated trading robots that execute trades based on algorithms.",
      details: [
        "Create or download EAs from MQL5 marketplace",
        "Backtest strategies on historical data",
        "Run multiple EAs simultaneously",
        "Optimize parameters for best results",
        "Monitor EA performance in real-time",
      ],
    },
    {
      title: "Multi-Asset Trading",
      icon: Layers,
      description: "Trade forex, stocks, commodities, and indices from one platform.",
      details: [
        "Forex: 50+ currency pairs",
        "Stocks: thousands of instruments",
        "Commodities: gold, oil, silver",
        "Indices: major global indices",
        "Cryptocurrencies (on some brokers)",
      ],
    },
    {
      title: "Mobile & Web Trading",
      icon: BookOpen,
      description: "Access your account from anywhere with mobile and web platforms.",
      details: [
        "MT5 mobile app for iOS and Android",
        "Web terminal for browser trading",
        "Synchronized across all devices",
        "Push notifications for trades",
        "Full account management on mobile",
      ],
    },
  ];

  const gettingStarted = [
    {
      step: "1",
      title: "Download MT5",
      description: "Download MetaTrader 5 from your broker's website or the official MT5 website.",
    },
    {
      step: "2",
      title: "Install & Login",
      description: "Install the platform and login with your trading account credentials.",
    },
    {
      step: "3",
      title: "Navigate Interface",
      description: "Familiarize yourself with Market Watch, Charts, Terminal, and Navigator panels.",
    },
    {
      step: "4",
      title: "Open Charts",
      description: "Right-click on a symbol in Market Watch and select 'Chart Window' to open a chart.",
    },
    {
      step: "5",
      title: "Add Indicators",
      description: "Right-click chart → Insert → Indicator. Choose from Moving Averages, RSI, MACD, etc.",
    },
    {
      step: "6",
      title: "Place Orders",
      description: "Right-click chart → Trading → New Order. Set volume, stop loss, and take profit.",
    },
  ];

  const tips = [
    "Use keyboard shortcuts for faster trading (F9 for new order, F10 for Market Watch).",
    "Save chart templates with your favorite indicators and settings.",
    "Use the Strategy Tester to backtest trading strategies before going live.",
    "Set up price alerts to be notified when price reaches certain levels.",
    "Customize toolbars to have quick access to frequently used features.",
    "Use the Depth of Market (DOM) to see order book depth and liquidity.",
    "Enable 'One-Click Trading' for faster order execution.",
    "Regularly backup your settings, templates, and EAs.",
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
          MetaTrader 5 Guide
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Complete guide to using MT5 platform. Learn charts, indicators, orders, Expert Advisors, and advanced features.
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
          <h2 className="text-2xl font-bold mb-4 text-white">What is MetaTrader 5?</h2>
          <p className="text-slate-200 leading-relaxed">
            MetaTrader 5 (MT5) is the most popular trading platform for forex and CFD trading. It offers advanced charting,
            technical analysis tools, automated trading with Expert Advisors, and access to multiple financial markets.
            MT5 is used by millions of traders worldwide and is considered the industry standard.
          </p>
        </div>
      </motion.div>

      {/* Features */}
      <div className="mt-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Key MT5 Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-6 w-6 text-emerald-400" />
                  <h3 className="text-xl font-semibold text-emerald-300">{feature.title}</h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="text-slate-400 text-xs flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Getting Started with MT5
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gettingStarted.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-cyan-300">{item.title}</h3>
              </div>
              <p className="text-slate-300 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Common Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Popular MT5 Indicators
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "Moving Average (MA)", use: "Identify trends and support/resistance levels" },
            { name: "RSI (Relative Strength Index)", use: "Measure overbought/oversold conditions" },
            { name: "MACD", use: "Identify trend changes and momentum" },
            { name: "Bollinger Bands", use: "Measure volatility and potential reversals" },
            { name: "Fibonacci Retracement", use: "Identify potential support/resistance levels" },
            { name: "Stochastic Oscillator", use: "Find entry and exit points" },
            { name: "ADX (Average Directional Index)", use: "Measure trend strength" },
            { name: "Ichimoku Cloud", use: "Comprehensive trend and support/resistance analysis" },
          ].map((indicator, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-4"
            >
              <h3 className="text-emerald-300 font-semibold mb-1">{indicator.name}</h3>
              <p className="text-slate-400 text-sm">{indicator.use}</p>
            </div>
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
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">MT5 Pro Tips</h2>
          <ul className="space-y-3 text-slate-200">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
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
          Practice using MT5 on our demo account.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
            >
              Try MT5 Demo
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

