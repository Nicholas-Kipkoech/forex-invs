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
 * World-class DashboardPage (Supabase-connected)
 * - Uses supabase.auth.getSession()
 * - Reads investor row (investors table)
 * - Updates investor.balance on each simulated trade
 *
 * Notes:
 * - Keep your existing databse schema (investors table with id, user_id, balance, name, plan)
 * - Adjust API calls to match production needs (rate limits, audit logs)
 */

const DEFAULT_SERIES_LEN = 40;
const MAX_TRADES_STORED = 50;

const samplePlans = [
  {
    name: "Starter",
    deposit: "$100",
    target: "10–12% / month",
    tag: "Low risk",
  },
  {
    name: "Growth",
    deposit: "$500",
    target: "15–18% / month",
    tag: "Balanced",
  },
  {
    name: "Premium",
    deposit: "$1,000+",
    target: "20%+ / month",
    tag: "Priority",
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

  // Trade control refs
  const tradingIntervalRef = useRef<number | null>(null);
  const latestRef = useRef<number>(0); // keep latest balance for interval callbacks

  // Derived metrics
  const latest = series[series.length - 1]?.value ?? balance;
  const first = series[0]?.value ?? latest;
  // compute profit and ROI carefully (digit-by-digit safe approach)
  const profit = useMemo(() => {
    const p = latest - first;
    // round to 2 decimal places
    return Math.round(p * 100) / 100;
  }, [latest, first]);

  const roi = useMemo(() => {
    if (!first || first === 0) return 0;
    // ROI as percentage (profit / first * 100), multiply then round
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

        const startingBalance = Number(investor?.balance ?? 0);
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
        `AI Insight: Portfolio changed ${formatted} over recent trades. Consider reviewing risk allocation.`
      );
    }, 900);
    return () => clearTimeout(timer);
  }, [series]);

  // Keep latestRef in sync
  useEffect(() => {
    latestRef.current = balance;
  }, [balance]);

  // --- Trading control (start/stop) ---
  useEffect(() => {
    // clear existing interval if any
    if (tradingIntervalRef.current) {
      window.clearInterval(tradingIntervalRef.current);
      tradingIntervalRef.current = null;
    }

    if (!isTrading) return;

    // pick interval ms based on speed
    const intervalMs = speed === "slow" ? 6000 : speed === "fast" ? 1500 : 3500;

    tradingIntervalRef.current = window.setInterval(async () => {
      // guard
      const current = latestRef.current;
      if (!profile || current <= 0) {
        // stop if no profile or depleted
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

      // generate trade and apply
      const newTrade = generateTrade(current);

      // safety: clamp newBalance and prevent negative leaps
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
        // keep series length reasonable
        return next.slice(-DEFAULT_SERIES_LEN);
      });
      setBalance(tradeWithClamp.newBalance);
      latestRef.current = tradeWithClamp.newBalance;

      // optimistic update to Supabase (fire & forget with try/catch)
      try {
        const { error } = await supabase
          .from("investors")
          .update({ balance: tradeWithClamp.newBalance })
          .eq("id", profile?.id);
        if (error) console.error("Failed to persist balance", error);
      } catch (err) {
        console.error("Supabase update error", err);
      }

      // notify occasionally
      if (Math.random() < 0.28) {
        setNotifications((n) =>
          [
            `${tradeWithClamp.pnl >= 0 ? "▲" : "▼"} ${tradeWithClamp.pair} ${
              tradeWithClamp.pnl >= 0 ? "+" : ""
            }${tradeWithClamp.pnl.toFixed(2)}`,
            ...n,
          ].slice(0, 6)
        );
      }

      // auto-stop if balance is depleted (safety)
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
  }, [isTrading, speed, profile]);

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
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-[320px]">
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
            FX
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-700">
              FXProManage
            </h1>
            <p className="text-sm text-slate-500">AI Trader Dashboard</p>
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

          {/* Trading toggle with animated pulse when active */}
          <motion.button
            onClick={() => setIsTrading((s) => !s)}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              isTrading ? "bg-emerald-600" : "bg-rose-600"
            }`}
            animate={
              isTrading
                ? {
                    scale: [1, 1.03, 1],
                    boxShadow: "0 0 16px rgba(16,185,129,0.25)",
                  }
                : { scale: 1 }
            }
            transition={{ repeat: isTrading ? Infinity : 0, duration: 1.5 }}
          >
            {isTrading ? "Stop Trading" : "Start Trading"}
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

          {/* Chart & controls */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-semibold text-emerald-700">
                  Portfolio Growth
                </div>
                <div className="text-sm text-slate-500">
                  Real-time AI bot performance
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-500">Speed</div>
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

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#059669"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(value: any) => formatMoney(Number(value))}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#059669"
                    fill="url(#eq)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                    <th className="p-2">Pair</th>
                    <th className="p-2">Side</th>
                    <th className="p-2">Size</th>
                    <th className="p-2">P/L</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2 px-2">{t.id}</td>
                      <td className="py-2 px-2">{t.pair}</td>
                      <td className="py-2 px-2 font-semibold text-xs">
                        {t.side}
                      </td>
                      <td className="py-2 px-2">{t.size}</td>
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
      <div className="text-sm text-slate-500">Trader</div>
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
}: any) {
  const [tp, setTp] = useState<number | "">("");
  const [sl, setSl] = useState<number | "">("");

  const placeManual = () => {
    if (!tp || !sl) {
      setNotifications((n: string[]) =>
        ["Set TP & SL first", ...n].slice(0, 6)
      );
      return;
    }
    // create manual trade based on latest
    const current = latest;
    const trade = generateTrade(current, {
      manual: true,
      tp: Number(tp),
      sl: Number(sl),
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
        `Manual trade: ${clamped.pair} ${
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
      <div className="grid sm:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Take Profit %"
          className="border rounded p-2"
          value={tp as any}
          onChange={(e) =>
            setTp(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          type="number"
          placeholder="Stop Loss %"
          className="border rounded p-2"
          value={sl as any}
          onChange={(e) =>
            setSl(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <Button
          onClick={placeManual}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Place Trade
        </Button>
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function mockSeries(len = 20, base = 1000) {
  let val = base;
  return Array.from({ length: len }).map((_, i) => {
    // gentle growth bias
    const change =
      Math.random() < 0.8
        ? Math.random() * (base * 0.01)
        : -(Math.random() * (base * 0.005));
    val = Math.max(0, +(val + change));
    return { name: `T${i + 1}`, value: Math.round(val * 100) / 100 };
  });
}

function mockTrades(count = 6, base = 1000) {
  return Array.from({ length: count }).map(() => generateTrade(base));
}

/**
 * generateTrade:
 * - currentBalance: number
 * - opts.manual?: boolean (if manual allow tp/sl to affect pnl - optional)
 *
 * Behavior:
 * - 80% chance small profit proportional to balance (0.5% - 5%)
 * - 20% chance small loss proportional to balance (0.3% - 3%)
 * - Ensures no huge negative jumps
 */
function generateTrade(
  currentBalance: number,
  opts?: { manual?: boolean; tp?: number; sl?: number }
) {
  const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "BTC/USD"];
  const side = Math.random() < 0.5 ? "BUY" : "SELL";
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const size = +(Math.random() * 1).toFixed(2);

  // probability of profit
  const isProfit = Math.random() < 0.8;

  // percent change relative to balance
  const changePercent = isProfit
    ? Math.random() * 0.045 + 0.005 // +0.5% .. +5.0%
    : -(Math.random() * 0.027 + 0.003); // -0.3% .. -3.0%

  // If manual & tp/sl provided, slightly bias outcome to respect them (simple simulation)
  let pnl = +(currentBalance * changePercent);
  if (opts?.manual && (opts.tp || opts.sl)) {
    // small bias towards TP/SL target if provided (not deterministic)
    const bias = (Math.random() - 0.5) * 0.002 * currentBalance;
    pnl = pnl + bias;
  }

  // Round to 2 decimals and compute new balance safely
  const pnlRounded = Math.round(pnl * 100) / 100;
  const newBalance = Math.max(
    0,
    Math.round((currentBalance + pnlRounded) * 100) / 100
  );

  return {
    id: `TR${Math.floor(Math.random() * 900000 + 100000).toString()}`,
    side,
    pair,
    size,
    pnl: pnlRounded,
    time: new Date().toLocaleTimeString().slice(0, 5),
    newBalance,
  };
}
