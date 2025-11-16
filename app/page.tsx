"use client";

import { useState } from "react";
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
  CreditCard,
  Tag,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$100",
    minDeposit: 100,
    roi: "10–12% / month",
    risk: "Low",
    features: [
      "Conservative strategies",
      "Monthly performance report",
      "Email support (48h response)",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$500",
    minDeposit: 500,
    roi: "15–18% / month",
    risk: "Balanced",
    features: [
      "Momentum + mean-reversion strategies",
      "Weekly performance report",
      "Priority support",
      "Portfolio insights",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$1,000+",
    minDeposit: 1000,
    roi: "20%+ / month",
    risk: "High",
    features: [
      "Institutional strategies",
      "Daily performance report",
      "Dedicated account manager",
      "AI-powered insights",
      "VIP support & onboarding",
    ],
  },
];

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 lg:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent leading-tight"
        >
          Trade Smarter.
          <br />
          Grow Faster. Dominate the Markets.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mt-6 text-slate-300 text-lg"
        >
          Access institutional-grade analytics, AI-driven signals, and secure
          blockchain-backed investing — all in one place. Start with as little
          as <span className="text-emerald-300 font-semibold">$100</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex gap-4"
        >
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-6 py-3 rounded-xl shadow-lg shadow-emerald-700/30">
              Get Started — From $100
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

        {/* Small trust strip */}
        <div className="mt-6 flex items-center gap-4 text-slate-400 text-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Bank-grade encryption</span>
          <span className="inline-block mx-2">•</span>
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Audited strategies</span>
          <span className="inline-block mx-2">•</span>
          <CreditCard className="h-4 w-4 text-emerald-400" />
          <span>Crypto deposits</span>
        </div>

        {/* Floating glow */}
        <div className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-emerald-600/8 blur-3xl"></div>
      </section>

      {/* ================= HALAL INVESTMENTS SECTION (ADDED) ================= */}
      <section className="py-16 px-6 bg-slate-900/40">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">
            Ethical & Shariah-Compliant Investing Options
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose investment portfolios that align with your values. We support
            globally recognized Shariah-compliant portfolios, as well as general
            ethical investing strategies free from high-risk or controversial
            sectors.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Ethical & Halal ETFs",
                text: "Access reviewed ETFs screened for Shariah compliance and ethical standards.",
              },
              {
                title: "Transparent Risk Models",
                text: "All portfolios are structured with clear risk-return guidelines.",
              },
              {
                title: "Flexible Options",
                text: "Choose general, balanced, or Shariah-compliant strategies to suit your goals.",
              },
            ].map((h, i) => (
              <div
                key={i}
                className="p-5 bg-slate-950 border border-emerald-500/20 rounded-xl"
              >
                <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-emerald-300 mb-2">
                  {h.title}
                </h3>
                <p className="text-slate-300 text-sm">{h.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-400">
            *Available in selected portfolios. Ethical and Shariah-compliant
            options are verified independently.
          </p>
        </div>
      </section>

      {/* ================= END HALAL SECTION ================= */}

      {/* Plans Section (Placement: After Hero) */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-emerald-300">
                Investment Plans
              </h2>
              <p className="text-slate-400 mt-2 max-w-xl">
                Start from{" "}
                <span className="text-emerald-300 font-semibold">$100</span>.
                Pick a plan based on your goals — we provide transparent monthly
                ROI ranges and risk classifications so you can choose with
                confidence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-emerald-300" />
              <div className="text-sm text-slate-400">
                Min. deposit{" "}
                <span className="text-emerald-300 font-semibold">$100</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex flex-col rounded-2xl p-6 border transition-shadow duration-200 ${
                    plan.recommended
                      ? "bg-emerald-700/10 border-emerald-500/40 shadow-2xl"
                      : "bg-slate-900 border-emerald-500/10"
                  } ${isSelected ? "ring-2 ring-emerald-400/40" : ""}`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 right-3 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow">
                      Recommended
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <div className="text-slate-400 text-sm mt-1">
                        Min:{" "}
                        <span className="text-emerald-300 font-medium">
                          ${plan.minDeposit}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-extrabold">
                        {plan.price}
                      </div>
                      <div className="text-sm text-slate-300 mt-1">
                        {plan.roi}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        plan.risk === "Low"
                          ? "bg-emerald-800 text-emerald-200"
                          : plan.risk === "Balanced"
                          ? "bg-amber-700 text-amber-100"
                          : "bg-red-700 text-red-100"
                      }`}
                    >
                      {plan.risk} risk
                    </div>
                    <div className="text-slate-400 text-xs">
                      Transparent fees • No hidden lockups
                    </div>
                  </div>

                  <ul className="flex-1 mb-6 space-y-2 text-sm text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-1" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Plan Panel */}
          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-8 p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-emerald-300">
                    Ready to fund your plan?
                  </h4>
                  <p className="text-slate-300 mt-1">
                    You've selected the{" "}
                    <span className="font-semibold text-emerald-200">
                      {plans.find((p) => p.id === selectedPlan)?.name}
                    </span>{" "}
                    plan — minimum deposit{" "}
                    <span className="text-emerald-200 font-semibold">
                      ${plans.find((p) => p.id === selectedPlan)?.minDeposit}
                    </span>
                    . Choose a funding method below to activate your strategy.
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                    <Lock className="h-4 w-4" />
                    <span>Secure deposits •</span>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Audited strategies •</span>
                    <Users className="h-4 w-4" />
                    <span>24/7 support</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/deposit?plan=${selectedPlan}`}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl">
                      Deposit Now
                    </Button>
                  </Link>

                  <Link href={`/onboarding?plan=${selectedPlan}`}>
                    <Button variant="outline" className="px-5">
                      Get Onboarded
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Market Overview */}
      <section className="relative flex flex-col items-center py-12 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-emerald-400">
          Live Market Overview
        </h2>
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_8b80d&symbol=NASDAQ:AAPL&interval=15&hide_top_toolbar=1&hide_legend=1&theme=dark"
            style={{ height: "420px", width: "100%" }}
            title="TradingView Live Chart"
          />
        </div>
        <p className="text-slate-400 mt-6 max-w-xl text-center">
          Real-time charts powered by TradingView. Stay ahead of market shifts
          with live sentiment and liquidity data.
        </p>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {[
            {
              icon: <LineChart className="h-10 w-10 text-emerald-400" />,
              title: "Live Price Feeds",
              text: "Track real-time prices for stocks, ETFs, and crypto assets across global markets with minimal latency.",
            },
            {
              icon: <TrendingUp className="h-10 w-10 text-emerald-400" />,
              title: "AI-Driven Insights",
              text: "Predictive analytics and sentiment modeling surface high-probability trades.",
            },
            {
              icon: <Lock className="h-10 w-10 text-emerald-400" />,
              title: "Secure Crypto Deposits",
              text: "Fund via Bitcoin and USDT with bank-grade encryption and cold storage protection.",
            },
            {
              icon: <ShieldCheck className="h-10 w-10 text-emerald-400" />,
              title: "Regulatory Compliance",
              text: "Licensed under international standards with audited smart contracts ensuring transparency.",
            },
            {
              icon: <Users className="h-10 w-10 text-emerald-400" />,
              title: "Community-Driven",
              text: "Join thousands of investors sharing strategies, signals, and insights worldwide.",
            },
            {
              icon: <Zap className="h-10 w-10 text-emerald-400" />,
              title: "Lightning Execution",
              text: "Ultra-fast trade execution powered by low-latency infrastructure and smart routing.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
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
      <section className="py-16 px-6 text-center bg-slate-950/70">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-emerald-400"
        >
          Trusted by Traders Worldwide
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah L.",
              text: "NexTrade changed how I invest. The AI insights are remarkably accurate and the interface is top-notch.",
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
              whileHover={{ scale: 1.02 }}
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
      <section className="py-12 px-6 text-center">
        <Globe className="h-8 w-8 mx-auto text-emerald-400 mb-4" />
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">
          Global Market Access
        </h2>
        <p className="max-w-2xl mx-auto text-slate-300 mb-6">
          Trade in over{" "}
          <span className="text-emerald-300 font-semibold">80+</span> markets
          worldwide — from Wall Street to crypto exchanges — all from one
          unified dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-slate-400 text-sm">
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
              className="border border-emerald-400/20 rounded-full px-3 py-1"
            >
              {city}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent"
        >
          Ready to Trade the Future?
        </motion.h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6">
          Join thousands of investors leveraging next-gen analytics, secure
          crypto deposits, and instant global market access.
        </p>
        <Link href="/register">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-700/30">
            Get Started Now — From $100
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
