"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  TrendingUp,
  CreditCard,
  BarChart3,
  RotateCcw,
  Wallet2Icon,
} from "lucide-react";
import {
  CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_SYMBOL,
  START_BALANCE,
  ADD_FUNDS_AMOUNT,
  PRICE_UPDATE_INTERVAL,
  MAX_NOTIFICATIONS,
  MAX_TRADES_HISTORY,
  findTvSymbol,
  generateNextPrice,
} from "@/lib/constants";
import { CategoryDropdown, SymbolDropdown } from "@/components/MarketDropdowns";
import {
  formatMoney,
  roundToDecimal,
  calculatePortfolioValue,
  calculatePnL,
} from "@/lib/utils";
import type { Trade, PriceData, PortfolioData, TradeOrder } from "@/lib/types";
import Link from "next/link";

/**
 * StockAI Dashboard — Paper trading simulator
 *
 * IMPORTANT: This is a simulated trading experience. No real money, real
 * brokerage, or real order execution is involved anywhere in this file.
 * "Balance" is virtual, "Deposit"/"Withdraw" only affect the virtual
 * balance in Supabase, and prices are a simulated random walk seeded from
 * a starting value — NOT a live feed, even though the TradingView chart
 * shown alongside it is real market data. Keep that distinction visible
 * to users (see the banner in the header) so nobody mistakes this for a
 * real account.
 *
 * - TradingView widget script is the official embed. Ensure CSP allows
 *   s3.tradingview.com if deploying.
 */

export default function DashboardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(START_BALANCE);
  const [portfolio, setPortfolio] = useState<PortfolioData>({});
  const [trades, setTrades] = useState<Trade[]>([]);
  const [notifications, setNotifications] = useState<
    { id: number; text: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifIdRef = useRef(0);

  const pushNotification = useCallback((text: string) => {
    const id = notifIdRef.current++;
    setNotifications((n) => [{ id, text }, ...n].slice(0, MAX_NOTIFICATIONS));
    // auto-dismiss so the stack doesn't grow forever
    window.setTimeout(() => {
      setNotifications((n) => n.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  // market state — single source of truth, shared by chart + trade panel
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);

  const basePricesRef = useRef<PriceData>({});
  const [prices, setPrices] = useState<PriceData>(() => {
    const out: PriceData = {};
    const base: PriceData = {};

    Object.values(CATEGORIES).forEach((cat) => {
      cat.list.forEach((s) => {
        const initial = roundToDecimal(50 + Math.random() * 950);
        out[s.id] = initial;
        base[s.id] = initial;
      });
    });

    basePricesRef.current = base;
    return out;
  });

  // ---------------- load account (paper balance + paper holdings) ----------------
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

        const { data: investor, error: investorError } = await supabase
          .from("investors")
          .select("balance")
          .eq("user_id", user.id)
          .single();

        if (investorError && investorError.code !== "PGRST116") {
          console.error("Error fetching investor:", investorError);
          setError("Failed to load account data");
        } else {
          setBalance(investor?.balance ?? START_BALANCE);
        }

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
            };
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

  // ---------------- simulated price random walk (symmetric, no upward bias) ----------------
  useEffect(() => {
    const id = window.setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((sym) => {
          const base = basePricesRef.current[sym];
          next[sym] = generateNextPrice(next[sym], base);
        });
        return next;
      });
    }, PRICE_UPDATE_INTERVAL);

    return () => clearInterval(id);
  }, []);

  // ---------------- TradingView widget lifecycle ----------------
  const tvContainerIdRef = useRef(
    `tv-widget-${Math.random().toString(36).slice(2, 9)}`,
  );
  const tvWidgetRef = useRef<any>(null);
  const tvScriptLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function createWidget() {
      if (cancelled) return;
      const TradingView = (window as any).TradingView;
      const container = document.getElementById(tvContainerIdRef.current);
      if (!TradingView || !container) return;

      container.innerHTML = "";
      try {
        tvWidgetRef.current = new TradingView.widget({
          container_id: tvContainerIdRef.current,
          autosize: true,
          symbol: findTvSymbol(symbol),
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1b2430",
          enable_publishing: false,
          allow_symbol_change: false, // keep chart in sync with app-level symbol
          hide_side_toolbar: false,
        });
      } catch (err) {
        console.error("TradingView widget error:", err);
        setError("Failed to initialize trading chart");
      }
    }

    if ((window as any).TradingView) {
      createWidget();
    } else if (!tvScriptLoadedRef.current) {
      tvScriptLoadedRef.current = true;
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      script.onerror = () => {
        console.error("Failed to load TradingView script");
        setError("Failed to load trading chart");
      };
      document.body.appendChild(script);
    } else {
      // script tag exists but window.TradingView isn't ready yet
      const check = window.setInterval(() => {
        if ((window as any).TradingView) {
          clearInterval(check);
          createWidget();
        }
      }, 100);
      return () => clearInterval(check);
    }

    return () => {
      cancelled = true;
      const container = document.getElementById(tvContainerIdRef.current);
      if (container) container.innerHTML = "";
      tvWidgetRef.current = null;
    };
  }, [symbol]);

  // ---------------- persistence helpers (paper balance / paper holdings only) ----------------
  const saveBalance = useCallback(
    async (newBalance: number) => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) return;

        const { error } = await supabase
          .from("investors")
          .update({ balance: newBalance })
          .eq("user_id", user.id);

        if (error) {
          console.error("Error saving balance:", error);
          pushNotification("Couldn't save your balance — try again");
        }
      } catch (err) {
        console.error("Unexpected error saving balance:", err);
      }
    },
    [pushNotification],
  );

  const saveHolding = useCallback(
    async (sym: string, shares: number, avgPrice: number) => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) return;

        const { error } = await supabase
          .from("investor_portfolio")
          .upsert(
            { user_id: user.id, symbol: sym, shares, avg_price: avgPrice },
            { onConflict: "user_id,symbol" },
          );
        if (error) console.error("Error saving holding:", error);
      } catch (err) {
        console.error("Unexpected error saving holding:", err);
      }
    },
    [],
  );

  const removeHolding = useCallback(async (sym: string) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { error } = await supabase
        .from("investor_portfolio")
        .delete()
        .match({ user_id: user.id, symbol: sym });
      if (error) console.error("Error removing holding:", error);
    } catch (err) {
      console.error("Unexpected error removing holding:", err);
    }
  }, []);

  // ---------------- simulated order placement ----------------
  const placeOrder = useCallback(
    (opts: TradeOrder) => {
      const price = prices[opts.symbol] ?? 0;

      if (price === 0) {
        pushNotification("Invalid symbol or price");
        return;
      }

      if (opts.shares <= 0 || !Number.isInteger(opts.shares)) {
        pushNotification("Shares must be a positive whole number");
        return;
      }

      // Require at least $500 available before any trade
      if (balance < 500) {
        pushNotification(
          "A minimum available balance of $500 is required before placing trades.",
        );
        return;
      }

      const cost = roundToDecimal(price * opts.shares);

      if (opts.side === "BUY") {
        setBalance((prevBalance) => {
          if (prevBalance < cost) {
            pushNotification(
              `Insufficient funds. Need ${formatMoney(cost)}, available ${formatMoney(prevBalance)}`,
            );
            return prevBalance;
          }

          const newBalance = roundToDecimal(prevBalance - cost);

          setPortfolio((prevPortfolio) => {
            const prev = prevPortfolio[opts.symbol];

            let shares = opts.shares;
            let avgPrice = price;

            if (prev) {
              shares = prev.shares + opts.shares;
              avgPrice = roundToDecimal(
                (prev.avgPrice * prev.shares + price * opts.shares) / shares,
              );
            }

            saveHolding(opts.symbol, shares, avgPrice);

            return {
              ...prevPortfolio,
              [opts.symbol]: {
                shares,
                avgPrice,
              },
            };
          });

          saveBalance(newBalance);

          pushNotification(
            `Bought ${opts.shares} ${opts.symbol} @ ${formatMoney(price)} — ${formatMoney(cost)}`,
          );

          return newBalance;
        });
      } else {
        setPortfolio((prevPortfolio) => {
          const prev = prevPortfolio[opts.symbol];

          if (!prev || prev.shares < opts.shares) {
            pushNotification("Not enough shares to sell");
            return prevPortfolio;
          }

          setBalance((prevBalance) => {
            const newBalance = roundToDecimal(prevBalance + cost);
            saveBalance(newBalance);
            return newBalance;
          });

          const remaining = prev.shares - opts.shares;

          pushNotification(
            `Sold ${opts.shares} ${opts.symbol} @ ${formatMoney(price)} — ${formatMoney(cost)}`,
          );

          if (remaining === 0) {
            removeHolding(opts.symbol);
            const { [opts.symbol]: _, ...rest } = prevPortfolio;
            return rest;
          }

          saveHolding(opts.symbol, remaining, prev.avgPrice);

          return {
            ...prevPortfolio,
            [opts.symbol]: {
              shares: remaining,
              avgPrice: prev.avgPrice,
            },
          };
        });
      }

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
    },
    [
      balance,
      prices,
      saveBalance,
      saveHolding,
      removeHolding,
      pushNotification,
    ],
  );

  // ---------------- virtual funds controls (paper money only — no payment processor) ----------------
  const addVirtualFunds = useCallback(() => {
    setBalance((prev) => {
      const next = roundToDecimal(prev + ADD_FUNDS_AMOUNT);
      saveBalance(next);
      return next;
    });
    pushNotification(`Added ${formatMoney(ADD_FUNDS_AMOUNT)} in virtual funds`);
  }, [saveBalance, pushNotification]);

  const resetPaperAccount = useCallback(async () => {
    const confirmed = window.confirm(
      "Reset your paper account? This clears your virtual balance, holdings, and trade history back to the starting amount.",
    );
    if (!confirmed) return;

    setBalance(START_BALANCE);
    setPortfolio({});
    setTrades([]);
    saveBalance(START_BALANCE);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("investor_portfolio")
          .delete()
          .match({ user_id: user.id });
      }
    } catch (err) {
      console.error("Error clearing holdings on reset:", err);
    }

    pushNotification("Paper account reset");
  }, [saveBalance, pushNotification]);

  // keep symbol valid when category changes
  useEffect(() => {
    const first = CATEGORIES[category]?.list[0]?.id;
    if (first) setSymbol(first);
  }, [category]);

  const portfolioValue = useMemo(
    () => calculatePortfolioValue(portfolio, prices),
    [portfolio, prices],
  );
  const totalEquity = useMemo(
    () => roundToDecimal(balance + portfolioValue),
    [balance, portfolioValue],
  );
  const totalPnL = useMemo(() => {
    return Object.entries(portfolio).reduce((acc, [id, pos]) => {
      const current = prices[id] ?? 0;
      return acc + calculatePnL(pos.shares, pos.avgPrice, current);
    }, 0);
  }, [portfolio, prices]);
  const performancePercent = useMemo(() => {
    const invested = Object.values(portfolio).reduce(
      (acc, pos) => acc + pos.shares * pos.avgPrice,
      0,
    );
    if (invested === 0) return 0;
    return roundToDecimal((totalPnL / invested) * 100, 2);
  }, [portfolio, totalPnL]);

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
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-xl text-sm shadow-lg"
            >
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
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
                My Portfolio
              </h1>
              <div className="text-xs text-gray-400">
                Trade with confidence - this is a live account.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/deposit"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium
               bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
               shadow-lg shadow-emerald-500/25
               hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40
               active:scale-[0.98] transition-all duration-150
               focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Deposit
            </Link>

            <Link
              href="/dashboard/withdraw"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium
               border border-white/20 bg-white/5 text-white backdrop-blur-sm
               hover:bg-white/10 hover:border-white/30
               active:scale-[0.98] transition-all duration-150
               focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <Wallet2Icon className="h-4 w-4 mr-2" />
              Withdraw
            </Link>
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
            <div className="text-xs text-gray-500">Cash + holdings value</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total P&L</div>
              <div
                className={`h-5 w-5 rounded-full ${totalPnL >= 0 ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
              >
                <div
                  className={`h-2 w-2 rounded-full mx-auto mt-1.5 ${totalPnL >= 0 ? "bg-emerald-400" : "bg-rose-400"}`}
                ></div>
              </div>
            </div>
            <div
              className={`text-3xl font-bold mb-1 ${totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}
            >
              {totalPnL >= 0 ? "+" : ""}
              {formatMoney(totalPnL)}
            </div>
            <div className="text-xs text-gray-500">
              {performancePercent >= 0 ? "+" : ""}
              {performancePercent}% return
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Cash</div>
              <CreditCard className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatMoney(balance)}
            </div>
            <div className="text-xs text-gray-500">Ready to invest</div>
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
            {/* market selector + tradingview container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-sm font-medium text-gray-300">
                    Market
                  </div>
                  <CategoryDropdown value={category} onChange={setCategory} />
                  <SymbolDropdown
                    category={category}
                    value={symbol}
                    onChange={setSymbol}
                    prices={prices}
                    basePrices={basePricesRef.current}
                  />
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-gray-400">Market Price</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {formatMoney(prices[symbol])}
                  </div>
                </div>
              </div>

              <div className="w-full h-[450px] rounded-xl overflow-hidden border border-white/10 bg-slate-900/50">
                <div
                  id={tvContainerIdRef.current}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="text-[11px] text-gray-500 mt-2">
                Chart reflects real market data from TradingView. Your balance,
                holdings, and order prices.
              </div>
            </div>

            {/* Trade controls */}
            <TradePanel
              symbol={symbol}
              price={prices[symbol]}
              placeOrder={placeOrder}
            />

            {/* recent trades table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Recent Trades
                  </h2>
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
                      <tr
                        key={t.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-3 text-gray-300 font-mono text-xs">
                          {t.id}
                        </td>
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
                        <td className="py-3 px-3 font-medium">
                          {formatMoney(t.cost)}
                        </td>
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
                    <p className="text-xs text-gray-600 mt-1">
                      Start trading to see your activity here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* right sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Your Holdings
                  </h2>
                  <p className="text-xs text-gray-400">
                    {Object.keys(portfolio).length} positions
                  </p>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(portfolio).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No holdings yet</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Start investing to build your portfolio
                    </p>
                  </div>
                )}
                {Object.entries(portfolio).map(([id, pos]) => {
                  const current = prices[id] ?? 0;
                  const value = roundToDecimal(pos.shares * current);
                  const pnl = calculatePnL(pos.shares, pos.avgPrice, current);
                  const pnlPercent =
                    pos.avgPrice > 0
                      ? roundToDecimal(
                          (pnl / (pos.shares * pos.avgPrice)) * 100,
                          2,
                        )
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
                          <div className="text-base font-bold text-white">
                            {id}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {pos.shares} shares @ {formatMoney(pos.avgPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            {formatMoney(value)}
                          </div>
                          <div
                            className={`text-xs font-medium mt-1 ${
                              pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {pnl >= 0 ? "+" : ""}
                            {formatMoney(pnl)} ({pnlPercent >= 0 ? "+" : ""}
                            {pnlPercent}%)
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Available Markets
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.values(CATEGORIES).map((cat) => (
                  <div
                    key={cat.label}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 text-gray-300 text-center hover:bg-white/10 transition-colors"
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-4 text-center">
                Practice across thousands of simulated instruments
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
  symbol: string;
  price: number;
  balance?: number;
  placeOrder: (order: TradeOrder) => void;
}

function TradePanel({ symbol, price, placeOrder }: TradePanelProps) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [shares, setShares] = useState<number | "">("");

  return (
    <div className="bg-[#081018] rounded-2xl p-4 shadow border border-gray-800">
      <div className="text-sm text-gray-300 mb-3">
        Quick Trade — <span className="font-semibold text-white">{symbol}</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          type="number"
          min={1}
          step={1}
          placeholder="Shares"
          value={shares as any}
          onChange={(e) =>
            setShares(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}
          className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <Button
          onClick={() => {
            const sharesNum = Number(shares);
            if (!shares || !Number.isInteger(sharesNum) || sharesNum <= 0)
              return;
            placeOrder({ side, symbol, shares: sharesNum });
            setShares("");
          }}
          className="bg-emerald-500"
        >
          Place Order
        </Button>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Market price: {formatMoney(price)} · trading {symbol} — change symbol
        above to trade something else
      </div>
    </div>
  );
}
