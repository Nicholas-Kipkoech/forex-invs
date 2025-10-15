"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function ForexLandingPage() {
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const plans = [
    {
      name: "Starter",
      deposit: "$100",
      return: "10–12%",
      risk: "Low",
      fee: "20%",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Growth",
      deposit: "$500",
      return: "15–18%",
      risk: "Moderate",
      fee: "25%",
      color: "bg-yellow-100 text-yellow-700",
      recommended: true,
    },
    {
      name: "Premium",
      deposit: "$1,000+",
      return: "20%+",
      risk: "Balanced",
      fee: "30%",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  const tradingPairs = [
    { id: "EURUSD", title: "EUR/USD" },
    { id: "GBPUSD", title: "GBP/USD" },
  ];

  const testimonials = [
    {
      name: "David M.",
      comment:
        "I started with $300 and in three months, I’ve seen steady returns. The transparency and live tracking make me trust the process fully.",
      location: "London",
    },
    {
      name: "Sarah K.",
      comment:
        "The Growth Plan has been amazing — withdrawals are smooth and support is always available. Highly recommend this team!",
      location: "South Africa",
    },
    {
      name: "James O.",
      comment:
        "Professional traders with consistent profits. I love the mix of manual and automated trading that keeps risk balanced.",
      location: "UAE",
    },
  ];

  const steps = [
    {
      title: "1. Create Account",
      desc: "Sign up or create a trading account with a recommended broker (we’ll guide you).",
    },
    {
      title: "2. Fund Your Account",
      desc: "Deposit funds directly to your trading account or send via BTC.",
    },
    {
      title: "3. Connect to Our System",
      desc: "We link your account to our secure trading setup — manual & automated.",
    },
    {
      title: "4. Watch and Withdraw",
      desc: "Track your profits live anytime and withdraw your money anytime.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-24 px-4 bg-gradient-to-b from-emerald-100 to-white dark:from-emerald-950 dark:to-background">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-emerald-700"
        >
          Grow Your Capital with Expert Forex Account Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Earn 10–20% monthly returns through our blend of manual and automated
          forex trading strategies. Secure, transparent, and performance-driven.
        </motion.p>
        <Button
          size="lg"
          onClick={scrollToContact}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Get Started
        </Button>
      </section>

      {/* Charts Section */}
      <section id="charts" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6 text-emerald-700">
            Live Market Overview
          </h2>
          <p className="text-muted-foreground mb-8">
            Keep track of the forex market with real-time charts powered by
            TradingView.
          </p>

          <Tabs defaultValue="EURUSD" className="w-full">
            <TabsList className="flex justify-center gap-2 bg-emerald-100 dark:bg-emerald-950">
              {tradingPairs.map((pair) => (
                <TabsTrigger
                  key={pair.id}
                  value={pair.id}
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md"
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
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <iframe
                    src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${pair.id}&symbol=FX:${pair.id}&interval=30&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=light&style=1&timezone=Africa%2FNairobi`}
                    width="100%"
                    height="400"
                    className="rounded-xl border shadow-sm"
                    allowFullScreen
                  />
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How to Invest */}
      <section
        id="how-to-invest"
        className="py-16 px-6 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-emerald-700">
          How to Invest
        </h2>
        <p className="text-muted-foreground mb-12">
          Start earning consistent forex profits in just a few simple steps.
        </p>
        <div className="grid md:grid-cols-4 gap-8 text-left">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition"
            >
              <div className="text-emerald-600 text-2xl font-bold mb-3">
                {item.title}
              </div>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6 text-emerald-700">
            Investment Plans
          </h2>
          <p className="text-muted-foreground mb-12">
            Choose a plan that fits your goals — all accounts are managed
            securely with consistent monthly returns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.03 }}
                className={`p-6 rounded-2xl border bg-background shadow-md relative ${
                  plan.recommended ? "border-emerald-500" : ""
                }`}
              >
                {plan.recommended && (
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-3">{plan.name}</h3>
                <div className="mb-4 text-sm">
                  <p>
                    💵 Minimum Deposit:{" "}
                    <span className="font-medium">{plan.deposit}</span>
                  </p>
                  <p>
                    📈 Monthly Return:{" "}
                    <span className="font-medium">{plan.return}</span>
                  </p>
                  <p>
                    ⚖️ Risk Level:{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${plan.color}`}
                    >
                      {plan.risk}
                    </span>
                  </p>
                  <p>
                    💼 Management Fee:{" "}
                    <span className="font-medium">{plan.fee} of profit</span>
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                  onClick={scrollToContact}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-16 px-6 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-emerald-700">
          What Our Investors Say
        </h2>
        <p className="text-muted-foreground mb-12">
          Real stories from clients who trust us with their investments.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition"
            >
              <p className="italic mb-4 text-muted-foreground">“{t.comment}”</p>
              <div className="font-semibold text-emerald-700">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.location}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        id="contact"
        className="py-16 px-6 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-emerald-700">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-8">
          Ready to start investing or have a question? Reach out and we’ll guide
          you through.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
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
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <a href="mailto:info@forexmanagedinvestments.com">Send Email</a>
          </Button>
        </div>

        <p className="mt-6 text-muted-foreground">
          Or email us directly at{" "}
          <a
            href="mailto:info@forexmanagedinvestments.com"
            className="text-emerald-600 font-medium hover:underline"
          >
            info@forexmanagedinvestments.com
          </a>
        </p>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Forex Managed Investments. All rights
        reserved.
      </footer>
    </main>
  );
}
