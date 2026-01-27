"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function WithdrawalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!amount || !wallet || !network) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }
    if (parseFloat(amount) > balance) {
      setMessage("❌ Insufficient balance.");
      return;
    }

    setLoading(true);
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
    setMessage("✅ Withdrawal request submitted successfully.");
    setAmount("");
    setWallet("");
    setNetwork("");
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 text-white">
      <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-black">
            Afroxen
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Withdraw Funds
            </h1>
            <p className="text-gray-300 text-sm">
              Request crypto withdrawal from your investor account
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-gray-700 text-black hover:bg-gray-800 hover:border-gray-400"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </header>

      <main className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-6 shadow-lg">
        <div className="text-sm text-gray-300 mb-2">Available Balance</div>
        <div className="text-3xl font-bold text-white mb-6">
          ${balance.toLocaleString()}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-300">Amount (USD)</label>
            <input
              type="number"
              className="w-full border border-gray-700 rounded p-2 mt-1 bg-black text-white placeholder-gray-400 focus:border-white focus:ring focus:ring-white/30 outline-none"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Network</label>
            <select
              className="w-full border border-gray-700 rounded p-2 mt-1 bg-black text-white placeholder-gray-400 focus:border-white focus:ring focus:ring-white/30 outline-none"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            >
              <option value="">Select Network</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="Ethereum (ERC-20)">Ethereum (ERC-20)</option>
              <option value="BNB Smart Chain (BEP-20)">
                BNB Smart Chain (BEP-20)
              </option>
              <option value="Tron (TRC-20)">Tron (TRC-20)</option>
              <option value="XRP Ledger">XRP Ledger</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-300">Wallet Address</label>
          <input
            type="text"
            className="w-full border border-gray-700 rounded p-2 mt-1 bg-black text-white placeholder-gray-400 focus:border-white focus:ring focus:ring-white/30 outline-none"
            placeholder="Enter your crypto wallet address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
        </div>

        <Button
          onClick={handleWithdraw}
          className="w-full bg-white hover:bg-gray-300 text-black"
          disabled={loading}
        >
          {loading ? "Processing..." : "Request Withdrawal"}
        </Button>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              message.startsWith("✅") ? "text-white" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </main>
    </div>
  );
}
