"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Book,
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I deposit funds?",
        a: "Go to the Deposit page, select your preferred cryptocurrency (BTC or USDT), and send funds to the provided wallet address. Your account will be credited automatically after blockchain confirmation.",
      },
      {
        q: "What is the minimum deposit?",
        a: "The minimum deposit is $100. There is no maximum limit for deposits.",
      },
      {
        q: "How do I start copy trading?",
        a: "Navigate to the Copy Trading page, browse verified traders, review their performance metrics, and click 'Copy' to start automatically copying their trades.",
      },
    ],
  },
  {
    category: "Trading",
    questions: [
      {
        q: "What markets can I trade?",
        a: "You can trade stocks, ETFs, bonds, mutual funds, commodities, indices, crypto, and Shariah-compliant instruments across major global exchanges.",
      },
      {
        q: "What are the trading fees?",
        a: "We offer ultra-low spreads starting from 0.0 pips on major pairs with no commission. Transparent pricing with zero hidden fees.",
      },
      {
        q: "How fast are withdrawals?",
        a: "Withdrawals are processed within minutes for crypto and same-day for bank transfers. Most withdrawals complete within 24 hours.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I enable two-factor authentication?",
        a: "Go to Settings > Security and toggle on Two-Factor Authentication. You'll need to set up an authenticator app.",
      },
      {
        q: "Is my account secure?",
        a: "Yes, we use bank-level encryption, segregated accounts, and industry-leading security measures to protect your funds.",
      },
      {
        q: "Can I change my email address?",
        a: "Yes, you can update your email in the Profile settings. You'll need to verify the new email address.",
      },
    ],
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });

  const filteredFAQs = FAQ_ITEMS.filter((category) => {
    if (selectedCategory && category.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    return category.questions.some(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketForm({ subject: "", message: "", priority: "medium" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Support Center</h1>
              <p className="text-gray-400">
                Find answers or contact our support team
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === null ? "bg-emerald-500" : "border-white/20"}
                >
                  All
                </Button>
                {FAQ_ITEMS.map((cat) => (
                  <Button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    variant={selectedCategory === cat.category ? "default" : "outline"}
                    size="sm"
                    className={selectedCategory === cat.category ? "bg-emerald-500" : "border-white/20"}
                  >
                    {cat.category}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* FAQ Items */}
            {filteredFAQs.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + catIndex * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-lg font-semibold text-white mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, index) => (
                    <div
                      key={index}
                      className="border border-white/10 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenQuestion(
                            openQuestion === `${category.category}-${index}`
                              ? null
                              : `${category.category}-${index}`
                          )
                        }
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <span className="text-sm font-medium text-white">
                          {item.q}
                        </span>
                        <ChevronRight
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            openQuestion === `${category.category}-${index}`
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </button>
                      {openQuestion === `${category.category}-${index}` && (
                        <div className="px-4 pb-3 text-sm text-gray-300 border-t border-white/10 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Contact Support</h2>
              </div>
              {ticketSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">Ticket Submitted!</p>
                  <p className="text-sm text-gray-400">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, subject: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      placeholder="What can we help with?"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Priority
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, priority: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Message
                    </label>
                    <textarea
                      required
                      value={ticketForm.message}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, message: e.target.value })
                      }
                      rows={6}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                      placeholder="Describe your issue or question..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="/learning"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300"
                >
                  <Book className="h-4 w-4" />
                  Learning Center
                </a>
                <a
                  href="/legal"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  Terms & Privacy
                </a>
                <a
                  href="mailto:forexpromanage@gmail.com"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300"
                >
                  <Mail className="h-4 w-4" />
                  forexpromanage@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

