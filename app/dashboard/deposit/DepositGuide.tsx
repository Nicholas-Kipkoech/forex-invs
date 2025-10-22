"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Info, FileDown } from "lucide-react";

type Props = {
  walletAddress: string;
  qrImage?: string;
  broker?: string;
};

function downloadGuideAsTxt(text: string, filename = "btc-deposit-guide.txt") {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DepositGuide({
  walletAddress,
  qrImage,
  broker = "TradingView",
}: Props) {
  const [copied, setCopied] = useState(false);

  const guideText = `
How to Deposit Bitcoin (BTC) to ${broker}
------------------------------------------
Wallet Address:
${walletAddress}

Steps:
1. Open your preferred crypto wallet or exchange (e.g., Binance, Coinbase, Trust Wallet).
2. Choose “Withdraw” or “Send” → Select Bitcoin (BTC).
3. Paste the wallet address or scan the QR code.
4. Ensure the network is BTC (Bitcoin).
5. (Optional) Send a small test amount first.
6. Once confirmed, your account will be funded automatically.
`;

  const steps = [
    "Open your crypto wallet or exchange (e.g., Binance, Coinbase, Trust Wallet).",
    "Go to 'Send' or 'Withdraw' and select Bitcoin (BTC).",
    "Paste the BTC wallet address or scan the QR code below.",
    "Ensure the transfer network is BTC only — not BEP20 or ERC20.",
    "Confirm and send your funds.",
    "Wait for blockchain confirmation (usually 1–3 confirmations).",
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border border-emerald-200 p-6 rounded-2xl shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Info className="h-6 w-6 text-emerald-600" />
        <div>
          <h3 className="text-lg font-semibold text-emerald-700">
            Deposit Bitcoin (BTC)
          </h3>
          <p className="text-sm text-slate-600">
            Fund your {broker} trading account securely using Bitcoin.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        {/* Steps */}
        <div className="flex-1 space-y-5">
          <div>
            <h4 className="text-sm font-medium text-slate-700">
              Deposit Steps
            </h4>
            <ol className="list-decimal list-inside text-sm text-slate-700 mt-2 space-y-1">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          {/* Safety */}
          <div>
            <h4 className="text-sm font-medium text-slate-700">Safety Tips</h4>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
              <li>Always confirm the network is BTC before sending.</li>
              <li>
                Send a small test amount if you’re depositing for the first
                time.
              </li>
              <li>Keep your transaction ID (TXID) as proof of transfer.</li>
              <li>
                Contact support if your deposit doesn’t reflect after 1 hour.
              </li>
            </ul>
          </div>
        </div>

        {/* QR Section */}
        <div className="w-full md:w-48 flex justify-center md:justify-end">
          {qrImage ? (
            <img
              src={qrImage}
              alt="BTC Deposit QR"
              className="w-48 h-48 object-contain rounded-xl bg-white p-2 shadow-md"
            />
          ) : (
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center text-slate-500 border border-slate-200">
              QR Not Available
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-mono text-emerald-700 text-sm truncate">
            {walletAddress}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(walletAddress);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-1 shrink-0"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <Button
          onClick={() =>
            downloadGuideAsTxt(guideText, `${broker}-btc-deposit-guide.txt`)
          }
          className="sm:ml-auto w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <FileDown className="h-4 w-4 mr-2" /> Download Guide
        </Button>
      </div>
    </div>
  );
}
