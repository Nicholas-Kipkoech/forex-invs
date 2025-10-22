"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * StockProManage Dashboard (Supabase-connected)
 * - switched to stocks (AAPL, TSLA, AMZN, NVDA, MSFT)
 * - includes TradingView widget embed for the selected symbol
 * - mobile responsive
 *
 * Keep your existing DB schema (investors table).
 */

const DEFAULT_SERIES_LEN = 40;
const MAX_TRADES_STORED = 50;
const STOCKS = ["AAPL", "TSLA", "AMZN", "NVDA", "MSFT", "GOOGL", "META"];

const samplePlans = [
  {
    name: "Starter",
    deposit: "$100",
    target: "4–6% / month",
    tag: "Conservative",
  },
  { name: "Growth", deposit: "$500", target: "8–12% / month", tag: "Balanced" },
  {
    name: "Premium",
    deposit: "$1,000+",
    target: "12%+ / month",
    tag: "Aggressive",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  // Profile & data
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [series, setSeries] = useState<{ name: string; value: number }[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");

  // Market selection + real-time mock prices
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const [prices, setPrices] = useState<Record<string, number>>(() =>
    STOCKS.reduce((acc, s) => {
      acc[s] = +(100 + Math.random() * 900).toFixed(2);
      return acc;
    }, {} as Record<string, number>)
  );

  // Trade control refs
  const tradingIntervalRef = useRef<number | null>(null);
  const latestRef = useRef<number>(0); // keep latest balance for interval callbacks

  // TradingView embed ref
  const tvRef = useRef<HTMLDivElement | null>(null);

  // Derived metrics
  const latest = series[series.length - 1]?.value ?? balance;
  const first = series[0]?.value ?? latest;
  const profit = useMemo(() => {
    const p = latest - first;
    return Math.round(p * 100) / 100;
  }, [latest, first]);

  const roi = useMemo(() => {
    if (!first || first === 0) return 0;
    const raw = (profit / first) * 100;
    return Math.round(raw * 100) / 100;
  }, [profit, first]);

  // --- Load profile & starting data ---
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        router.push("/login");
        return;
      }
      const userId = sessionData.session.user.id;
      try {
        const { data: investor, error } = await supabase
          .from("investors")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        if (cancelled) return;

        const startingBalance = Number(investor?.balance ?? 1000);
        setProfile(investor || null);
        setBalance(startingBalance);
        latestRef.current = startingBalance;

        // seed series and trades for UI
        setSeries(mockSeries(DEFAULT_SERIES_LEN, startingBalance));
        setTrades(
          mockTrades(
            Math.min(10, Math.floor(startingBalance / 100) || 3),
            startingBalance
          )
        );
      } catch (err) {
        console.error("Failed loading investor", err);
        setNotifications((n) =>
          ["Failed to load profile. Please login again.", ...n].slice(0, 6)
        );
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // AI insight: dynamic based on recent series growth
  useEffect(() => {
    const timer = setTimeout(() => {
      const recent = series.slice(-6).map((s) => s.value);
      if (recent.length < 2) {
        setAiInsight("Analyzing portfolio performance...");
        return;
      }
      const change =
        ((recent[recent.length - 1] - recent[0]) / (recent[0] || 1)) * 100;
      const formatted = `${(Math.round(change * 10) / 10).toFixed(1)}%`;
      setAiInsight(
        `AI Insight: Portfolio changed ${formatted} over recent trades. Consider rebalancing across sectors.`
      );
    }, 900);
    return () => clearTimeout(timer);
  }, [series]);

  // Keep latestRef in sync
  useEffect(() => {
    latestRef.current = balance;
  }, [balance]);

  // Quick mock of real-time prices (client-only; replace with real feed later)
  useEffect(() => {
    const id = window.setInterval(() => {
      setPrices((p) => {
        const next = { ...p };
        STOCKS.forEach((s) => {
          const jitter = (Math.random() - 0.5) * (next[s] * 0.0025); // ±0.25%
          next[s] = Math.max(1, +(next[s] + jitter).toFixed(2));
        });
        return next;
      });
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  // Trading control (start/stop) - stock flavor
  useEffect(() => {
    if (tradingIntervalRef.current) {
      window.clearInterval(tradingIntervalRef.current);
      tradingIntervalRef.current = null;
    }

    if (!isTrading) return;

    const intervalMs = speed === "slow" ? 6000 : speed === "fast" ? 1500 : 3500;

    tradingIntervalRef.current = window.setInterval(async () => {
      const current = latestRef.current;
      if (!profile || current <= 0) {
        setIsTrading(false);
        setNotifications((n) =>
          ["Trading stopped — no funds or session expired.", ...n].slice(0, 6)
        );
        if (tradingIntervalRef.current) {
          window.clearInterval(tradingIntervalRef.current);
          tradingIntervalRef.current = null;
        }
        return;
      }

      // generate trade (stock)
      const newTrade = generateTrade(current, prices);

      const clampedNewBalance = Math.max(
        0,
        Math.round(newTrade.newBalance * 100) / 100
      );
      const tradeWithClamp = { ...newTrade, newBalance: clampedNewBalance };

      // update UI state atomically
      setTrades((prev) => {
        const updated = [tradeWithClamp, ...prev].slice(0, MAX_TRADES_STORED);
        return updated;
      });
      setSeries((prev) => {
        const next = [
          ...prev,
          { name: `T${prev.length + 1}`, value: tradeWithClamp.newBalance },
        ];
        return next.slice(-DEFAULT_SERIES_LEN);
      });
      setBalance(tradeWithClamp.newBalance);
      latestRef.current = tradeWithClamp.newBalance;

      // persist optimistic balance update
      try {
        const { error } = await supabase
          .from("investors")
          .update({ balance: tradeWithClamp.newBalance })
          .eq("id", profile?.id);
        if (error) console.error("Failed to persist balance", error);
      } catch (err) {
        console.error("Supabase update error", err);
      }

      // occasional notification
      if (Math.random() < 0.28) {
        setNotifications((n) =>
          [
            `${tradeWithClamp.pnl >= 0 ? "▲" : "▼"} ${tradeWithClamp.symbol} ${
              tradeWithClamp.pnl >= 0 ? "+" : ""
            }${tradeWithClamp.pnl.toFixed(2)}`,
            ...n,
          ].slice(0, 6)
        );
      }

      // auto-stop safety
      if (tradeWithClamp.newBalance <= 0) {
        setIsTrading(false);
        setNotifications((n) =>
          ["⚠️ Trading stopped — balance depleted.", ...n].slice(0, 6)
        );
        if (tradingIntervalRef.current) {
          window.clearInterval(tradingIntervalRef.current);
          tradingIntervalRef.current = null;
        }
      }
    }, intervalMs);

    return () => {
      if (tradingIntervalRef.current) {
        window.clearInterval(tradingIntervalRef.current);
        tradingIntervalRef.current = null;
      }
    };
  }, [isTrading, speed, profile, prices]);

  // TradingView embed loader — uses TradingView widget script to embed selectedSymbol
  useEffect(() => {
    // remove old widget if present
    if (!tvRef.current) return;
    tvRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      try {
        // @ts-ignore — TradingView global added by script
        new (window as any).TradingView.widget({
          container_id: tvRef.current?.id,
          autosize: true,
          symbol: `NASDAQ:${selectedSymbol}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f5f9",
          enable_publishing: false,
          allow_symbol_change: true,
        });
      } catch (err) {
        console.warn("TradingView widget load error", err);
      }
    };
    document.body.appendChild(script);

    return () => {
      // cleanup script (leave widget container empty)
      document.body.removeChild(script);
      if (tvRef.current) tvRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymbol]);

  // Scroll trades to top on update
  const tradesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (tradesRef.current) tradesRef.current.scrollTop = 0;
  }, [trades]);

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // UI helpers
  const formatMoney = (n: number) =>
    `$${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 sm:p-6">
      {/* Notifications stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-[320px] max-w-[90vw]">
        {notifications.map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white px-4 py-2 rounded-xl shadow flex items-start gap-3 text-xs border border-emerald-100"
          >
            <div className="text-sm">{note}</div>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-bold text-lg shadow">
            STK
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-700">
              StockProManage
            </h1>
            <p className="text-sm text-slate-500">AI Stock Portfolio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/dashboard/deposit")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Deposit
          </Button>

          <Button
            onClick={() => router.push("/dashboard/withdraw")}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Withdraw
          </Button>

          <motion.button
            onClick={() => setIsTrading((s) => !s)}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              isTrading ? "bg-emerald-600" : "bg-rose-600"
            }`}
            animate={
              isTrading
                ? {
                    scale: [1, 1.03, 1],
                    boxShadow: "0 0 16px rgba(16,185,129,0.18)",
                  }
                : { scale: 1 }
            }
            transition={{ repeat: isTrading ? Infinity : 0, duration: 1.5 }}
          >
            {isTrading ? "Stop Auto-Trading" : "Start Auto-Trading"}
          </motion.button>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left main column */}
        <section className="lg:col-span-8 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Balance"
              value={formatMoney(balance)}
              hint="Current equity"
            />
            <StatCard
              label="Profit"
              value={`${profit >= 0 ? "+" : ""}${formatMoney(profit)}`}
              hint={`ROI ${roi}%`}
              accent
              isNegative={profit < 0}
            />
            <ProfileCard profile={profile} />
          </div>

          {/* Chart & controls (TradingView embed) */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
              <div>
                <div className="text-lg font-semibold text-emerald-700">
                  Market Chart
                </div>
                <div className="text-sm text-slate-500">
                  TradingView live chart — select a symbol
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {STOCKS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <div className="text-xs text-slate-500 ml-auto">Speed</div>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as any)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>

            {/* TradingView widget container */}
            <div className="w-full h-[360px] sm:h-[420px] md:h-[440px]">
              <div
                id={`tv-widget-${selectedSymbol}`}
                ref={tvRef}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Trade Controls */}
          <TradeControls
            latest={latest}
            setSeries={setSeries}
            setTrades={setTrades}
            setBalance={(v: number) => {
              setBalance(v);
              latestRef.current = v;
            }}
            setNotifications={setNotifications}
            prices={prices}
          />

          {/* Trade History */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-slate-500">Recent Trades</div>
              <div className="text-xs text-slate-400">
                {trades.length} trades
              </div>
            </div>

            <div
              ref={tradesRef}
              className="overflow-y-auto max-h-80 border border-slate-100 rounded-lg"
            >
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400 text-left sticky top-0 bg-white">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Symbol</th>
                    <th className="p-2">Side</th>
                    <th className="p-2">Shares</th>
                    <th className="p-2">P/L</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2 px-2">{t.id}</td>
                      <td className="py-2 px-2 font-medium">{t.symbol}</td>
                      <td className="py-2 px-2 font-semibold text-xs">
                        {t.side}
                      </td>
                      <td className="py-2 px-2">{t.shares}</td>
                      <td
                        className={`py-2 px-2 font-semibold ${
                          t.pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {t.pnl >= 0 ? `+${t.pnl.toFixed(2)}` : t.pnl.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-xs text-slate-500">
                        {t.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500">AI Insight</div>
            <div className="text-lg font-semibold mt-1 text-emerald-700">
              Portfolio Suggestion
            </div>
            <div className="mt-3 text-sm text-slate-700">
              {aiInsight ?? "Analyzing..."}
            </div>
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Account */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Account</div>
                <div className="font-semibold text-lg">
                  {profile?.name ?? "Investor"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  ID: {profile?.id ?? "—"}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-slate-400">Plan</div>
                <div className="text-sm font-medium text-emerald-700">
                  {profile?.plan ?? "Growth"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">
            <div className="text-sm text-slate-500">Quick Actions</div>
            <Button
              onClick={() => setIsTrading((s) => !s)}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isTrading ? "Stop Auto-Trading" : "Start Auto-Trading"}
            </Button>
            <Button
              onClick={() => router.push("/dashboard/deposit")}
              variant="outline"
              className="w-full"
            >
              Add Funds
            </Button>
            <Button
              onClick={() => router.push("/dashboard/withdraw")}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Withdraw
            </Button>
          </div>

          {/* Market Watch (mock real-time) */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500 mb-3">Market Watch</div>
            <div className="grid grid-cols-2 gap-2">
              {STOCKS.slice(0, 6).map((s) => (
                <div
                  key={s}
                  className="p-2 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-emerald-50"
                  onClick={() => setSelectedSymbol(s)}
                >
                  <div className="text-sm font-medium">{s}</div>
                  <div className="text-sm font-semibold">
                    {formatMoney(prices[s])}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Tap a symbol to view chart
            </div>
          </div>

          {/* Plans */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500 mb-3">Plans</div>
            {samplePlans.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between bg-emerald-50 border rounded-lg p-3 mt-2"
              >
                <div>
                  <div className="font-semibold text-emerald-700">{p.name}</div>
                  <div className="text-xs text-slate-600">{p.target}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{p.deposit}</div>
                  <div className="text-xs text-slate-500">{p.tag}</div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => router.push("/dashboard/plans")}
              className="w-full mt-3"
            >
              See all plans
            </Button>
          </div>

          {/* Contact / Support */}
          <div className="bg-white rounded-2xl p-4 shadow text-sm text-slate-600">
            <div className="font-medium mb-1">Need help?</div>
            <div>forexpromanage@gmail.com</div>
            <div className="text-xs text-slate-400 mt-2">
              Mon–Fri • 09:00–18:00
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* -------------------- Subcomponents -------------------- */

function StatCard({ label, value, hint, accent, isNegative }: any) {
  return (
    <div
      className={`p-4 rounded-2xl shadow-sm ${
        accent
          ? "bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
          : "bg-white border"
      }`}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div
        className={`text-xl font-bold mt-1 ${
          isNegative ? "text-rose-600" : "text-emerald-700"
        }`}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function ProfileCard({ profile }: { profile: any }) {
  return (
    <div className="p-4 rounded-2xl shadow-sm bg-white border">
      <div className="text-sm text-slate-500">Investor</div>
      <div className="flex items-center mt-2 gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
          {profile?.name ? profile.name[0]?.toUpperCase() : "I"}
        </div>
        <div>
          <div className="font-medium">{profile?.name ?? "Investor"}</div>
          <div className="text-xs text-slate-400">
            Member since{" "}
            {profile?.created_at
              ? new Date(profile.created_at).getFullYear()
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Trade Controls -------------------- */
function TradeControls({
  latest,
  setSeries,
  setTrades,
  setBalance,
  setNotifications,
  prices,
}: any) {
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [shares, setShares] = useState<number | "">("");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");

  const placeManual = () => {
    if (!symbol || !shares || Number(shares) <= 0) {
      setNotifications((n: string[]) =>
        ["Set symbol & share count first", ...n].slice(0, 6)
      );
      return;
    }
    const current = latest;
    const trade = generateManualTrade(current, {
      symbol,
      shares: Number(shares),
      side,
      prices,
    });
    const clamped = {
      ...trade,
      newBalance: Math.max(0, Math.round(trade.newBalance * 100) / 100),
    };

    setTrades((prev: any[]) => [clamped, ...prev].slice(0, MAX_TRADES_STORED));
    setSeries((prev: any[]) =>
      [
        ...prev,
        { name: `T${prev.length + 1}`, value: clamped.newBalance },
      ].slice(-DEFAULT_SERIES_LEN)
    );
    setBalance(clamped.newBalance);

    setNotifications((n: string[]) =>
      [
        `Manual: ${clamped.symbol} ${clamped.side} ${clamped.shares} ${
          clamped.pnl >= 0 ? "+" : ""
        }${clamped.pnl.toFixed(2)}`,
        ...n,
      ].slice(0, 6)
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow space-y-4">
      <div className="text-lg font-semibold text-emerald-700">
        Trade Control
      </div>
      <div className="grid sm:grid-cols-4 gap-3">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border rounded p-2"
        >
          {STOCKS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Shares"
          className="border rounded p-2"
          value={shares as any}
          onChange={(e) =>
            setShares(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as any)}
          className="border rounded p-2"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <Button
          onClick={placeManual}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Place Trade
        </Button>
      </div>
      <div className="text-xs text-slate-500">
        Tip: Manual trades are simulated locally. Replace with real execution
        API in production.
      </div>
    </div>
  );
}

/* -------------------- Helpers (mock data & trade generation) -------------------- */

function mockSeries(len = 20, base = 1000) {
  let val = base;
  return Array.from({ length: len }).map((_, i) => {
    const change =
      Math.random() < 0.7
        ? Math.random() * (base * 0.006)
        : -(Math.random() * (base * 0.003));
    val = Math.max(0, +(val + change));
    return { name: `T${i + 1}`, value: Math.round(val * 100) / 100 };
  });
}

function mockTrades(count = 6, base = 1000) {
  return Array.from({ length: count }).map(() => generateTrade(base));
}

/**
 * generateTrade (auto-simulated):
 * - uses STOCKS list and prices are approximated using current price heuristic
 * - 75% chance of small profit proportional to balance (0.3% - 2%)
 * - 25% chance of a small loss (-0.2% - -1.2%)
 */
function generateTrade(
  currentBalance: number,
  prices?: Record<string, number>
) {
  const symbol = STOCKS[Math.floor(Math.random() * STOCKS.length)];
  const side = Math.random() < 0.5 ? "BUY" : "SELL";
  const shares = +(Math.random() * 5).toFixed(2);

  const isProfit = Math.random() < 0.75;
  const changePercent = isProfit
    ? Math.random() * 0.017 + 0.003
    : -(Math.random() * 0.01 + 0.002);
  // pnl computed relative to balance
  let pnl = +(currentBalance * changePercent);
  // small adjustment using price scale if available
  const priceFactor = prices?.[symbol] ? Math.min(1, prices[symbol] / 500) : 1;
  pnl = Math.round(pnl * priceFactor * 100) / 100;

  const newBalance = Math.max(
    0,
    Math.round((currentBalance + pnl) * 100) / 100
  );

  return {
    id: `TR${Math.floor(Math.random() * 900000 + 100000).toString()}`,
    side,
    symbol,
    shares,
    pnl,
    time: new Date().toLocaleTimeString().slice(0, 5),
    newBalance,
  };
}

/**
 * generateManualTrade:
 * - uses the provided symbol, shares, side and current mock prices
 * - approximates P/L based on a tiny immediate fill slippage and random outcome
 */
function generateManualTrade(
  currentBalance: number,
  opts: {
    symbol: string;
    shares: number;
    side: "BUY" | "SELL";
    prices: Record<string, number>;
  }
) {
  const { symbol, shares, side, prices } = opts;
  const price = prices[symbol] ?? 100;
  // approximate trade value
  const tradeValue = price * shares;
  // simulate outcome: small move after entry
  const movePercent = (Math.random() - 0.4) * 0.02; // -0.8% .. +1.2% skewed slightly positive
  const pnl = Math.round(tradeValue * movePercent * 100) / 100;
  // if selling, pnl sign flips if our simulation assumes direction; keep as is for simplicity
  const newBalance = Math.max(
    0,
    Math.round((currentBalance + pnl) * 100) / 100
  );

  return {
    id: `TR${Math.floor(Math.random() * 900000 + 100000).toString()}`,
    side,
    symbol,
    shares,
    pnl,
    time: new Date().toLocaleTimeString().slice(0, 5),
    newBalance,
  };
}
