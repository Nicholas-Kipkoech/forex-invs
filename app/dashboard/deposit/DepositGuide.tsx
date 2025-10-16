import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

type Props = {
  walletAddress: string;
  qrImage?: string;
};

function downloadGuideAsPdf(text: string, filename = "deposit-guide.txt") {
  // simple fallback: download as .txt. You can change to PDF generation on the server or with a client-side library.
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

General steps (works for most exchanges / wallets)
1. Open your exchange/wallet app (e.g., Binance, Coinbase, Trust Wallet).
2. Go to Wallet / Fiat and Spot / Balances.
3. Choose Withdraw or Send.
4. Select Bitcoin (BTC) as the asset.
5. Paste the wallet address exactly (or scan the QR code).
6. Choose the Bitcoin network (BTC) — do NOT choose networks like BEP20 unless explicitly supported.
7. (Optional) Send a small test amount first (e.g., $5-$10 worth of BTC).
8. After confirming the transaction, copy the transaction ID (TXID) and upload a screenshot/receipt here.
9. Wait for blockchain confirmations — we will credit your deposit after confirmation.

Binance Mobile (quick)
1. Open Binance app -> Wallet -> Fiat and Spot.
2. Tap Withdraw -> Crypto.
3. Pick BTC.
4. Paste the address and select the Network: BTC (or Bitcoin).
5. Enter amount and confirm with 2FA.
6. Copy the TXID and upload proof.

Trust Wallet (quick)
1. Open Trust Wallet -> Bitcoin.
2. Tap Receive -> copy the address or scan QR.
3. From the sending app, choose Send, paste the address, confirm.
4. Wait for confirmations.

Important!
- Always confirm the network: choose BTC/Bitcoin.
- Double-check the address — crypto transactions are irreversible.
- Start with a small test transfer if unsure.
- Save the TXID and upload a screenshot as proof.
`;

  const [copied, setCopied] = useState(false);

  return (
    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-emerald-700">
            How to deposit BTC
          </h3>
          <p className="text-sm text-slate-700 mt-1">
            Step-by-step instructions for common wallets and exchanges. If you
            need help, download the guide or contact support.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-600">
                General steps
              </h4>
              <ol className="list-decimal list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>Open your exchange or wallet app.</li>
                <li>Go to Withdraw / Send and choose Bitcoin (BTC).</li>
                <li>Paste the address exactly or scan the QR code.</li>
                <li>
                  Select the Bitcoin network (BTC) — do not use non-Bitcoin
                  networks.
                </li>
                <li>Send a small test amount first if unsure.</li>
                <li>Copy the transaction ID (TXID) and upload proof here.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Binance (mobile)
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>Wallet → Fiat and Spot → Withdraw → Crypto → BTC</li>
                <li>
                  Paste address, choose network: BTC (Bitcoin), enter amount,
                  confirm with 2FA
                </li>
                <li>Copy the TXID and upload a screenshot as proof</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Trust Wallet
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>
                  Open Trust Wallet → Bitcoin → Receive → copy the address or
                  show QR
                </li>
                <li>From sending app, choose Send → paste address → confirm</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Safety tips
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                <li>
                  Always check network — sending via the wrong network can lose
                  funds.
                </li>
                <li>Send a small test amount first.</li>
                <li>Keep a screenshot of the transaction & the TXID.</li>
                <li>Contact support if you’re unsure before sending funds.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-40 flex-shrink-0">
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

      <div className="flex items-center gap-2">
        <span className="font-mono text-emerald-700 truncate">
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
          className="flex items-center gap-1 ml-2"
        >
          <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
        </Button>

        <Button
          onClick={() => downloadGuideAsPdf(guideText, "BTC-deposit-guide.txt")}
          className="ml-auto"
        >
          Download Guide
        </Button>
      </div>
    </div>
  );
}
