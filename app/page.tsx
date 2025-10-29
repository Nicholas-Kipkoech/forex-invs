"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LineChart, TrendingUp, Lock, Globe } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent"
        >
          Trade Smarter. Grow Faster.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mt-6 text-slate-300 text-lg"
        >
          Real-time market data, AI insights, and secure crypto deposits —
          everything you need to master your investments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-6 py-3 rounded-xl">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 text-lg px-6 py-3 rounded-xl"
            >
              Login
            </Button>
          </Link>
        </motion.div>

        {/* Floating glow */}
        <div className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-3xl"></div>
      </section>

      {/* TradingView Preview Section */}
      <section className="relative flex flex-col items-center py-20 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-emerald-400">
          Live Market Overview
        </h2>
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_8b80d&symbol=NASDAQ:AAPL&interval=15&hide_top_toolbar=1&hide_legend=1&theme=dark"
            style={{ height: "500px", width: "100%" }}
          ></iframe>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          {[
            {
              icon: <LineChart className="h-10 w-10 text-emerald-400" />,
              title: "Live Price Feeds",
              text: "Real-time updates for stocks, ETFs, bonds, and crypto — no delays, no noise.",
            },
            {
              icon: <TrendingUp className="h-10 w-10 text-emerald-400" />,
              title: "AI-Driven Insights",
              text: "Smart analytics that highlight opportunities before others even notice.",
            },
            {
              icon: <Lock className="h-10 w-10 text-emerald-400" />,
              title: "Secure crypto Deposits",
              text: "Instantly fund your account using Bitcoin and USDT with multilayer encryption.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-slate-950/40 border border-emerald-400/20 rounded-2xl shadow-lg backdrop-blur-xl transition"
            >
              <div className="flex items-center gap-3 mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-300 text-sm">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global CTA */}
      <section className="text-center py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent"
        >
          Ready to Trade the Future?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-slate-300 mb-10"
        >
          Join thousands of investors leveraging next-gen analytics and secure
          crypto deposits.
        </motion.p>
        <Link href="/register">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-xl">
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/10 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          <span>
            © {new Date().getFullYear()} NexTrade Global Incorporation
          </span>
        </div>
      </footer>
    </div>
  );
}
