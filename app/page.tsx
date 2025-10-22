"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const steps = [
    {
      title: "1. Create Your Account",
      desc: "Sign up securely using your email and complete a quick verification process to unlock your dashboard.",
      icon: "📈",
    },
    {
      title: "2. Fund Your Portfolio",
      desc: "Easily deposit funds via crypto transfer (Bitcon). Start investing in AI-managed stock portfolios instantly.",
      icon: "💳",
    },
    {
      title: "3. Watch Your Investments Grow",
      desc: "Our AI automatically diversifies, rebalances, and optimizes your stock portfolio for consistent growth.",
      icon: "🤖",
    },
  ];

  const plans = [
    {
      name: "Starter Portfolio",
      price: "$100 - $999",
      features: [
        "Automated Stock Portfolio Management",
        "Weekly Performance Insights",
        "No Hidden Fees",
        "Full Dashboard Access",
      ],
    },
    {
      name: "Growth Portfolio",
      price: "$1,000 - $4,999",
      features: [
        "AI Optimization + Human Oversight",
        "Dynamic Market Adjustments",
        "Tax-Efficient Strategies",
        "Priority Support",
      ],
    },
    {
      name: "Elite Portfolio",
      price: "$5,000+",
      features: [
        "Custom Stock Basket Creation",
        "Smart Diversification Across Sectors",
        "Dedicated Financial Analyst",
        "Exclusive Investment Insights",
      ],
    },
  ];

  const benefits = [
    {
      title: "AI-Powered Insights",
      desc: "Our algorithms analyze thousands of market signals and trends to make smart investment decisions.",
      icon: "🧠",
    },
    {
      title: "Passive Growth",
      desc: "Your portfolio is automatically adjusted to capture growth opportunities while minimizing risks.",
      icon: "📊",
    },
    {
      title: "Built-In Risk Control",
      desc: "AI monitors volatility and rebalances portfolios to protect your investments.",
      icon: "🛡️",
    },
    {
      title: "Transparent Reporting",
      desc: "Track performance and returns in real time through your dashboard — anytime, anywhere.",
      icon: "📱",
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
            Smarter Stock Investing with AI
          </motion.h1>
          <motion.p
            className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Harness the power of artificial intelligence to build and manage
            your stock portfolio — automatically, intelligently, and securely.
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
            Why Choose Our AI Stock Platform
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            We combine AI technology with market expertise to help you invest in
            high-performing stocks automatically. No guesswork, no stress — just
            smart, data-driven investing.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Smart Portfolio Management",
                desc: "AI constantly tracks market trends and rebalances your portfolio for optimal returns.",
              },
              {
                title: "Safe & Secure Investments",
                desc: "Your funds and data are protected by bank-grade security and regulatory compliance.",
              },
              {
                title: "Real-Time Transparency",
                desc: "Get instant insights on your portfolio’s performance, gains, and diversification.",
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
            Whether you’re a beginner or an experienced investor, our AI-powered
            portfolios adapt to your goals and risk appetite.
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
            Benefits of AI Stock Investing
          </h2>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
            Experience the future of investing — data-driven, emotion-free, and
            effortlessly profitable.
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
            Begin your AI investing journey in just a few simple steps.
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
                Start Investing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t bg-white">
        <p>
          © {new Date().getFullYear()} StockAI Investments. All rights reserved.
        </p>
        <p className="mt-2">
          <a
            href="/legal"
            className="text-emerald-700 hover:underline transition"
          >
            View Legal Disclosure
          </a>
        </p>
      </footer>
    </main>
  );
}
