"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Copy,
  Star,
  Filter,
  Search,
  BarChart3,
  Shield,
  Zap,
  Target,
  Award,
  Activity,
  DollarSign,
  Calendar,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface Trader {
  id: string;
  name: string;
  avatar: string;
  strategy: string;
  strategyDescription: string;
  totalReturn: number;
  monthlyReturn: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number; // 1-10
  minCopyAmount: number;
  assets: string[];
  verified: boolean;
  joinedDate: string;
  maxDrawdown: number;
  avgTradeDuration: string;
  profitFactor: number;
  sharpeRatio: number;
}

const TRADERS: Trader[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "AC",
    strategy: "Scalping",
    strategyDescription:
      "High-frequency scalping on major forex pairs. Focuses on 1-5 minute timeframes with tight stop losses. Uses RSI and MACD for entry signals.",
    totalReturn: 127.5,
    monthlyReturn: 8.2,
    winRate: 68.5,
    totalTrades: 1247,
    followers: 3421,
    riskLevel: "Medium",
    riskScore: 6,
    minCopyAmount: 100,
    assets: ["EUR/USD", "GBP/USD", "USD/JPY"],
    verified: true,
    joinedDate: "2023-01-15",
    maxDrawdown: -12.3,
    avgTradeDuration: "15 min",
    profitFactor: 1.85,
    sharpeRatio: 2.1,
  },
  {
    id: "2",
    name: "Sarah Martinez",
    avatar: "SM",
    strategy: "Trend Following",
    strategyDescription:
      "Follows long-term trends using moving averages and breakout patterns. Holds positions for days to weeks. Focuses on major indices and commodities.",
    totalReturn: 89.3,
    monthlyReturn: 5.1,
    winRate: 72.3,
    totalTrades: 423,
    followers: 2890,
    riskLevel: "Low",
    riskScore: 4,
    minCopyAmount: 500,
    assets: ["SPX", "NDX", "XAUUSD", "CL"],
    verified: true,
    joinedDate: "2022-08-20",
    maxDrawdown: -8.7,
    avgTradeDuration: "5 days",
    profitFactor: 2.3,
    sharpeRatio: 1.8,
  },
  {
    id: "3",
    name: "James Wilson",
    avatar: "JW",
    strategy: "Mean Reversion",
    strategyDescription:
      "Trades price reversions from extreme levels using Bollinger Bands and Stochastic. Targets overbought/oversold conditions on 4H and daily charts.",
    totalReturn: 156.8,
    monthlyReturn: 9.5,
    winRate: 65.2,
    totalTrades: 892,
    followers: 4567,
    riskLevel: "Medium",
    riskScore: 5,
    minCopyAmount: 200,
    assets: ["EUR/USD", "GBP/USD", "AUD/USD"],
    verified: true,
    joinedDate: "2022-11-10",
    maxDrawdown: -15.2,
    avgTradeDuration: "4 hours",
    profitFactor: 1.92,
    sharpeRatio: 2.3,
  },
  {
    id: "4",
    name: "Emma Thompson",
    avatar: "ET",
    strategy: "Breakout Trading",
    strategyDescription:
      "Identifies and trades breakouts from consolidation patterns. Uses volume analysis and support/resistance levels. Focuses on stocks and ETFs.",
    totalReturn: 203.4,
    monthlyReturn: 12.8,
    winRate: 58.7,
    totalTrades: 567,
    followers: 5234,
    riskLevel: "High",
    riskScore: 8,
    minCopyAmount: 300,
    assets: ["AAPL", "TSLA", "NVDA", "SPY"],
    verified: true,
    joinedDate: "2022-05-05",
    maxDrawdown: -22.5,
    avgTradeDuration: "2 days",
    profitFactor: 1.65,
    sharpeRatio: 1.5,
  },
  {
    id: "5",
    name: "Michael Rodriguez",
    avatar: "MR",
    strategy: "Carry Trade",
    strategyDescription:
      "Exploits interest rate differentials between currency pairs. Holds positions for weeks to months. Low frequency, high conviction trades.",
    totalReturn: 67.2,
    monthlyReturn: 3.8,
    winRate: 78.9,
    totalTrades: 234,
    followers: 1890,
    riskLevel: "Low",
    riskScore: 3,
    minCopyAmount: 1000,
    assets: ["AUD/JPY", "NZD/JPY", "EUR/GBP"],
    verified: true,
    joinedDate: "2023-03-12",
    maxDrawdown: -6.4,
    avgTradeDuration: "3 weeks",
    profitFactor: 2.8,
    sharpeRatio: 2.5,
  },
  {
    id: "6",
    name: "Lisa Anderson",
    avatar: "LA",
    strategy: "News Trading",
    strategyDescription:
      "Trades around major economic announcements and news events. Uses volatility expansion strategies. Requires fast execution and risk management.",
    totalReturn: 145.6,
    monthlyReturn: 7.9,
    winRate: 61.3,
    totalTrades: 678,
    followers: 3124,
    riskLevel: "High",
    riskScore: 7,
    minCopyAmount: 250,
    assets: ["EUR/USD", "GBP/USD", "USD/CAD"],
    verified: true,
    joinedDate: "2022-09-18",
    maxDrawdown: -18.9,
    avgTradeDuration: "30 min",
    profitFactor: 1.78,
    sharpeRatio: 1.9,
  },
  {
    id: "7",
    name: "David Kim",
    avatar: "DK",
    strategy: "Grid Trading",
    strategyDescription:
      "Places buy and sell orders at regular intervals. Profits from market volatility in ranging markets. Automated execution with strict risk limits.",
    totalReturn: 98.4,
    monthlyReturn: 6.2,
    winRate: 74.1,
    totalTrades: 1456,
    followers: 2345,
    riskLevel: "Medium",
    riskScore: 5,
    minCopyAmount: 150,
    assets: ["EUR/USD", "GBP/USD", "USD/CHF"],
    verified: true,
    joinedDate: "2023-02-28",
    maxDrawdown: -11.2,
    avgTradeDuration: "2 hours",
    profitFactor: 2.1,
    sharpeRatio: 2.0,
  },
  {
    id: "8",
    name: "Rachel Green",
    avatar: "RG",
    strategy: "Momentum Trading",
    strategyDescription:
      "Follows strong price momentum using MACD and ADX indicators. Enters on pullbacks in trending markets. Focuses on crypto and tech stocks.",
    totalReturn: 178.9,
    monthlyReturn: 10.3,
    winRate: 63.8,
    totalTrades: 789,
    followers: 4123,
    riskLevel: "High",
    riskScore: 7,
    minCopyAmount: 400,
    assets: ["BTCUSD", "ETHUSD", "NVDA", "TSLA"],
    verified: true,
    joinedDate: "2022-12-01",
    maxDrawdown: -19.6,
    avgTradeDuration: "1 day",
    profitFactor: 1.88,
    sharpeRatio: 1.7,
  },
];

export default function CopyTradingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("totalReturn");
  const [copiedTraders, setCopiedTraders] = useState<Set<string>>(new Set());

  const filteredTraders = useMemo(() => {
    let filtered = TRADERS.filter((trader) => {
      const matchesSearch =
        trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trader.strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trader.assets.some((asset) =>
          asset.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesRisk =
        filterRisk === "All" || trader.riskLevel === filterRisk;

      return matchesSearch && matchesRisk;
    });

    // Sort traders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "totalReturn":
          return b.totalReturn - a.totalReturn;
        case "monthlyReturn":
          return b.monthlyReturn - a.monthlyReturn;
        case "winRate":
          return b.winRate - a.winRate;
        case "followers":
          return b.followers - a.followers;
        case "riskScore":
          return a.riskScore - b.riskScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filterRisk, sortBy]);

  const handleCopyTrader = (traderId: string) => {
    setCopiedTraders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(traderId)) {
        newSet.delete(traderId);
      } else {
        newSet.add(traderId);
      }
      return newSet;
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "High":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Copy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Copy Trading</h1>
              <p className="text-gray-400">
                Follow top traders and copy their strategies automatically
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search traders, strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            {/* Risk Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none"
              >
                <option value="totalReturn">Sort by Total Return</option>
                <option value="monthlyReturn">Sort by Monthly Return</option>
                <option value="winRate">Sort by Win Rate</option>
                <option value="followers">Sort by Followers</option>
                <option value="riskScore">Sort by Risk (Low to High)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Traders Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTraders.map((trader, index) => (
            <motion.div
              key={trader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all shadow-xl"
            >
              {/* Trader Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-lg text-slate-900">
                    {trader.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {trader.name}
                      </h3>
                      {trader.verified && (
                        <Shield className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{trader.strategy}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRiskColor(
                    trader.riskLevel
                  )}`}
                >
                  {trader.riskLevel}
                </div>
              </div>

              {/* Strategy Description */}
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {trader.strategyDescription}
              </p>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Total Return</div>
                  <div className="text-lg font-bold text-emerald-400">
                    +{trader.totalReturn.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Monthly</div>
                  <div className="text-lg font-bold text-cyan-400">
                    +{trader.monthlyReturn.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                  <div className="text-lg font-bold text-white">
                    {trader.winRate.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Trades</div>
                  <div className="text-lg font-bold text-white">
                    {trader.totalTrades.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Advanced Stats */}
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>PF: {trader.profitFactor.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span>SR: {trader.sharpeRatio.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>DD: {trader.maxDrawdown.toFixed(1)}%</span>
                </div>
              </div>

              {/* Assets */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Trading Assets</div>
                <div className="flex flex-wrap gap-2">
                  {trader.assets.slice(0, 3).map((asset) => (
                    <span
                      key={asset}
                      className="px-2 py-1 rounded bg-white/5 text-xs text-gray-300 border border-white/10"
                    >
                      {asset}
                    </span>
                  ))}
                  {trader.assets.length > 3 && (
                    <span className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400 border border-white/10">
                      +{trader.assets.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{trader.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Min: {formatMoney(trader.minCopyAmount)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleCopyTrader(trader.id)}
                  className={`${
                    copiedTraders.has(trader.id)
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  } text-white`}
                >
                  {copiedTraders.has(trader.id) ? (
                    <>
                      <Star className="h-4 w-4 mr-2 fill-current" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTraders.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400">No traders found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}


