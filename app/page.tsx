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
  Copy,
  DollarSign,
  Clock,
  BarChart3,
  Target,
  Star,
  Award,
  PlayCircle,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const HERO_FEATURES = [
  "Bank-grade encryption",
  "Regulated forex broker",
  "Instant deposits & withdrawals",
];

const CORE_FEATURES = [
  {
    icon: <Copy className="h-10 w-10 text-white" />,
    title: "Copy Trading",
    text: "Automatically copy trades from top-performing traders. Set your risk level and let experts trade for you.",
  },
  {
    icon: <DollarSign className="h-10 w-10 text-white" />,
    title: "Ultra-Low Spreads",
    text: "Tight spreads starting from 0.0 pips. No commission on major pairs. Transparent pricing with zero hidden fees.",
  },
  {
    icon: <Clock className="h-10 w-10 text-white" />,
    title: "Fast Payouts",
    text: "Withdraw your profits in minutes, not days. Same-day processing for all withdrawal methods.",
  },
];

const PLATFORM_FEATURES = [
  {
    icon: <BarChart3 className="h-10 w-10 text-white" />,
    title: "MT5 Trading Platform",
    text: "Professional MetaTrader 5 with advanced charting, indicators, and automated trading.",
  },
  {
    icon: <LineChart className="h-10 w-10 text-white" />,
    title: "Live Forex Prices",
    text: "Real-time quotes for 50+ currency pairs with ultra-low latency execution.",
  },
  {
    icon: <Users className="h-10 w-10 text-white" />,
    title: "Copy Trading Network",
    text: "Connect with thousands of successful traders. Browse performance stats and copy the best.",
  },
  {
    icon: <Target className="h-10 w-10 text-white" />,
    title: "Risk Management Tools",
    text: "Built-in stop loss, take profit, and position sizing tools to protect your capital.",
  },
  {
    icon: <Lock className="h-10 w-10 text-white" />,
    title: "Secure & Regulated",
    text: "Your funds are protected with segregated accounts and industry-leading security.",
  },
  {
    icon: <Zap className="h-10 w-10 text-white" />,
    title: "Lightning Execution",
    text: "Execute trades in milliseconds with our advanced trading infrastructure.",
  },
];

const STATS = [
  { value: "50,000+", label: "Active Traders" },
  { value: "$2.5B+", label: "Traded Volume" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Support" },
];

const TESTIMONIALS = [
  {
    name: "Michael Chen",
    role: "Professional Trader",
    avatar: "MC",
    rating: 5,
    text: "The copy trading feature changed everything for me. I'm making consistent profits by following top traders. The platform is intuitive and the execution is lightning fast.",
    profit: "+$12,450",
  },
  {
    name: "Sarah Johnson",
    role: "Beginner Investor",
    avatar: "SJ",
    rating: 5,
    text: "As someone new to forex trading, copy trading was a game-changer. I started with $500 and now have over $2,000 in just 3 months. The risk management tools are excellent.",
    profit: "+$1,500",
  },
  {
    name: "David Rodriguez",
    role: "Day Trader",
    avatar: "DR",
    rating: 5,
    text: "Ultra-low spreads and instant execution make this my go-to platform. The MT5 integration is seamless and the copy trading network has some incredible traders.",
    profit: "+$8,200",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create Account",
    description: "Sign up in minutes with just your email. No credit card required.",
    icon: <Users className="h-8 w-8" />,
  },
  {
    step: "2",
    title: "Deposit Funds",
    description: "Fund your account with BTC or USDT. Instant deposits, no waiting.",
    icon: <CreditCard className="h-8 w-8" />,
  },
  {
    step: "3",
    title: "Choose Traders",
    description: "Browse verified traders, check their stats, and select the best ones.",
    icon: <Copy className="h-8 w-8" />,
  },
  {
    step: "4",
    title: "Start Trading",
    description: "Copy trades automatically or trade manually. Withdraw profits anytime.",
    icon: <TrendingUp className="h-8 w-8" />,
  },
];

const FAQ_ITEMS = [
  {
    q: "Is copy trading safe?",
    a: "Yes, copy trading is safe when done responsibly. We provide risk management tools, verified traders, and you can set your own risk limits. Always invest only what you can afford to lose.",
  },
  {
    q: "What are the fees?",
    a: "We offer ultra-low spreads starting from 0.0 pips on major pairs with no commission. There are no hidden fees - what you see is what you pay.",
  },
  {
    q: "How fast are withdrawals?",
    a: "Crypto withdrawals are instant. Bank transfers are processed same-day and typically complete within 24 hours. Most withdrawals are processed within minutes.",
  },
  {
    q: "Do I need trading experience?",
    a: "No experience needed! Copy trading allows you to automatically follow successful traders. However, we also provide educational resources if you want to learn.",
  },
  {
    q: "Is my money safe?",
    a: "Yes, your funds are protected with segregated accounts, bank-level encryption, and we're a regulated platform. Your money is never used for our operations.",
  },
  {
    q: "Can I try before depositing?",
    a: "Yes! We offer a demo account where you can practice trading with virtual funds. No deposit required to try our platform.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">Afroxen</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-300 hover:text-white transition">
                Features
              </Link>
              <Link href="#copy-trading" className="text-gray-300 hover:text-white transition">
                Copy Trading
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition">
                Reviews
              </Link>
              <Link href="#faq" className="text-gray-300 hover:text-white transition">
                FAQ
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">
                Features
              </Link>
              <Link href="#copy-trading" className="block px-3 py-2 text-gray-300 hover:text-white">
                Copy Trading
              </Link>
              <Link href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-white">
                Reviews
              </Link>
              <Link href="#faq" className="block px-3 py-2 text-gray-300 hover:text-white">
                FAQ
              </Link>
              <div className="pt-2 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 pt-40">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold leading-tight text-white"
        >
          Professional Forex Trading
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Copy Trading Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mt-6 text-gray-300 text-lg"
        >
          Trade forex with ultra-low spreads, copy top traders automatically, and
          withdraw profits instantly. Professional MT5 platform with fast execution
          and transparent pricing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-lg shadow-emerald-500/25">
              Start Trading Free
            </Button>
          </Link>
          
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-4 text-gray-400 text-sm justify-center">
          {HERO_FEATURES.map((f, i) => (
            <span key={i} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> {f}
            </span>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 bg-gray-900 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Why Trade With Us?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Professional forex trading platform designed for both beginners and
            experienced traders.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {CORE_FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mt-4 text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{f.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Highlight */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Low Fees</h3>
                </div>
                <p className="text-gray-300">
                  Spreads from <span className="text-emerald-400 font-bold">0.0 pips</span> on major pairs.
                  No commission, no hidden fees. Transparent pricing you can trust.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Fast Payouts</h3>
                </div>
                <p className="text-gray-300">
                  Withdraw your profits in <span className="text-cyan-400 font-bold">minutes</span>.
                  Same-day processing for bank transfers, instant for crypto. Get paid fast.
                </p>
              </div>
            </div>
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

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get started in 4 simple steps. No experience needed.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 h-full">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-4 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <div className="text-emerald-400 mb-3">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COPY TRADING SECTION */}
      <section id="copy-trading" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Copy Trading Made Simple
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Follow successful traders and automatically copy their trades. No experience needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gray-800 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Choose Top Traders</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Browse our network of verified traders. View their performance stats,
                win rates, and risk levels. Choose traders that match your style.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Real-time performance tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Risk score and drawdown analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Verified trading history
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gray-800 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Copy className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Auto-Copy Trades</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Set your copy amount and risk level. Every trade from your chosen
                traders is automatically replicated in your account in real-time.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                  Automatic trade execution
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                  Customizable risk management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                  Stop copying anytime
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              What Our Traders Say
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful traders who trust our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 mb-4">{testimonial.text}</p>
                <div className="text-emerald-400 font-semibold text-sm">
                  Profit: {testimonial.profit}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-16 px-6 bg-gray-900 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-400 mb-6">
              Trusted & Regulated
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <span className="text-sm text-gray-300">Regulated Broker</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Lock className="h-6 w-6 text-cyan-400" />
                <span className="text-sm text-gray-300">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Award className="h-6 w-6 text-blue-400" />
                <span className="text-sm text-gray-300">Industry Leader</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
                <span className="text-sm text-gray-300">Segregated Accounts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE FOREX MARKET */}
      <section className="flex flex-col items-center py-24 px-6">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Live Forex Markets
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          Real-time quotes for major currency pairs
        </p>
        <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-gray-700 shadow-lg">
          <iframe
            src="https://s.tradingview.com/widgetembed/?symbol=FX:EURUSD&interval=15&theme=dark"
            style={{ height: "450px", width: "100%" }}
            title="Forex Market"
          />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-300 border-t border-white/10 pt-4">
                    {item.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Start Trading?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of traders making profits with our professional platform.
              Start with as little as $100.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-lg shadow-emerald-500/25">
                  Create Free Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/demo">
                <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-6 rounded-2xl text-lg">
                  Try Demo Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-slate-900" />
                </div>
                <span className="text-xl font-bold text-white">Afroxen</span>
              </div>
              <p className="text-sm text-gray-400">
                Professional forex trading platform with copy trading, ultra-low spreads, and fast payouts.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/copy-trading" className="hover:text-white transition">
                    Copy Trading
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/tools" className="hover:text-white transition">
                    Trading Tools
                  </Link>
                </li>
                <li>
                  <Link href="/learning" className="hover:text-white transition">
                    Learning Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/dashboard/support" className="hover:text-white transition">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-white transition">
                    Legal
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/support#faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/register" className="hover:text-white transition">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/deposit" className="hover:text-white transition">
                    Deposit Funds
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/demo" className="hover:text-white transition">
                    Demo Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Afroxen. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Available Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Regulated & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
