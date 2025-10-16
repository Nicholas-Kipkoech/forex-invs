"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function ForexLandingPage() {
  const contactRef = useRef<HTMLDivElement>(null);
  const scrollToContact = () =>
    contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const plans = [
    {
      name: "Starter",
      deposit: "$100",
      return: "10–12%",
      risk: "Low",
      fee: "20%",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      name: "Growth",
      deposit: "$500",
      return: "15–18%",
      risk: "Moderate",
      fee: "25%",
      color: "bg-yellow-50 text-yellow-600",
      recommended: true,
    },
    {
      name: "Premium",
      deposit: "$1,000+",
      return: "20%+",
      risk: "Balanced",
      fee: "30%",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  const testimonials = [
    {
      name: "David M.",
      comment:
        "Started with $300 and saw consistent growth. The transparency and easy withdrawals make this my top investment choice.",
      location: "London",
    },
    {
      name: "Sarah K.",
      comment:
        "The Growth Plan has exceeded my expectations — returns are steady and the support team is reliable.",
      location: "South Africa",
    },
    {
      name: "James O.",
      comment:
        "Smart risk management and consistent profits. I love the hybrid of automated and manual strategies.",
      location: "UAE",
    },
  ];

  const steps = [
    {
      title: "Create Account",
      desc: "Sign up and verify your email to get started.",
    },
    {
      title: "Fund Your Account",
      desc: "Deposit funds securely or send via BTC or USDT.",
    },
    {
      title: "Connect to Our System",
      desc: "We trade on your behalf with expert strategies.",
    },
    {
      title: "Track & Withdraw",
      desc: "Monitor your returns and withdraw anytime.",
    },
  ];

  const tradingPairs = [
    { id: "EURUSD", title: "EUR/USD" },
    { id: "GBPUSD", title: "GBP/USD" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="text-center py-28 px-6 bg-gradient-to-b from-emerald-50 to-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-emerald-700 mb-4"
        >
          Invest Smart. Earn Consistently.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Experience stable monthly returns of{" "}
          <span className="text-emerald-600 font-medium">10–20%</span> through
          our managed forex trading services.
        </motion.p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Market Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-4">
            Live Forex Market
          </h2>
          <p className="text-gray-600 mb-10">
            View real-time forex charts to stay ahead of the market.
          </p>

          <Tabs defaultValue="EURUSD" className="w-full">
            <TabsList className="flex justify-center gap-2 bg-emerald-100 p-2 rounded-full">
              {tradingPairs.map((pair) => (
                <TabsTrigger
                  key={pair.id}
                  value={pair.id}
                  className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition"
                >
                  {pair.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {tradingPairs.map((pair) => (
              <TabsContent key={pair.id} value={pair.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <iframe
                    src={`https://s.tradingview.com/widgetembed/?symbol=FX:${pair.id}&interval=30&theme=light&style=1`}
                    width="100%"
                    height="400"
                    className="rounded-2xl border shadow-sm"
                    allowFullScreen
                  />
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How to Invest */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-emerald-700 mb-10">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-emerald-600 text-xl font-semibold mb-3">
                {step.title}
              </div>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            Investment Plans
          </h2>
          <p className="text-gray-600 mb-10">
            Select a plan that matches your investment goals.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.03 }}
                className={`p-8 rounded-2xl border bg-white shadow-sm relative ${
                  plan.recommended
                    ? "border-emerald-500 ring-1 ring-emerald-100"
                    : ""
                }`}
              >
                {plan.recommended && (
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}
                <h3 className="text-2xl font-semibold mb-4 text-emerald-700">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-2">💵 Deposit: {plan.deposit}</p>
                <p className="text-gray-600 mb-2">📈 Return: {plan.return}</p>
                <p className="text-gray-600 mb-2">💼 Fee: {plan.fee}</p>
                <p
                  className={`text-sm font-medium inline-block mt-2 px-3 py-1 rounded-full ${plan.color}`}
                >
                  {plan.risk} Risk
                </p>
                <Button
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                  onClick={scrollToContact}
                >
                  Invest Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-emerald-700 mb-10">
          What Investors Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md"
            >
              <p className="italic text-gray-600 mb-4">“{t.comment}”</p>
              <div className="font-semibold text-emerald-700">{t.name}</div>
              <div className="text-sm text-gray-500">{t.location}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        ref={contactRef}
        className="py-20 text-center max-w-4xl mx-auto px-6"
      >
        <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-8">
          Reach out to us for inquiries, partnerships, or guidance.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            Telegram
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <a href="mailto:info@forexmanagedinvestments.com">Send Email</a>
          </Button>
        </div>
        <p className="mt-8 text-gray-500">
          Or email us at{" "}
          <a
            href="mailto:info@forexmanagedinvestments.com"
            className="text-emerald-600 font-medium"
          >
            info@forexmanagedinvestments.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Forex Managed Investments. All rights
        reserved.
      </footer>
    </main>
  );
}
