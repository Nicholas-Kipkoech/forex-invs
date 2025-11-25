"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  TrendingUp,
  Lock,
  ShieldCheck,
  Users,
  Zap,
  CreditCard,
  CheckCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HERO_FEATURES = [
  "Bank-grade encryption",
  "Audited trading platform",
  "Instant crypto deposits",
];

const MT5_FEATURES = [
  {
    icon: <CheckCircle className="h-10 w-10 text-white" />,
    title: "Seamless MT5 Integration",
    text: "Connect your MT5 account and trade directly with real-time market data.",
  },
  {
    icon: <Zap className="h-10 w-10 text-white" />,
    title: "Ultra-Low Fees",
    text: "Transparent pricing with zero hidden costs.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-white" />,
    title: "Instant Crypto Funding",
    text: "Fund your account with USDT & BTC in seconds.",
  },
];

const PLATFORM_FEATURES = [
  {
    icon: <LineChart className="h-10 w-10 text-white" />,
    title: "Live Market Feeds",
    text: "Ultra-fast real-time crypto pricing.",
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-white" />,
    title: "AI Trade Intelligence",
    text: "Predictive insights to sharpen your strategy.",
  },
  {
    icon: <Lock className="h-10 w-10 text-white" />,
    title: "Military-grade Security",
    text: "Your assets are protected 24/7.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-white" />,
    title: "Global Compliance",
    text: "Trade under globally recognised standards.",
  },
  {
    icon: <Users className="h-10 w-10 text-white" />,
    title: "Elite Trader Network",
    text: "Access premium trading communities.",
  },
  {
    icon: <Zap className="h-10 w-10 text-white" />,
    title: "Zero-Latency Execution",
    text: "Lightning-fast order execution.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold leading-tight text-white"
        >
          Trade the Future.
          <br />
          Powered by OKX & MT5
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mt-6 text-gray-300 text-lg"
        >
          Futuristic crypto trading ecosystem powered by OKX liquidity and MT5
          execution. Experience lightning speed, precision analytics, and
          next-gen security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10"
        >
          <Link href="/register">
            <Button className="bg-white text-black px-8 py-4 rounded-2xl hover:bg-gray-300 transition">
              Start Trading
            </Button>
          </Link>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-4 text-gray-400 text-sm">
          {HERO_FEATURES.map((f, i) => (
            <span key={i} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-white" /> {f}
            </span>
          ))}
        </div>
      </section>

      {/* MT5 SECTION */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            MT5 x OKX Infrastructure
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Enterprise-level trading powered by OKX liquidity and MT5 precision
            tools.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {MT5_FEATURES.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gray-800 border border-gray-700 shadow-lg hover:shadow-gray-500 transition"
              >
                {f.icon}
                <h3 className="text-lg font-semibold mt-4 text-white">
                  {f.title}
                </h3>
                <p className="text-gray-300 text-sm mt-2">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {PLATFORM_FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gray-800 border border-gray-700 hover:border-white transition"
            >
              {f.icon}
              <h3 className="text-xl font-semibold mt-4 text-white">
                {f.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE MARKET */}
      <section className="flex flex-col items-center py-24 px-6">
        <h2 className="text-3xl font-bold mb-8 text-white">
          Live Crypto Markets
        </h2>
        <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-gray-700 shadow-lg">
          <iframe
            src="https://s.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=15&theme=dark"
            style={{ height: "450px", width: "100%" }}
            title="Crypto Market"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-700 py-10 text-center text-gray-400 text-sm">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          <span>© {new Date().getFullYear()} OKX-Powered Trading Platform</span>
        </div>
        <p>Next-generation crypto trading experience</p>
      </footer>
    </div>
  );
}
