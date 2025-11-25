"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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
    },
    USDT: {
      address: "TPDrmoEkGiYkGuQQY5r6DvVrriqAbSicWf",
      qr: "/usdt-qrcode.png",
      network: "TRC20 (USDT)",
    },
  };

  const walletAddress = wallets[selectedCoin].address;
  const network = wallets[selectedCoin].network;

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
    <div className="max-w-3xl mx-auto bg-black rounded-2xl shadow-md p-8 border border-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-2">Deposit</h1>
      <p className="text-gray-400 mb-6">
        Fund your account securely using Bitcoin (BTC) or Tether (USDT).
      </p>

      {/* Coin Selector */}
      <div className="flex gap-3 mb-6">
        {(["BTC", "USDT"] as const).map((coin) => (
          <Button
            key={coin}
            variant={selectedCoin === coin ? "default" : "outline"}
            onClick={() => setSelectedCoin(coin)}
            className={`px-5 ${
              selectedCoin === coin
                ? "bg-white text-black border-amber-700 border-2  hover:bg-gray-300"
                : "bg-black text-white hover:bg-white/10"
            }`}
          >
            {coin}
          </Button>
        ))}
      </div>

      {/* Wallet Card */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <p className="text-xs uppercase text-gray-400 font-semibold">
            {selectedCoin} Wallet Address ({network})
          </p>
          <p className="font-mono text-gray-300 break-all mt-1">
            {walletAddress}
          </p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          className={`border-white ${
            copied ? "bg-white text-black" : "text-black hover:bg-white/10"
          }`}
        >
          <Copy className="h-4 w-4 mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {!submitted && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6 border-t border-gray-700 pt-6"
        >
          {/* Amount */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Deposit Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-700 rounded-md px-3 py-2 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Proof Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Upload Proof of Payment
            </label>
            <div className="border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-white transition">
              <UploadCloud className="h-8 w-8 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-center"
              />
              {file && (
                <p className="text-xs text-white mt-2 font-medium">
                  {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-400">
            <p className="font-semibold mb-1">⚠️ Important</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Send only {selectedCoin} to the address above ({network}).
              </li>
              <li>Sending other coins may result in permanent loss.</li>
              <li>Upload your transaction proof immediately after sending.</li>
              <li>Deposits are credited after blockchain confirmation.</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-white hover:bg-gray-300 text-black"
            disabled={loading}
          >
            {loading ? "Submitting..." : `Submit ${selectedCoin} Deposit Proof`}
          </Button>
        </form>
      )}

      {submitted && (
        <div className="mt-6 bg-gray-900 border border-white rounded-xl p-6 text-center shadow-sm">
          <p className="text-white font-semibold text-lg">
            ✅ Payment proof submitted successfully!
          </p>
          <p className="text-gray-300 mt-2">
            Your {selectedCoin} deposit of{" "}
            <span className="font-bold text-white">${amount}</span> on {network}{" "}
            is being processed. You’ll receive confirmation once verified.
          </p>
        </div>
      )}
    </div>
  );
}
