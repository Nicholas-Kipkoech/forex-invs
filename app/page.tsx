"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const steps = [
    {
      title: "1. Create Your Account",
      desc: "Sign up securely using your email and verify your identity through our KYC process.",
      icon: "🧾",
    },
    {
      title: "2. Fund Your Investment",
      desc: "Deposit funds easily using BTC, USDT, or bank transfer. Your capital remains under your full control.",
      icon: "💰",
    },
    {
      title: "3. Start Earning",
      desc: "Our AI-powered trading bots manage your funds with precision and consistency, generating steady returns.",
      icon: "🤖",
    },
  ];

  const plans = [
    {
      name: "Starter Plan",
      price: "$100 - $999",
      features: [
        "Automated AI Trading",
        "Weekly Performance Reports",
        "Instant Withdrawals",
        "24/7 Dashboard Access",
      ],
    },
    {
      name: "Pro Plan",
      price: "$1,000 - $4,999",
      features: [
        "Advanced AI Bots + Market Analysis",
        "Higher Profit Margin",
        "Dedicated Account Manager",
        "Priority Withdrawals",
      ],
    },
    {
      name: "Elite Plan",
      price: "$5,000+",
      features: [
        "Smart Portfolio Diversification",
        "Top-tier AI Algorithms",
        "Personalized Growth Strategy",
        "Exclusive VIP Support",
      ],
    },
  ];

  const benefits = [
    {
      title: "AI-Driven Precision",
      desc: "Our trading bots analyze thousands of market signals in real time for optimal performance.",
      icon: "⚙️",
    },
    {
      title: "24/7 Profit Generation",
      desc: "AI bots never sleep — your investments keep working around the clock.",
      icon: "🌙",
    },
    {
      title: "Risk Management",
      desc: "Each trade is executed with intelligent risk control mechanisms to protect your capital.",
      icon: "🛡️",
    },
    {
      title: "Instant Withdrawals",
      desc: "Easily withdraw your profits anytime directly through BTC or USDT.",
      icon: "💳",
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-emerald-700 text-white py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Empower Your Investments with AI & Automation
          </motion.h1>
          <motion.p
            className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Let our AI-driven trading bots grow your portfolio through
            intelligent automation, real-time analytics, and transparent
            performance tracking.
          </motion.p>

          <div className="flex justify-center gap-4 mt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-medium px-8 rounded-full"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-emerald-700 hover:bg-emerald-600 font-medium px-8 rounded-full"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            Why Choose Our AI Trading Platform
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Our investment system combines artificial intelligence with
            automation to maximize returns and minimize emotional decision
            errors. Your capital is managed with data-driven accuracy and full
            transparency.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Automated Performance",
                desc: "AI bots monitor the market 24/7 to capture profitable opportunities instantly.",
              },
              {
                title: "Secure Asset Management",
                desc: "All funds are held safely with advanced encryption and multi-layered security systems.",
              },
              {
                title: "Real-Time Transparency",
                desc: "Access your dashboard anytime to view profits, trades, and growth analytics.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            Choose Your Investment Plan
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Select a plan that aligns with your goals. All plans include AI
            trading, transparent reporting, and secure withdrawals.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-8 bg-gray-50 rounded-2xl shadow-sm border hover:shadow-md transition text-left"
              >
                <h3 className="text-xl font-semibold text-emerald-700 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-800 font-medium mb-4">{plan.price}</p>
                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i}>✅ {f}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                    Invest Now
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            Benefits of Investing With Us
          </h2>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
            Experience hands-free investing powered by artificial intelligence
            and automation. Your money works for you — intelligently.
          </p>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            How to Get Started
          </h2>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
            It’s simple to start your AI-powered trading journey.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-gray-50 rounded-2xl shadow-sm border hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full">
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t bg-white">
        <p>
          © {new Date().getFullYear()} FX PRO INVESTMENTS. All rights reserved.
        </p>
        <p className="mt-2">
          <a
            href="/legal"
            className="text-emerald-700 hover:underline transition"
          >
            View Full Legal Disclosure
          </a>
        </p>
      </footer>
    </main>
  );
}
