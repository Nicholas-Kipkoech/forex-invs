import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

type Props = {
  walletAddress: string;
  qrImage?: string;
};

function downloadGuideAsPdf(text: string, filename = "deposit-guide.txt") {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DepositGuide({ walletAddress, qrImage }: Props) {
  const guideText = `
How to deposit Bitcoin (BTC) to Forex Pro Manage
------------------------------------------------
Wallet address:
${walletAddress}

Steps:
1. Open your wallet or exchange (e.g., Binance, Coinbase, Trust Wallet).
2. Choose Withdraw / Send -> Bitcoin (BTC).
3. Paste address or scan QR.
4. Ensure network is BTC.
5. (Optional) Send a small test first.
6. Upload TXID proof here.
`;

  const [copied, setCopied] = useState(false);

  return (
    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Text Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-emerald-700">
            How to deposit BTC
          </h3>
          <p className="text-sm text-slate-700 mt-1">
            Step-by-step instructions for common wallets and exchanges. If you
            need help, download the guide or contact support.
          </p>

          <div className="mt-4 space-y-5">
            {/* General steps */}
            <div>
              <h4 className="text-sm font-medium text-slate-600">
                General steps
              </h4>
              <ol className="list-decimal list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>Open your exchange or wallet app.</li>
                <li>Go to Withdraw / Send and choose Bitcoin (BTC).</li>
                <li>Paste the address or scan the QR code.</li>
                <li>Use the Bitcoin network only.</li>
                <li>Send a small test if unsure.</li>
                <li>Copy TXID and upload proof.</li>
              </ol>
            </div>

            {/* Binance */}
            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Binance (mobile)
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>Wallet → Fiat and Spot → Withdraw → Crypto → BTC</li>
                <li>Paste address → choose network: BTC → confirm</li>
                <li>Copy TXID and upload screenshot</li>
              </ul>
            </div>

            {/* Trust Wallet */}
            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Trust Wallet
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>Open Trust Wallet → Bitcoin → Receive → copy or show QR</li>
                <li>From sending app → Send → paste address → confirm</li>
              </ul>
            </div>

            {/* Safety Tips */}
            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Safety tips
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>Always confirm the network: BTC only.</li>
                <li>Send a small test amount first.</li>
                <li>Keep a screenshot and TXID.</li>
                <li>Contact support if unsure before sending.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* QR Section */}
        <div className="w-full md:w-40 flex justify-center md:justify-end">
          {qrImage ? (
            <img
              src={qrImage}
              alt="Deposit QR"
              className="w-40 h-40 object-contain rounded-md bg-white p-2"
            />
          ) : (
            <div className="w-40 h-40 bg-white rounded-md flex items-center justify-center text-sm text-slate-500">
              QR
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mt-4">
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
            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <Button
          onClick={() => downloadGuideAsPdf(guideText, "BTC-deposit-guide.txt")}
          className="sm:ml-auto w-full sm:w-auto"
        >
          Download Guide
        </Button>
      </div>
    </div>
  );
}
