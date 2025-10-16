"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function DepositPage() {
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState(""); // deposit amount
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null
  );

  const walletAddress = "1CDYEta833Bd4uLNTpPRQhwDtjzb7cvFAa";
  const qrImage = "/btc-qrcode.png";

  // Get current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to get user:", error.message);
        return;
      }
      if (user) {
        setUser({
          email: user.email!,
          name: (user.user_metadata as any)?.name,
        });
      }
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

    // TODO: Upload file logic here (Supabase bucket or API)

    // Send notification email with user info
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deposit",
          name: user.name || "User",
          email: user.email,
          depositAmount: `$${amount}`,
        }),
      });
    } catch (err) {
      console.error("Failed to notify admin:", err);
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl space-y-6">
      <h1 className="text-3xl font-extrabold text-emerald-700">Deposit BTC</h1>
      <p className="text-slate-600">
        Send Bitcoin to the address below to fund your account. After sending,
        upload your proof of payment for verification.
      </p>

      {/* Wallet Card with QR Image */}
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <img
            src={qrImage}
            alt="BTC Wallet QR Code"
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <span className="font-mono text-emerald-700 text-sm sm:text-base truncate">
            {walletAddress}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`w-32 flex items-center justify-center gap-1 border-emerald-300 ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-emerald-100"
            }`}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Deposit Amount Input */}
      {!submitted && (
        <div className="space-y-4">
          <label className="block text-sm text-slate-600">
            Deposit Amount (USD)
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter deposit amount"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          />
        </div>
      )}

      {/* Instructions */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-sm text-slate-700 space-y-2">
        <p>⚠️ Important:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Send Bitcoin only to the address above.</li>
          <li>Do not send any other cryptocurrency.</li>
          <li>After sending, upload your proof of transaction below.</li>
          <li>Deposits are credited once confirmed on the Bitcoin network.</li>
        </ul>
      </div>

      {/* Upload Proof OR Processing */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Upload Proof of Payment
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
            {file && (
              <p className="mt-2 text-xs text-emerald-700">
                Selected: {file.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Proof"}
          </Button>
        </form>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center text-emerald-700 font-semibold shadow-md">
          ✅ Payment proof submitted! <br />
          Your deposit of ${amount} is currently being processed. Please wait
          for confirmation.
        </div>
      )}
    </div>
  );
}
