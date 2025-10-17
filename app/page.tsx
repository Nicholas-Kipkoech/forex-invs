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
      desc: "Our expert trading team manages your funds with a focus on stable, consistent growth.",
      icon: "📈",
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
            Empower Your Investments with Confidence
          </motion.h1>
          <motion.p
            className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Partner with our expert trading team and grow your portfolio through
            strategic investments and transparent performance.
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
            Why Choose Us
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Our investment platform is built on trust, security, and
            performance. Every decision is data-driven, ensuring your capital is
            managed responsibly while maximizing potential returns.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Transparent Reporting",
                desc: "View your trades, profits, and withdrawals in real-time from your dashboard.",
              },
              {
                title: "Secure Asset Management",
                desc: "All funds are protected through multi-layered security and compliance standards.",
              },
              {
                title: "Expert Trading Team",
                desc: "Our traders employ advanced algorithms and fundamental analysis to optimize results.",
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

      {/* How to Get Started Section */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            How to Get Started
          </h2>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
            Getting started is simple. Follow three easy steps to begin your
            investment journey and start earning passive income.
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

      {/* Regulations & Compliance Section */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-emerald-700 mb-6">
            Regulations & Compliance
          </h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            We adhere to international financial compliance standards to
            maintain transparency, client protection, and ethical trading
            practices. Our operations follow{" "}
            <span className="font-medium text-emerald-700">
              Anti-Money Laundering (AML)
            </span>{" "}
            and{" "}
            <span className="font-medium text-emerald-700">
              Know Your Customer (KYC)
            </span>{" "}
            guidelines to ensure integrity in every transaction.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
            <div className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                Data & Fund Security
              </h3>
              <p className="text-gray-600 text-sm">
                All investor data and funds are protected through encryption,
                secure wallets, and compliance with leading cybersecurity
                protocols.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                Transparent Operations
              </h3>
              <p className="text-gray-600 text-sm">
                Our trading performance is available for audit, and clients
                receive transparent reporting on every transaction.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                Compliance & Ethics
              </h3>
              <p className="text-gray-600 text-sm">
                We operate under fair market standards, ensuring all activity
                complies with legal and ethical guidelines.
              </p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-10 max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> Trading and investing carry inherent
            risks. Past performance is not indicative of future results. Always
            invest what you can afford to lose and seek independent financial
            advice when necessary.
          </p>
        </div>
      </section>

      {/* Legal & Risk Disclosure */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
            Legal & Risk Disclosure
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            This platform is intended for individuals who understand and accept
            the risks involved in financial trading. We do not offer financial
            advice, and all investment decisions are made at your own
            discretion. Regulatory requirements may vary by jurisdiction.
          </p>
          <p className="text-gray-500 text-sm max-w-3xl mx-auto">
            By accessing or using this platform, you acknowledge that you have
            read and understood our terms, risk warnings, and policies.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t bg-gray-50">
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
