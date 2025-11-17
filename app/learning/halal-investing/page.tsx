"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpenCheck, Globe, ShieldCheck, CreditCard } from "lucide-react";

export default function HalalInvesting() {
  const topics = [
    {
      title: "Shariah Principles",
      icon: ShieldCheck,
      content: [
        "Avoid interest (riba), excessive uncertainty (gharar), and prohibited industries (haram).",
        "Focus on real assets and businesses providing tangible value.",
      ],
    },
    {
      title: "Halal ETFs & Funds",
      icon: Globe,
      content: [
        "Many global ETFs screen for Shariah compliance.",
        "Examples: S&P 500 Shariah ETF, Wahed Invest portfolios.",
      ],
    },
    {
      title: "Ethical Investing Options",
      icon: BookOpenCheck,
      content: [
        "ESG funds (Environmental, Social, Governance).",
        "Green energy and socially responsible companies.",
        "Avoid industries that violate personal or religious ethics.",
      ],
    },
    {
      title: "Risk & Return",
      icon: CreditCard,
      content: [
        "Halal portfolios may be slightly more limited.",
        "Diversification and long-term planning remain key.",
        "Use the same trading & risk management principles.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 md:px-12 py-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
          Halal & Ethical Investing
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Learn how to invest in Shariah-compliant portfolios and ethical
          strategies without compromising your values.
        </p>
      </motion.div>

      {/* Topics */}
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 shadow-lg flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-emerald-300">
                  {topic.title}
                </h2>
              </div>
              <ul className="text-slate-300 text-sm space-y-2 list-inside list-disc">
                {topic.content.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Registration CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold text-emerald-300 mb-4">
          Ready to Start Your Investment Journey?
        </h2>
        <p className="text-slate-300 mb-6">
          Sign up on our platform to access personalized guides, portfolios, and
          tools.
        </p>
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
          >
            Register Now
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
