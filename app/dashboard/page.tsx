"use client";

import { useEffect, useState, useRef } from "react";
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
  const [profile, setProfile] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  const latest = series[series.length - 1]?.value ?? balance;
  const first = series[0]?.value ?? latest;
  const profit = +(latest - first).toFixed(2);
  const roi = first ? +((profit / first) * 100).toFixed(2) : 0;

  const tradesRef = useRef<HTMLDivElement>(null);

  // Load profile
  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return router.push("/login");

      const userId = sessionData.session.user.id;
      const { data: investor } = await supabase
        .from("investors")
        .select("*")
        .eq("user_id", userId)
        .single();

      const startingBalance = investor?.balance ?? 0;
      setProfile(investor || null);
      setBalance(startingBalance);

      if (startingBalance > 0) {
        setSeries(mockSeries(20, startingBalance));
        setTrades(mockTrades());
      }
    }
    load();
  }, [router]);

  // AI Insight
  useEffect(() => {
    const insight = `Your plan is up ${(Math.random() * 3 + 1).toFixed(
      1
    )}% this week. Consider adjusting risk targets.`;
    setTimeout(() => setAiInsight(insight), 1000);
  }, []);

  // Live bot trade simulation
  useEffect(() => {
    if (balance === 0) return;
    const interval = setInterval(() => {
      const newTrade = generateTrade(latest);
      setTrades((prev) => [newTrade, ...prev.slice(0, 49)]);
      setSeries((prev) => [
        ...prev,
        { name: `T${prev.length + 1}`, value: newTrade.newBalance },
      ]);
      setBalance(newTrade.newBalance);

      if (Math.random() < 0.2) {
        setNotifications((n) =>
          [
            `Bot trade: ${newTrade.side} ${
              newTrade.pair
            } +${newTrade.pnl.toFixed(2)}`,
            ...n,
          ].slice(0, 4)
        );
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [balance]);

  // Scroll table to top for new trades
  useEffect(() => {
    if (tradesRef.current) tradesRef.current.scrollTop = 0;
  }, [trades]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 sm:p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white px-3 py-2 rounded-lg shadow text-xs border border-emerald-100"
          >
            {n}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-bold">
            FX
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-700">
              FXProManage
            </h1>
            <p className="text-sm text-slate-600">Investor Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/dashboard/deposit")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Deposit
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <section className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Balance"
              value={`$${balance.toLocaleString()}`}
              hint="Current equity"
            />
            <StatCard
              label="Profit"
              value={`${profit >= 0 ? "+" : ""}$${profit}`}
              hint={`ROI ${roi}%`}
              accent
            />
            <StatCard
              label="Plan"
              value={profile?.plan ?? "Growth"}
              hint="Active strategy"
            />
          </div>

          {/* Profit Chart */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-lg font-semibold mb-2 text-emerald-700">
              Profit Growth
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Controls */}
          <TradeControls
            takeProfit={takeProfit}
            stopLoss={stopLoss}
            setTakeProfit={setTakeProfit}
            setStopLoss={setStopLoss}
            latest={latest}
            setSeries={setSeries}
            setTrades={setTrades}
            setBalance={setBalance}
            setNotifications={setNotifications}
            trades={trades}
          />

          {/* Trade History */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500 mb-2">Recent Trades</div>
            <div
              ref={tradesRef}
              className="overflow-y-auto max-h-80 border border-slate-100 rounded-lg"
            >
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400 text-left sticky top-0 bg-white">
                  <tr>
                    <th>ID</th>
                    <th>Pair</th>
                    <th>Side</th>
                    <th>Size</th>
                    <th>P/L</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-1">{t.id}</td>
                      <td className="py-1">{t.pair}</td>
                      <td className="py-1 font-semibold text-xs">{t.side}</td>
                      <td className="py-1">{t.size}</td>
                      <td
                        className={`py-1 font-semibold ${
                          t.pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {t.pnl >= 0 ? `+${t.pnl}` : t.pnl}
                      </td>
                      <td className="py-1 text-xs text-slate-500">{t.time}</td>
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

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500">Account</div>
            <div className="font-semibold">{profile?.name ?? "Investor"}</div>
            <div className="text-xs text-slate-400 mt-1">
              ID: {profile?.id ?? "—"}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500">Plans</div>
            {samplePlans.map((p) => (
              <div
                key={p.name}
                className="flex justify-between bg-emerald-50 border rounded-lg p-3 mt-2"
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
        </aside>
      </main>
    </div>
  );
}

/* -------------------- StatCard -------------------- */
function StatCard({ label, value, hint, accent }: any) {
  return (
    <div
      className={`p-4 rounded-2xl shadow-sm ${
        accent
          ? "bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
          : "bg-white border"
      }`}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xl font-bold text-emerald-700 mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

/* -------------------- Trade Controls -------------------- */
function TradeControls({
  takeProfit,
  stopLoss,
  setTakeProfit,
  setStopLoss,
  latest,
  setSeries,
  setTrades,
  setBalance,
  setNotifications,
  trades,
}: any) {
  const handleTrade = () => {
    if (!takeProfit || !stopLoss) {
      setNotifications((n: string[]) => ["Set TP & SL first", ...n]);
      return;
    }

    const newTrade = generateTrade(latest);
    setTrades((prev: any[]) => [newTrade, ...prev.slice(0, 49)]);
    setSeries((prev: any[]) => [
      ...prev,
      { name: `T${prev.length + 1}`, value: newTrade.newBalance },
    ]);
    setBalance(newTrade.newBalance);

    setNotifications((n: string[]) =>
      [`Trade placed TP:${takeProfit}% SL:${stopLoss}%`, ...n].slice(0, 4)
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
          value={takeProfit}
          onChange={(e) => setTakeProfit(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Stop Loss %"
          className="border rounded p-2"
          value={stopLoss}
          onChange={(e) => setStopLoss(Number(e.target.value))}
        />
        <Button
          onClick={handleTrade}
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
  return Array.from({ length: len }).map((_, i) => ({
    name: `T${i + 1}`,
    value: Math.round((base + i * 8 + (Math.random() - 0.4) * 40) * 100) / 100,
  }));
}

function mockTrades() {
  return Array.from({ length: 10 }).map((_, i) => generateTrade(1000));
}

function generateTrade(currentBalance: number) {
  const pairs = ["EUR/USD", "GBP/USD", "USD/JPY"];
  const side = Math.random() < 0.5 ? "BUY" : "SELL";
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const size = +(Math.random() * 1).toFixed(2);
  const pnl = +(Math.random() * 50 - 25).toFixed(2);
  const newBalance = +(currentBalance + pnl).toFixed(2);
  return {
    id: `TR${Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0")}`,
    side,
    pair,
    size,
    pnl,
    time: new Date().toLocaleTimeString().slice(0, 5),
    newBalance,
  };
}
