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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 lg:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold leading-tight"
        >
          Trade Smarter.
          <br />
          Powered by MT5 & OKX Platform.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mt-6 text-gray-400 text-lg"
        >
          Institutional-grade analytics, AI-driven insights, and secure crypto
          deposits. Trade USDT, BTC, and other top cryptocurrencies on a fully
          integrated MT5 trading platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex flex-col md:flex-row gap-2"
        >
          <Link href="/register">
            <Button className="bg-white text-black text-md px-6 py-3 rounded-xl shadow-md">
              Get Started
            </Button>
          </Link>
        </motion.div>

        <div className="mt-6 flex items-center gap-4 text-gray-500 text-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>Bank-grade encryption</span>
          <span className="inline-block mx-2">•</span>
          <CheckCircle className="h-4 w-4" />
          <span>Audited trading platform</span>
          <span className="inline-block mx-2">•</span>
          <CreditCard className="h-4 w-4" />
          <span>Fast crypto deposits</span>
        </div>
      </section>

      {/* MT5 & Benefits Section */}
      <section className="py-24 bg-gray-900 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Trade with MT5</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
            Leverage the world's most powerful trading platform. Execute trades
            faster, access advanced analytics, and manage your crypto portfolio
            securely.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="h-10 w-10" />,
                title: "Seamless MT5 Integration",
                text: "Connect your MT5 account and trade directly with live market data.",
              },
              {
                icon: <Zap className="h-10 w-10" />,
                title: "Low Fees",
                text: "Transparent trading fees with no hidden charges.",
              },
              {
                icon: <CreditCard className="h-10 w-10" />,
                title: "Fast Deposits",
                text: "Deposit USDT and BTC instantly to start trading immediately.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-5 bg-gray-800 border border-gray-700 rounded-xl"
              >
                {f.icon}
                <h3 className="text-lg font-semibold mt-2 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {[
            {
              icon: <LineChart className="h-10 w-10 text-white" />,
              title: "Live Price Feeds",
              text: "Track real-time prices for crypto assets with minimal latency.",
            },
            {
              icon: <TrendingUp className="h-10 w-10 text-white" />,
              title: "AI-Driven Insights",
              text: "Predictive analytics to help guide your trades.",
            },
            {
              icon: <Lock className="h-10 w-10 text-white" />,
              title: "Secure Crypto Deposits",
              text: "Bank-grade encryption ensures your funds are safe.",
            },
            {
              icon: <ShieldCheck className="h-10 w-10 text-white" />,
              title: "Regulatory Compliance",
              text: "Operate within international standards with transparency.",
            },
            {
              icon: <Users className="h-10 w-10 text-white" />,
              title: "Community Support",
              text: "Join a network of traders sharing strategies and insights.",
            },
            {
              icon: <Zap className="h-10 w-10 text-white" />,
              title: "Lightning Execution",
              text: "Execute trades instantly on a low-latency platform.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TradingView Chart */}
      <section className="relative flex flex-col items-center py-12 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
          Live Market Overview
        </h2>
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_8b80d&symbol=NASDAQ:AAPL&interval=15&hide_top_toolbar=1&hide_legend=1&theme=dark"
            style={{ height: "420px", width: "100%" }}
            title="TradingView Live Chart"
          />
        </div>
        <p className="text-gray-400 mt-6 max-w-xl text-center">
          Real-time charts powered by TradingView.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          <span>
            © {new Date().getFullYear()} OKX-Powered-Partner Platform. All
            rights reserved.
          </span>
        </div>
        <div className="text-gray-500">Built for traders.</div>
      </footer>
    </div>
  );
}
