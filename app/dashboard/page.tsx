"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";

/**
 * StockAI Dashboard — Multi-asset, TradingView embed, mock real-time prices, simulated orders
 *
 * Notes:
 * - TradingView widget script is used (official embed). Ensure CSP allows s3.tradingview.com if deploying.
 * - All trading is simulated locally (no real execution). Replace with broker/brokerage API for production.
 */

const CATEGORIES: Record<
  string,
  { label: string; list: { id: string; name: string; tvSymbol: string }[] }
> = {
  Stocks: {
    label: "Stocks",
    list: [
      { id: "AAPL", name: "Apple", tvSymbol: "NASDAQ:AAPL" },
      { id: "TSLA", name: "Tesla", tvSymbol: "NASDAQ:TSLA" },
      { id: "NVDA", name: "NVIDIA", tvSymbol: "NASDAQ:NVDA" },
      { id: "AMZN", name: "Amazon", tvSymbol: "NASDAQ:AMZN" },
      { id: "MSFT", name: "Microsoft", tvSymbol: "NASDAQ:MSFT" },
    ],
  },
  ETFs: {
    label: "ETFs",
    list: [
      { id: "SPY", name: "SPDR S&P 500 ETF", tvSymbol: "ARCA:SPY" },
      { id: "QQQ", name: "Invesco QQQ", tvSymbol: "NASDAQ:QQQ" },
      { id: "VOO", name: "Vanguard S&P 500", tvSymbol: "AMEX:VOO" },
    ],
  },
  Bonds: {
    label: "Bonds",
    list: [
      { id: "US10Y", name: "U.S. 10Y Yield", tvSymbol: "CBOE:TNX" },
      { id: "US02Y", name: "U.S. 2Y Yield", tvSymbol: "CBOE:US02Y" }, // placeholder
    ],
  },
  Funds: {
    label: "Mutual Funds",
    list: [
      {
        id: "VTSAX",
        name: "Vanguard Total Stock Mkt Adm",
        tvSymbol: "MUTF:VTSAX",
      }, // MUTF is an example prefix
      { id: "FXAIX", name: "Fidelity 500 Index Fund", tvSymbol: "MUTF:FXAIX" },
    ],
  },
  Commodities: {
    label: "Commodities",
    list: [
      { id: "XAUUSD", name: "Gold (XAU/USD)", tvSymbol: "FOREXCOM:XAUUSD" },
      { id: "CL", name: "Crude Oil (WTI)", tvSymbol: "NYMEX:CL1!" },
    ],
  },
  Indices: {
    label: "Indices",
    list: [
      { id: "SPX", name: "S&P 500", tvSymbol: "SP:SPX" },
      { id: "NDX", name: "NASDAQ 100", tvSymbol: "NASDAQ:NDX" },
    ],
  },
  Crypto: {
    label: "Crypto",
    list: [
      { id: "BTCUSD", name: "Bitcoin", tvSymbol: "COINBASE:BTCUSD" },
      { id: "ETHUSD", name: "Ethereum", tvSymbol: "COINBASE:ETHUSD" },
    ],
  },
};

const DEFAULT_CATEGORY = "Stocks";
const DEFAULT_SYMBOL = CATEGORIES[DEFAULT_CATEGORY].list[0].id;

// initial mock balance
const START_BALANCE = 0;

export default function DashboardPage() {
  // auth/profile would go here — for this example it's simulated
  const [balance, setBalance] = useState<number>(START_BALANCE);
  const [portfolio, setPortfolio] = useState<
    Record<string, { shares: number; avgPrice: number }>
  >({});
  const [trades, setTrades] = useState<any[]>([]); // recent orders
  const [notifications, setNotifications] = useState<string[]>([]);

  // market state
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    // seed prices for every supported symbol
    const out: Record<string, number> = {};
    Object.values(CATEGORIES).forEach((cat) => {
      cat.list.forEach((s) => {
        out[s.id] = +(50 + Math.random() * 950).toFixed(2);
      });
    });
    return out;
  });

  // TradingView embed container ref + unique id to recreate widget on symbol change
  const tvContainerIdRef = useRef(
    `tv-widget-${Math.random().toString(36).slice(2, 9)}`
  );
  const [tvWidgetKey, setTvWidgetKey] = useState<number>(0);

  // mini portfolio series for chart
  const [series, setSeries] = useState<{ name: string; value: number }[]>(() =>
    mockSeries(30, START_BALANCE)
  );

  // realtime price jitter simulation
  useEffect(() => {
    const id = window.setInterval(() => {
      setPrices((p) => {
        const next = { ...p };
        Object.keys(next).forEach((k) => {
          const jitter = (Math.random() - 0.5) * (next[k] * 0.003); // ±0.3%
          next[k] = Math.max(0.01, +(next[k] + jitter).toFixed(2));
        });
        return next;
      });

      // also nudge portfolio series to feel dynamic
      setSeries((s) => {
        const last = s[s.length - 1]?.value ?? START_BALANCE;
        const change = (Math.random() - 0.45) * (last * 0.002); // small changes
        const nextVal = Math.max(0, Math.round((last + change) * 100) / 100);
        return [...s.slice(-29), { name: `T${s.length + 1}`, value: nextVal }];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // handle tradingview embed lifecycle (lazy load and recreate on symbol change)
  useEffect(() => {
    // create a unique container id so we can recreate the widget
    const containerId = tvContainerIdRef.current;
    // clear previous contents
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = "";

    // create script tag for TradingView widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      try {
        // find tvSymbol for current symbol
        const tvSymbol = findTvSymbol(symbol);
        // instantiate widget
        // @ts-ignore
        new (window as any).TradingView.widget({
          container_id: containerId,
          autosize: true,
          symbol: tvSymbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1b2430",
          enable_publishing: false,
          allow_symbol_change: true,
        });
      } catch (err) {
        console.error("TradingView widget error:", err);
      }
    };

    // append script and ensure container exists
    if (!container) {
      const wrapper = document.getElementById("tv-wrapper");
      if (wrapper) {
        const div = document.createElement("div");
        div.id = containerId;
        div.style.width = "100%";
        div.style.height = "100%";
        wrapper.appendChild(div);
        document.body.appendChild(script);
      }
    } else {
      document.body.appendChild(script);
    }

    // increment key to force re-render (optional)
    setTvWidgetKey((k) => k + 1);

    return () => {
      // cleanup: remove the script (might remove other tv scripts if multiple on page — keep simple)
      // Better approach: track script element by id; here we remove the one we appended if still present.
      const scripts = Array.from(document.getElementsByTagName("script"));
      scripts.forEach((s) => {
        if (s.src && s.src.includes("s3.tradingview.com/tv.js")) {
          // don't remove all tradingview scripts if other pages rely on them; this is a safe-try cleanup
          // s.parentNode?.removeChild(s);
        }
      });
      // clear container to avoid duplicate widgets
      const c = document.getElementById(containerId);
      if (c) c.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // helpers
  const tvListForCategory = CATEGORIES[category].list;
  const tvSymbol = findTvSymbol(symbol);

  // portfolio metrics
  const portfolioValue = useMemo(() => {
    return Object.entries(portfolio).reduce((acc, [id, pos]) => {
      const price = prices[id] ?? 0;
      return acc + pos.shares * price;
    }, 0);
  }, [portfolio, prices]);

  const totalEquity = useMemo(
    () => Math.round((balance + portfolioValue) * 100) / 100,
    [balance, portfolioValue]
  );

  // Simulated trade placement (BUY/SELL)
  const placeOrder = (opts: {
    side: "BUY" | "SELL";
    symbol: string;
    shares: number;
  }) => {
    const price = prices[opts.symbol] ?? 0;
    const cost = Math.round(price * opts.shares * 100) / 100;

    if (opts.side === "BUY") {
      if (cost > balance) {
        setNotifications((n) =>
          [`Insufficient funds: need $${cost}`, ...n].slice(0, 6)
        );
        return;
      }
      // debit cash, add to holdings (weighted avg)
      setBalance((b) => Math.round((b - cost) * 100) / 100);
      setPortfolio((p) => {
        const prev = p[opts.symbol];
        if (!prev) {
          return {
            ...p,
            [opts.symbol]: { shares: opts.shares, avgPrice: price },
          };
        } else {
          const totalShares = prev.shares + opts.shares;
          const avgPrice =
            Math.round(
              ((prev.avgPrice * prev.shares + price * opts.shares) /
                totalShares) *
                100
            ) / 100;
          return { ...p, [opts.symbol]: { shares: totalShares, avgPrice } };
        }
      });
    } else {
      // SELL
      setPortfolio((p) => {
        const prev = p[opts.symbol];
        if (!prev || prev.shares < opts.shares) {
          setNotifications((n) =>
            ["Not enough shares to sell", ...n].slice(0, 6)
          );
          return p;
        }
        const remaining = prev.shares - opts.shares;
        const updated = { ...p };
        if (remaining === 0) {
          delete updated[opts.symbol];
        } else {
          updated[opts.symbol] = { shares: remaining, avgPrice: prev.avgPrice };
        }
        // credit cash
        setBalance((b) => Math.round((b + cost) * 100) / 100);
        return updated;
      });
    }

    // push trade record
    const trade = {
      id: `T${Math.floor(Math.random() * 900000 + 100000)}`,
      symbol: opts.symbol,
      side: opts.side,
      shares: opts.shares,
      price,
      cost,
      time: new Date().toLocaleTimeString(),
    };
    setTrades((t) => [trade, ...t].slice(0, 50));
    setNotifications((n) =>
      [
        `${opts.side} ${opts.shares} ${opts.symbol} @ ${formatMoney(
          price
        )} — ${formatMoney(trade.cost)}`,
        ...n,
      ].slice(0, 6)
    );
  };

  // mini helper to update symbol when category changes
  useEffect(() => {
    const first = CATEGORIES[category].list[0]?.id;
    if (first) setSymbol(first);
  }, [category]);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0E13] text-gray-100 p-4 sm:p-6">
      {/* notifications */}
      <div className="fixed top-4 right-4 z-50 w-[320px] max-w-[90vw] flex flex-col gap-2">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#081018] border border-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            {n}
          </motion.div>
        ))}
      </div>

      {/* header */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-[#091018] flex items-center justify-center font-bold text-lg shadow">
            MP
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">My Portfolio</h1>
            <div className="text-xs text-gray-400">
              Multi-asset live market & trading (simulated)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              router.push("/dashboard/deposit");
            }}
            className="bg-emerald-500 hover:bg-emerald-400"
          >
            Deposit
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => {
              router.push("/dashbord/withdraw");
            }}
            className="border-gray-600"
          >
            Withdraw
          </Button> */}
        </div>
      </header>

      {/* main grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* left column */}
        <section className="lg:col-span-8 space-y-6">
          {/* portfolio summary */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-400">Total Equity</div>
                <div className="text-3xl font-bold">
                  {formatMoney(totalEquity)}
                </div>
                <div className="text-sm text-gray-500">
                  Cash: {formatMoney(balance)} • Holdings:{" "}
                  {formatMoney(portfolioValue)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setNotifications((n) =>
                      ["Exported performance (mock)", ...n].slice(0, 6)
                    )
                  }
                  className="bg-gray-700 border"
                >
                  Export
                </Button>
                <Button
                  onClick={() => {
                    setPortfolio({});
                    setBalance(START_BALANCE);
                    setTrades([]);
                    setNotifications((n) =>
                      ["Reset portfolio (demo)", ...n].slice(0, 6)
                    );
                  }}
                  className="bg-rose-600"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* small area chart */}
            <div className="mt-4 w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#0b1220"
                  />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip formatter={(v: any) => formatMoney(v)} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    fill="url(#g1)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* market selector + tradingview container */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-300">Category</div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
                >
                  {Object.keys(CATEGORIES).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORIES[c].label}
                    </option>
                  ))}
                </select>

                <div className="ml-2 text-sm text-gray-300">Symbol</div>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
                >
                  {tvListForCategory.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400 mr-2">Live price</div>
                <div className="text-xl font-semibold">
                  {formatMoney(prices[symbol])}
                </div>
              </div>
            </div>

            {/* TradingView container fallback: we place a wrapper div with id 'tv-wrapper' and a child container id computed above */}
            <div
              id="tv-wrapper"
              className="w-full h-[420px] rounded-lg overflow-hidden border border-gray-800"
              style={{ background: "#071018" }}
            >
              <div
                id={tvContainerIdRef.current}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Trade controls */}
          <TradePanel prices={prices} placeOrder={placeOrder} />

          {/* recent trades table */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-300">Recent Orders</div>
              <div className="text-xs text-gray-500">
                {trades.length} orders
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 text-left border-b border-gray-800">
                  <tr>
                    <th className="py-2 px-2">ID</th>
                    <th className="py-2 px-2">Symbol</th>
                    <th className="py-2 px-2">Side</th>
                    <th className="py-2 px-2">Shares</th>
                    <th className="py-2 px-2">Price</th>
                    <th className="py-2 px-2">Total</th>
                    <th className="py-2 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-b border-gray-800">
                      <td className="py-2 px-2 text-gray-300">{t.id}</td>
                      <td className="py-2 px-2">{t.symbol}</td>
                      <td
                        className={`py-2 px-2 font-semibold ${
                          t.side === "BUY"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {t.side}
                      </td>
                      <td className="py-2 px-2">{t.shares}</td>
                      <td className="py-2 px-2">{formatMoney(t.price)}</td>
                      <td className="py-2 px-2">{formatMoney(t.cost)}</td>
                      <td className="py-2 px-2 text-xs text-gray-500">
                        {t.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {trades.length === 0 && (
                <div className="text-sm text-gray-500 py-4">
                  No orders yet — try placing a simulated trade.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* right sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* quick portfolio */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
            <div className="text-sm text-gray-400">Portfolio Snapshot</div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">Cash</div>
                <div className="font-medium">{formatMoney(balance)}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-400">Holdings</div>
                <div className="font-medium">{formatMoney(portfolioValue)}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-400">Equity</div>
                <div className="font-bold text-xl">
                  {formatMoney(totalEquity)}
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Tip: This is a simulated balance and holdings view for demo
              purposes.
            </div>
          </div>

          {/* holdings */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
            <div className="text-sm text-gray-300 mb-2">Holdings</div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(portfolio).length === 0 && (
                <div className="text-sm text-gray-500">No holdings yet.</div>
              )}
              {Object.entries(portfolio).map(([id, pos]) => {
                const current = prices[id] ?? 0;
                const value = +(pos.shares * current).toFixed(2);
                const pnl = +(value - pos.shares * pos.avgPrice).toFixed(2);
                return (
                  <div key={id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{id}</div>
                      <div className="text-xs text-gray-400">
                        {pos.shares} shares • avg {formatMoney(pos.avgPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatMoney(value)}</div>
                      <div
                        className={`text-xs ${
                          pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {formatMoney(pnl)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* supported markets */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
            <div className="text-sm text-gray-300 mb-3">Supported Markets</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                "Stocks",
                "ETFs",
                "Bonds",
                "Mutual Funds",
                "Commodities",
                "Indices",
                "Crypto",
              ].map((m) => (
                <div
                  key={m}
                  className="p-3 bg-[#0b1220] rounded border border-gray-700 text-gray-300"
                >
                  {m}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-3">
              Access thousands of global instruments across major exchanges —
              U.S., Europe & Asia.
            </div>
          </div>

          {/* faq / help */}
          <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800 text-sm">
            <div className="text-sm text-gray-300 mb-2">Help & FAQ</div>
            <div className="text-gray-400">
              <div className="mb-2">
                <strong>Is this live trading?</strong> No — this demo simulates
                orders locally. Integrate a broker API for real execution.
              </div>
              <div className="mb-2">
                <strong>How do I fund?</strong> Use the Deposit button to begin
                — link to your funding providers in production.
              </div>
              <div>
                <strong>Security:</strong> We recommend bank-grade custody &
                two-factor authentication in production.
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* -------------------- TradePanel -------------------- */

function TradePanel({ prices, placeOrder }: any) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState<string>(() => DEFAULT_SYMBOL);
  const [shares, setShares] = useState<number | "">("");

  useEffect(() => {
    setSymbol(DEFAULT_SYMBOL);
  }, []);

  return (
    <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
      <div className="text-sm text-gray-300 mb-3">Quick Trade</div>
      <div className="grid sm:grid-cols-4 gap-3">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
        >
          {Object.values(CATEGORIES)
            .flatMap((c) => c.list)
            .map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.id} • {s.name}
              </option>
            ))}
        </select>
        <input
          type="number"
          min={0}
          placeholder="Shares"
          value={shares as any}
          onChange={(e) =>
            setShares(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as any)}
          className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <Button
          onClick={() => {
            if (!symbol || !shares || Number(shares) <= 0) return;
            placeOrder({ side, symbol, shares: Number(shares) });
            setShares("");
          }}
          className="bg-emerald-500"
        >
          Place Order
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-3">
        Orders are simulated locally — connect a brokerage API for real
        execution.
      </div>
      <div className="mt-3 text-xs text-gray-400">
        Current price: {formatMoney(prices[symbol])}
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function findTvSymbol(id: string) {
  for (const cat of Object.values(CATEGORIES)) {
    const found = cat.list.find((s) => s.id === id);
    if (found) return found.tvSymbol;
  }
  return `NASDAQ:${id}`;
}

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function mockSeries(len = 30, base = 5000) {
  let val = base;
  return Array.from({ length: len }).map((_, i) => {
    const change = (Math.random() - 0.45) * (base * 0.01);
    val = Math.max(0, Math.round((val + change) * 100) / 100);
    return { name: `T${i + 1}`, value: val };
  });
}
