"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import DepositGuide from "./DepositGuide";

export default function DepositPage() {
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null
  );

  const walletAddress = "1CDYEta833Bd4uLNTpPRQhwDtjzb7cvFAa";
  const qrImage = "/btc-qrcode.png";

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
        console.error("Failed to notify admin:", err);
        alert("Failed to submit deposit. Please try again.");
      }

      setLoading(false);
    };
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-8 border border-slate-200">
      <h1 className="text-3xl font-bold text-emerald-700 mb-2">Deposit BTC</h1>
      <p className="text-slate-600 mb-6">
        Fund your account securely using Bitcoin. After sending, upload your
        proof of payment for quick verification.
      </p>

      {/* Wallet Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <p className="text-xs uppercase text-emerald-700 font-semibold">
            Wallet Address
          </p>
          <p className="font-mono text-slate-800 break-all mt-1">
            {walletAddress}
          </p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          className={`border-emerald-300 ${
            copied ? "bg-emerald-100 text-emerald-700" : "hover:bg-emerald-50"
          }`}
        >
          <Copy className="h-4 w-4 mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Deposit Guide */}
      <DepositGuide walletAddress={walletAddress} qrImage={qrImage} />

      {!submitted && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6 border-t border-slate-100 pt-6"
        >
          {/* Amount */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Deposit Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Proof Upload */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Upload Proof of Payment
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-emerald-400 transition">
              <UploadCloud className="h-8 w-8 text-emerald-500 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-center"
              />
              {file && (
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700">
            <p className="font-semibold text-emerald-700 mb-1">⚠️ Important</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Send only Bitcoin (BTC) to this address.</li>
              <li>Sending other coins may result in permanent loss.</li>
              <li>Upload your transaction proof immediately after sending.</li>
              <li>Deposits are credited after blockchain confirmation.</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Proof"}
          </Button>
        </form>
      )}

      {submitted && (
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-emerald-700 font-semibold text-lg">
            ✅ Payment proof submitted successfully!
          </p>
          <p className="text-slate-600 mt-2">
            Your deposit of{" "}
            <span className="font-bold text-emerald-700">${amount}</span> is
            being processed. You’ll receive confirmation once verified.
          </p>
        </div>
      )}
    </div>
  );
}
