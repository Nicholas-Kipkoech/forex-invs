"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Copy,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Wallet,
  QrCode,
  ArrowDownCircle,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { formatMoney } from "@/lib/utils";

export default function DepositPageContent() {
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<"BTC" | "USDT">("BTC");
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null
  );

  const wallets = {
    BTC: {
      address: "1CDYEta833Bd4uLNTpPRQhwDtjzb7cvFAa",
      qr: "/btc-qrcode.png",
      network: "Bitcoin Network",
      icon: "₿",
      color: "from-orange-500 to-orange-600",
      name: "Bitcoin",
    },
    USDT: {
      address: "TPDrmoEkGiYkGuQQY5r6DvVrriqAbSicWf",
      qr: "/usdt-qrcode.png",
      network: "TRC20 (USDT)",
      icon: "₮",
      color: "from-emerald-500 to-emerald-600",
      name: "Tether",
    },
  };

  const walletAddress = wallets[selectedCoin].address;
  const network = wallets[selectedCoin].network;
  const walletInfo = wallets[selectedCoin];

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user)
        setUser({
          email: data.user.email!,
          name: (data.user.user_metadata as any)?.name,
        });
    };
    fetchUser();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload proof of payment");
    if (!amount || Number(amount) <= 0)
      return alert("Enter a valid deposit amount");
    if (!user) return alert("User not logged in");

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(",")[1];

      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "deposit",
            coin: selectedCoin,
            network,
            name: user.name || "User",
            email: user.email,
            depositAmount: `$${amount}`,
            file: {
              filename: file.name,
              mimetype: file.type,
              base64: base64Data,
            },
          }),
        });
        setSubmitted(true);
      } catch (err) {
        console.error(err);
        alert("Failed to submit deposit. Please try again.");
      }

      setLoading(false);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <ArrowDownCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Deposit Funds</h1>
              <p className="text-gray-400">
                Fund your account securely with cryptocurrency
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Deposit Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coin Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Select Cryptocurrency
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(["BTC", "USDT"] as const).map((coin) => (
                  <button
                    key={coin}
                    onClick={() => setSelectedCoin(coin)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCoin === coin
                        ? `border-emerald-500 bg-emerald-500/10 ${walletInfo.color}`
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${
                          selectedCoin === coin
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {wallets[coin].icon}
                      </div>
                      <div className="text-left">
                        <div
                          className={`font-semibold ${
                            selectedCoin === coin ? "text-white" : "text-gray-300"
                          }`}
                        >
                          {coin}
                        </div>
                        <div className="text-xs text-gray-400">
                          {wallets[coin].name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Wallet Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  {selectedCoin} Wallet Address
                </h2>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                  Network: {network}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm text-white break-all flex-1">
                    {walletAddress}
                  </p>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className={`shrink-0 ${
                      copied
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    } text-white`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              
              
            </motion.div>

            {/* Deposit Form */}
            {!submitted && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 space-y-6"
              >
                <h2 className="text-lg font-semibold text-white">
                  Deposit Information
                </h2>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deposit Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum deposit: $100
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Proof of Payment
                  </label>
                  <label className="block">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-white/5">
                      {file ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                          <p className="text-sm font-medium text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="h-10 w-10 text-gray-400" />
                          <p className="text-sm text-gray-300">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !file || !amount || Number(amount) < 100}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    `Submit ${selectedCoin} Deposit Proof`
                  )}
                </Button>
              </motion.form>
            )}

            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 backdrop-blur-xl rounded-xl p-8 border border-emerald-500/20 text-center"
              >
                <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Deposit Submitted Successfully!
                </h3>
                <p className="text-gray-300 mb-4">
                  Your {selectedCoin} deposit of{" "}
                  <span className="font-bold text-white">{formatMoney(Number(amount))}</span>{" "}
                  on {network} is being processed.
                </p>
                <p className="text-sm text-gray-400">
                  You'll receive confirmation via email once verified (usually within 1-3 hours).
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Instructions & Info */}
          <div className="space-y-6">
            {/* Important Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">
                  Important Instructions
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Send only {selectedCoin}
                    </p>
                    <p className="text-gray-400">
                      Use the {network} network only. Sending other coins or using wrong network may result in permanent loss.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Double-check address</p>
                    <p className="text-gray-400">
                      Always verify the wallet address before sending. Copy it directly from this page.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Upload proof</p>
                    <p className="text-gray-400">
                      After sending, upload your transaction proof immediately to speed up processing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Wait for confirmation</p>
                    <p className="text-gray-400">
                      Deposits are credited after blockchain confirmation (usually 1-3 confirmations).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Security</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Bank-level encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Segregated accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>24/7 monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Regulated platform</span>
                </div>
              </div>
            </motion.div>

            {/* Processing Time */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Processing Time
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white font-medium">{network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Confirmations</span>
                  <span className="text-white font-medium">1-3 blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Time</span>
                  <span className="text-white font-medium">10-30 minutes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
