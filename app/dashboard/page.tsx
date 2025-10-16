// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
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

  // 🔹 Load Supabase profile
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

      // Only populate mock data if balance > 0
      if (startingBalance > 0) {
        setSeries(mockSeries(20, startingBalance));
        setTrades(mockTrades());
      }
    }
    load();
  }, [router]);

  // 🔹 Mock AI insight
  useEffect(() => {
    const insight = `Your plan is up ${(Math.random() * 3 + 1).toFixed(
      1
    )}% this week. Consider adjusting risk targets.`;
    setTimeout(() => setAiInsight(insight), 1000);
  }, []);

  // 🔹 Auto-update series (mock live feed)
  useEffect(() => {
    if (balance === 0) return; // no live feed if no deposit
    const interval = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.45) * 18;
        const next = Math.max(10, +(last.value + change).toFixed(2));
        if (Math.random() < 0.1) {
          setNotifications((n) =>
            [`Tick ${change >= 0 ? "+" : ""}${change.toFixed(2)}`, ...n].slice(
              0,
              4
            )
          );
        }
        return [
          ...prev.slice(-39),
          { name: `T${prev.length + 1}`, value: next },
        ];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [balance]);

  // 🔹 Notifications auto-remove
  useEffect(() => {
    if (notifications.length === 0) return;
    const id = setTimeout(
      () => setNotifications((n) => n.slice(0, n.length - 1)),
      4200
    );
    return () => clearTimeout(id);
  }, [notifications]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleTrade() {
    if (!takeProfit || !stopLoss) {
      setNotifications((n) => ["Set TP & SL first", ...n]);
      return;
    }

    // Update trade history and series
    const newTrade = {
      id: `TR${trades.length + 1}`.padStart(5, "0"),
      side: Math.random() < 0.5 ? "BUY" : "SELL",
      pair: ["EUR/USD", "GBP/USD", "USD/JPY"][Math.floor(Math.random() * 3)],
      size: +(Math.random() * 1).toFixed(2),
      pnl: +(Math.random() * 50 - 25).toFixed(2),
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    setTrades((prev) => [newTrade, ...prev.slice(0, 19)]);

    // Update series to reflect new equity
    setSeries((prev) => [
      ...prev,
      {
        name: `T${prev.length + 1}`,
        value: +(latest + newTrade.pnl).toFixed(2),
      },
    ]);

    setBalance((b) => +(b + newTrade.pnl).toFixed(2));
    setNotifications((n) =>
      [`Trade placed TP:${takeProfit}% SL:${stopLoss}%`, ...n].slice(0, 4)
    );
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

          {/* Trade History */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-slate-500">Recent Trades</div>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400 text-left">
                  <tr>
                    <th>ID</th>
                    <th>Pair</th>
                    <th>Size</th>
                    <th>P/L</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2">{t.id}</td>
                      <td className="py-2">{t.pair}</td>
                      <td className="py-2">{t.size}</td>
                      <td
                        className={`py-2 font-semibold ${
                          t.pnl >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {t.pnl >= 0 ? `+${t.pnl}` : t.pnl}
                      </td>
                      <td className="py-2 text-xs text-slate-500">{t.time}</td>
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

/* StatCard */
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

/* Helpers */
function mockSeries(len = 20, base = 1000) {
  return Array.from({ length: len }).map((_, i) => ({
    name: `T${i + 1}`,
    value: Math.round((base + i * 8 + (Math.random() - 0.4) * 40) * 100) / 100,
  }));
}

function mockTrades() {
  return [
    {
      id: "TR001",
      side: "BUY",
      pair: "EUR/USD",
      size: 0.5,
      pnl: 26.4,
      time: "10:22",
    },
    {
      id: "TR002",
      side: "SELL",
      pair: "GBP/USD",
      size: 0.2,
      pnl: -18.2,
      time: "09:58",
    },
    {
      id: "TR003",
      side: "BUY",
      pair: "USD/JPY",
      size: 1.0,
      pnl: 12.3,
      time: "08:41",
    },
  ];
}
