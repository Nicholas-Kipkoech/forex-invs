"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  TrendingUp,
  Lock,
  Globe,
  ShieldCheck,
  Users,
  Zap,
  Star,
} from "lucide-react";
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
          className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent leading-tight"
        >
          Trade Smarter.
          <br />
          Grow Faster. Dominate the Markets.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mt-6 text-slate-300 text-lg"
        >
          Access institutional-grade analytics, AI-driven signals, and secure
          blockchain-backed investing — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-6 py-3 rounded-xl shadow-lg shadow-emerald-700/30">
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
        <div className="absolute -z-10 w-[700px] h-[700px] rounded-full bg-emerald-600/10 blur-3xl"></div>
      </section>

      {/* Market Overview */}
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
        <p className="text-slate-400 mt-6 max-w-xl text-center">
          Real-time charts powered by TradingView. Stay ahead of market shifts
          with live sentiment and liquidity data.
        </p>
      </section>

      {/* Features */}
      <section className="py-28 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          {[
            {
              icon: <LineChart className="h-10 w-10 text-emerald-400" />,
              title: "Live Price Feeds",
              text: "Track real-time prices for stocks, ETFs, and crypto assets across global markets with zero latency.",
            },
            {
              icon: <TrendingUp className="h-10 w-10 text-emerald-400" />,
              title: "AI-Driven Insights",
              text: "Harness the power of predictive analytics and sentiment modeling to identify high-probability trades.",
            },
            {
              icon: <Lock className="h-10 w-10 text-emerald-400" />,
              title: "Secure Crypto Deposits",
              text: "Instantly fund your account via Bitcoin and USDT with bank-grade encryption and cold storage protection.",
            },
            {
              icon: <ShieldCheck className="h-10 w-10 text-emerald-400" />,
              title: "Regulatory Compliance",
              text: "Licensed under international standards with audited smart contracts ensuring full transparency.",
            },
            {
              icon: <Users className="h-10 w-10 text-emerald-400" />,
              title: "Community-Driven",
              text: "Join over 120,000 active investors sharing strategies, signals, and insights in our global network.",
            },
            {
              icon: <Zap className="h-10 w-10 text-emerald-400" />,
              title: "Lightning Execution",
              text: "Experience ultra-fast trade execution powered by our low-latency infrastructure and smart routing.",
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

      {/* Testimonials */}
      <section className="py-24 px-6 text-center bg-slate-950/70">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-emerald-400"
        >
          Trusted by Traders Worldwide
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah L.",
              text: "NexTrade changed how I invest. The AI insights are incredibly accurate and the interface is top-notch.",
            },
            {
              name: "David R.",
              text: "Depositing with crypto is seamless, and withdrawals are instant. I’m earning more with less stress.",
            },
            {
              name: "Aisha M.",
              text: "Global markets at my fingertips — from stocks to crypto, NexTrade is my go-to investment platform.",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-slate-900 border border-emerald-400/20 rounded-2xl shadow-md"
            >
              <Star className="h-6 w-6 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-300 text-sm italic mb-4">“{t.text}”</p>
              <h4 className="text-emerald-300 font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Globe className="h-10 w-10 mx-auto text-emerald-400 mb-4" />
        <h2 className="text-3xl font-bold text-emerald-400 mb-4">
          Global Market Access
        </h2>
        <p className="max-w-2xl mx-auto text-slate-300 mb-8">
          Trade in over{" "}
          <span className="text-emerald-300 font-semibold">80+</span> markets
          worldwide — from Wall Street to crypto exchanges — all from one
          unified dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-slate-400 text-sm">
          {[
            "New York",
            "London",
            "Tokyo",
            "Singapore",
            "Dubai",
            "Nairobi",
            "Sydney",
          ].map((city, i) => (
            <span
              key={i}
              className="border border-emerald-400/30 rounded-full px-4 py-1"
            >
              {city}
            </span>
          ))}
        </div>
      </section>

      {/* Call to Action */}
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
          Join thousands of investors leveraging next-gen analytics, secure
          crypto deposits, and instant global market access.
        </motion.p>
        <Link href="/register">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-700/30">
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/10 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          <span>
            © {new Date().getFullYear()} NexTrade Global Incorporation. All
            rights reserved.
          </span>
        </div>
        <div className="text-slate-600">
          Built with ❤️ for investors by{" "}
          <span className="text-emerald-400">NexTrade Labs</span>.
        </div>
      </footer>
    </div>
  );
}
