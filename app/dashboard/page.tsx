"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { supabase } from "@/lib/supabaseClient";
import { TrendingUp, CreditCard, BarChart3 } from "lucide-react";
import {
  CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_SYMBOL,
  START_BALANCE,
  MIN_WITHDRAWAL_AMOUNT,
  PRICE_UPDATE_INTERVAL,
  PRICE_JITTER_PERCENT,
  MAX_NOTIFICATIONS,
  MAX_TRADES_HISTORY,
  findTvSymbol,
  mockSeries,
} from "@/lib/constants";
import {
  formatMoney,
  roundToDecimal,
  calculatePortfolioValue,
  calculatePnL,
} from "@/lib/utils";
import type { Trade, PriceData, PortfolioData, TradeOrder, PortfolioHolding } from "@/lib/types";

/**
 * StockAI Dashboard — Multi-asset, TradingView embed, mock real-time prices, simulated orders
 *
 * Notes:
 * - TradingView widget script is used (official embed). Ensure CSP allows s3.tradingview.com if deploying.
 * - All trading is simulated locally (no real execution). Replace with broker/brokerage API for production.
 */

export default function DashboardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(START_BALANCE);
  const [portfolio, setPortfolio] = useState<PortfolioData>({});
  const [trades, setTrades] = useState<Trade[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // market state
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [prices, setPrices] = useState<PriceData>(() => {
    // seed prices for every supported symbol
    const out: PriceData = {};
    Object.values(CATEGORIES).forEach((cat) => {
      cat.list.forEach((s) => {
        out[s.id] = roundToDecimal(50 + Math.random() * 950);
      });
    });
    return out;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          setError("Authentication error. Please log in again.");
          router.push("/login");
          return;
        }

        if (!user) {
          router.push("/login");
          return;
        }

        // Get balance
        const { data: investor, error: investorError } = await supabase
          .from("investors")
          .select("balance")
          .eq("user_id", user.id)
          .single();

        if (investorError && investorError.code !== "PGRST116") {
          // PGRST116 is "not found" which is OK for new users
          console.error("Error fetching investor:", investorError);
          setError("Failed to load account data");
        } else {
          setBalance(investor?.balance ?? 0);
        }

        // Get portfolio
        const { data: holdings, error: holdingsError } = await supabase
          .from("investor_portfolio")
          .select("symbol, shares, avg_price")
          .eq("user_id", user.id);

        if (holdingsError) {
          console.error("Error fetching portfolio:", holdingsError);
          setError("Failed to load portfolio");
        } else {
          const formatted: PortfolioData = {};
          holdings?.forEach((h) => {
            formatted[h.symbol] = {
              shares: Number(h.shares),
              avgPrice: Number(h.avg_price),
            } as PortfolioHolding;
          });
          setPortfolio(formatted);
        }
      } catch (err) {
        console.error("Unexpected error fetching data:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
          const jitter = (Math.random() - 0.5) * (next[k] * PRICE_JITTER_PERCENT);
          next[k] = Math.max(0.01, roundToDecimal(next[k] + jitter));
        });
        return next;
      });

      // also nudge portfolio series to feel dynamic
      setSeries((s) => {
        const last = s[s.length - 1]?.value ?? START_BALANCE;
        const change = (Math.random() - 0.45) * (last * 0.002); // small changes
        const nextVal = Math.max(0, roundToDecimal(last + change));
        return [...s.slice(-29), { name: `T${s.length + 1}`, value: nextVal }];
      });
    }, PRICE_UPDATE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // handle tradingview embed lifecycle (lazy load and recreate on symbol change)
  useEffect(() => {
    const containerId = tvContainerIdRef.current;
    let scriptElement: HTMLScriptElement | null = null;
    let widgetInstance: any = null;

    const loadWidget = () => {
      // Clear previous widget
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = "";
      }

      // Check if TradingView is already loaded
      if ((window as any).TradingView) {
        createWidget();
      } else {
        // Load script only if not already present
        const existingScript = document.querySelector(
          'script[src="https://s3.tradingview.com/tv.js"]'
        );
        if (existingScript) {
          // Script already exists, wait for it to load
          const checkInterval = setInterval(() => {
            if ((window as any).TradingView) {
              clearInterval(checkInterval);
              createWidget();
            }
          }, 100);
          return () => clearInterval(checkInterval);
        } else {
          // Create and load script
          scriptElement = document.createElement("script");
          scriptElement.src = "https://s3.tradingview.com/tv.js";
          scriptElement.async = true;
          scriptElement.onload = createWidget;
          scriptElement.onerror = () => {
            console.error("Failed to load TradingView script");
            setError("Failed to load trading chart");
          };
          document.body.appendChild(scriptElement);
        }
      }
    };

    const createWidget = () => {
      try {
        const container = document.getElementById(containerId);
        if (!container) {
          const wrapper = document.getElementById("tv-wrapper");
          if (wrapper) {
            const div = document.createElement("div");
            div.id = containerId;
            div.style.width = "100%";
            div.style.height = "100%";
            wrapper.appendChild(div);
          } else {
            return;
          }
        }

        const tvSymbol = findTvSymbol(symbol);
        const TradingView = (window as any).TradingView;
        if (!TradingView) {
          console.error("TradingView not available");
          return;
        }

        widgetInstance = new TradingView.widget({
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
          hide_side_toolbar: false,
        });
      } catch (err) {
        console.error("TradingView widget error:", err);
        setError("Failed to initialize trading chart");
      }
    };

    loadWidget();
    setTvWidgetKey((k) => k + 1);

    return () => {
      // Cleanup widget instance
      if (widgetInstance && typeof widgetInstance.remove === "function") {
        try {
          widgetInstance.remove();
        } catch (err) {
          console.error("Error removing widget:", err);
        }
      }

      // Clear container
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = "";
      }

      // Note: We don't remove the script tag as it might be reused
      // and removing it could break other widgets on the page
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // helpers
  const tvListForCategory = CATEGORIES[category]?.list ?? [];
  const tvSymbol = findTvSymbol(symbol);

  // portfolio metrics
  const portfolioValue = useMemo(() => {
    return calculatePortfolioValue(portfolio, prices);
  }, [portfolio, prices]);

  const totalEquity = useMemo(
    () => roundToDecimal(balance + portfolioValue),
    [balance, portfolioValue]
  );

  const saveBalance = useCallback(async (newBalance: number) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Auth error saving balance:", authError);
        return;
      }

      const { error } = await supabase
        .from("investors")
        .update({ balance: newBalance })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error saving balance:", error);
        setNotifications((n) => ["Failed to save balance", ...n].slice(0, MAX_NOTIFICATIONS));
      }
    } catch (err) {
      console.error("Unexpected error saving balance:", err);
    }
  }, []);

  const saveHolding = useCallback(async (
    symbol: string,
    shares: number,
    avgPrice: number
  ) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Auth error saving holding:", authError);
        return;
      }

      const { error } = await supabase.from("investor_portfolio").upsert(
        {
          user_id: user.id,
          symbol,
          shares,
          avg_price: avgPrice,
        },
        { onConflict: "user_id,symbol" }
      );

      if (error) {
        console.error("Error saving holding:", error);
      }
    } catch (err) {
      console.error("Unexpected error saving holding:", err);
    }
  }, []);

  const removeHolding = useCallback(async (symbol: string) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Auth error removing holding:", authError);
        return;
      }

      const { error } = await supabase
        .from("investor_portfolio")
        .delete()
        .match({ user_id: user.id, symbol });

      if (error) {
        console.error("Error removing holding:", error);
      }
    } catch (err) {
      console.error("Unexpected error removing holding:", err);
    }
  }, []);

  // Simulated trade placement (BUY/SELL)
  const placeOrder = useCallback((opts: TradeOrder) => {
    const price = prices[opts.symbol] ?? 0;
    if (price === 0) {
      setNotifications((n) => ["Invalid symbol or price", ...n].slice(0, MAX_NOTIFICATIONS));
      return;
    }

    if (opts.shares <= 0 || !Number.isInteger(opts.shares)) {
      setNotifications((n) => ["Shares must be a positive integer", ...n].slice(0, MAX_NOTIFICATIONS));
      return;
    }

    const cost = roundToDecimal(price * opts.shares);

    if (opts.side === "BUY") {
      if (cost > balance) {
        setNotifications((n) =>
          [`Insufficient funds: need ${formatMoney(cost)}`, ...n].slice(0, MAX_NOTIFICATIONS)
        );
        return;
      }

      // Update state
      const newBalance = roundToDecimal(balance - cost);
      setBalance(newBalance);

      setPortfolio((p) => {
        const prev = p[opts.symbol];
        let shares = opts.shares;
        let avgPrice = price;

        if (prev) {
          shares = prev.shares + opts.shares;
          avgPrice = roundToDecimal(
            (prev.avgPrice * prev.shares + price * opts.shares) / shares
          );
        }

        // Persist to DB
        saveBalance(newBalance);
        saveHolding(opts.symbol, shares, avgPrice);

        return {
          ...p,
          [opts.symbol]: { shares, avgPrice } as PortfolioHolding,
        };
      });
    } else {
      // SELL
      setPortfolio((p) => {
        const prev = p[opts.symbol];
        if (!prev || prev.shares < opts.shares) {
          setNotifications((n) =>
            ["Not enough shares to sell", ...n].slice(0, MAX_NOTIFICATIONS)
          );
          return p;
        }

        const remaining = prev.shares - opts.shares;
        const newBalance = roundToDecimal(balance + cost);
        setBalance(newBalance);

        if (remaining === 0) {
          removeHolding(opts.symbol);
          saveBalance(newBalance);
          const { [opts.symbol]: _, ...rest } = p;
          return rest;
        }

        saveBalance(newBalance);
        saveHolding(opts.symbol, remaining, prev.avgPrice);

        return {
          ...p,
          [opts.symbol]: { shares: remaining, avgPrice: prev.avgPrice },
        };
      });
    }

    // push trade record
    const trade: Trade = {
      id: `T${Math.floor(Math.random() * 900000 + 100000)}`,
      symbol: opts.symbol,
      side: opts.side,
      shares: opts.shares,
      price,
      cost,
      time: new Date().toLocaleTimeString(),
    };
    setTrades((t) => [trade, ...t].slice(0, MAX_TRADES_HISTORY));
    setNotifications((n) =>
      [
        `${opts.side} ${opts.shares} ${opts.symbol} @ ${formatMoney(
          price
        )} — ${formatMoney(trade.cost)}`,
        ...n,
      ].slice(0, MAX_NOTIFICATIONS)
    );
  }, [balance, prices, saveBalance, saveHolding, removeHolding]);

  // mini helper to update symbol when category changes
  useEffect(() => {
    const first = CATEGORIES[category]?.list[0]?.id;
    if (first) setSymbol(first);
  }, [category]);

  // Calculate performance metrics (must be before conditional returns)
  const totalPnL = useMemo(() => {
    return Object.entries(portfolio).reduce((acc, [id, pos]) => {
      const current = prices[id] ?? 0;
      const pnl = calculatePnL(pos.shares, pos.avgPrice, current);
      return acc + pnl;
    }, 0);
  }, [portfolio, prices]);

  const performancePercent = useMemo(() => {
    if (totalEquity === 0) return 0;
    const invested = Object.entries(portfolio).reduce(
      (acc, [_, pos]) => acc + pos.shares * pos.avgPrice,
      0
    );
    if (invested === 0) return 0;
    return roundToDecimal((totalPnL / invested) * 100, 2);
  }, [portfolio, totalPnL, totalEquity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-rose-400 text-lg mb-2">⚠️ Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* notifications */}
      <div className="fixed top-4 right-4 z-50 w-[320px] max-w-[90vw] flex flex-col gap-2">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-xl text-sm shadow-lg"
          >
            {n}
          </motion.div>
        ))}
      </div>

      {/* header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/25">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Investment Portfolio
              </h1>
              <div className="text-xs text-gray-400">
                Professional trading & investment platform
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                router.push("/dashboard/deposit");
              }}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button
              variant="outline"
              disabled={totalEquity < MIN_WITHDRAWAL_AMOUNT}
              onClick={() => {
                if (totalEquity < MIN_WITHDRAWAL_AMOUNT) {
                  setNotifications((n) => [
                    `Minimum withdrawal is ${formatMoney(MIN_WITHDRAWAL_AMOUNT)}`,
                    ...n,
                  ].slice(0, MAX_NOTIFICATIONS));
                } else {
                  router.push("/dashboard/withdraw");
                }
              }}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total Equity</div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatMoney(totalEquity)}
            </div>
            <div className="text-xs text-gray-500">
              Cash + Holdings value
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total P&L</div>
              <div className={`h-5 w-5 rounded-full ${totalPnL >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                <div className={`h-2 w-2 rounded-full mx-auto mt-1.5 ${totalPnL >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatMoney(totalPnL)}
            </div>
            <div className="text-xs text-gray-500">
              {performancePercent >= 0 ? '+' : ''}{performancePercent}% return
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Available Cash</div>
              <CreditCard className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatMoney(balance)}
            </div>
            <div className="text-xs text-gray-500">
              Ready to invest
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Holdings Value</div>
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatMoney(portfolioValue)}
            </div>
            <div className="text-xs text-gray-500">
              {Object.keys(portfolio).length} positions
            </div>
          </motion.div>
        </div>

      {/* main grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* left column */}
        <section className="lg:col-span-8 space-y-6">
          {/* portfolio performance chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
                <p className="text-xs text-gray-400">30-day performance overview</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setNotifications((n) =>
                      ["Exported performance (mock)", ...n].slice(0, MAX_NOTIFICATIONS)
                    )
                  }
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                >
                  Export
                </Button>
              </div>
            </div>

            {/* area chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.75rem",
                    }}
                    formatter={(v: any) => formatMoney(v)}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    fill="url(#g1)"
                    strokeWidth={3}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* market selector + tradingview container */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-sm font-medium text-gray-300">Market</div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  {Object.keys(CATEGORIES).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORIES[c].label}
                    </option>
                  ))}
                </select>

                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  {tvListForCategory.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-gray-400">Live Price</div>
                <div className="text-xl font-bold text-emerald-400">
                  {formatMoney(prices[symbol])}
                </div>
              </div>
            </div>

            {/* TradingView container */}
            <div
              id="tv-wrapper"
              className="w-full h-[450px] rounded-xl overflow-hidden border border-white/10 bg-slate-900/50"
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
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
                <p className="text-xs text-gray-400">Your trading activity</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                {trades.length} orders
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 text-left border-b border-white/10">
                  <tr>
                    <th className="py-3 px-3 font-medium">ID</th>
                    <th className="py-3 px-3 font-medium">Symbol</th>
                    <th className="py-3 px-3 font-medium">Side</th>
                    <th className="py-3 px-3 font-medium">Shares</th>
                    <th className="py-3 px-3 font-medium">Price</th>
                    <th className="py-3 px-3 font-medium">Total</th>
                    <th className="py-3 px-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-gray-300 font-mono text-xs">{t.id}</td>
                      <td className="py-3 px-3 font-medium">{t.symbol}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            t.side === "BUY"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {t.side}
                        </span>
                      </td>
                      <td className="py-3 px-3">{t.shares}</td>
                      <td className="py-3 px-3">{formatMoney(t.price)}</td>
                      <td className="py-3 px-3 font-medium">{formatMoney(t.cost)}</td>
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {t.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {trades.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No trades yet</p>
                  <p className="text-xs text-gray-600 mt-1">Start trading to see your activity here</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* right sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* holdings */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
                <p className="text-xs text-gray-400">{Object.keys(portfolio).length} positions</p>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(portfolio).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No holdings yet</p>
                  <p className="text-xs text-gray-600 mt-1">Start investing to build your portfolio</p>
                </div>
              )}
              {Object.entries(portfolio).map(([id, pos]) => {
                const current = prices[id] ?? 0;
                const value = roundToDecimal(pos.shares * current);
                const pnl = calculatePnL(pos.shares, pos.avgPrice, current);
                const pnlPercent = pos.avgPrice > 0 
                  ? roundToDecimal((pnl / (pos.shares * pos.avgPrice)) * 100, 2)
                  : 0;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-base font-bold text-white">{id}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {pos.shares} shares @ {formatMoney(pos.avgPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{formatMoney(value)}</div>
                        <div
                          className={`text-xs font-medium mt-1 ${
                            pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {pnl >= 0 ? "+" : ""}{formatMoney(pnl)} ({pnlPercent >= 0 ? "+" : ""}{pnlPercent}%)
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/dashboard/deposit")}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white justify-start"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Deposit Funds
              </Button>
              <Button
                onClick={() => router.push("/dashboard/withdraw")}
                variant="outline"
                className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white justify-start"
                disabled={totalEquity < MIN_WITHDRAWAL_AMOUNT}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>

          {/* supported markets */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Available Markets</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                "Stocks",
                "ETFs",
                "Bonds",
                "Funds",
                "Commodities",
                "Indices",
                "Crypto",
                "Shariah",
              ].map((m) => (
                <div
                  key={m}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 text-gray-300 text-center hover:bg-white/10 transition-colors"
                >
                  {m}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-4 text-center">
              Access thousands of global instruments
            </div>
          </div>
        </aside>
      </main>
      </div>
    </div>
  );
}

/* -------------------- TradePanel -------------------- */

interface TradePanelProps {
  prices: PriceData;
  placeOrder: (order: TradeOrder) => void;
}

function TradePanel({ prices, placeOrder }: TradePanelProps) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [shares, setShares] = useState<number | "">("");

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
            if (!symbol || !shares || Number(shares) <= 0) {
              return;
            }
            const sharesNum = Number(shares);
            if (!Number.isInteger(sharesNum) || sharesNum <= 0) {
              return;
            }
            placeOrder({ side, symbol, shares: sharesNum });
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

