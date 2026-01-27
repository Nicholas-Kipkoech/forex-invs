"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Search,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "trade" | "copy_trade";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  symbol?: string;
  side?: "BUY" | "SELL";
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN001",
    type: "deposit",
    amount: 5000,
    status: "completed",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Bitcoin deposit",
  },
  {
    id: "TXN002",
    type: "trade",
    amount: -1250,
    status: "completed",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Stock purchase",
    symbol: "AAPL",
    side: "BUY",
  },
  {
    id: "TXN003",
    type: "copy_trade",
    amount: -500,
    status: "completed",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    description: "Copy trade - Alex Chen",
  },
  {
    id: "TXN004",
    type: "trade",
    amount: 1350,
    status: "completed",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    description: "Stock sale",
    symbol: "TSLA",
    side: "SELL",
  },
  {
    id: "TXN005",
    type: "withdrawal",
    amount: -2000,
    status: "pending",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    description: "Withdrawal request",
  },
  {
    id: "TXN006",
    type: "deposit",
    amount: 3000,
    status: "completed",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "USDT deposit",
  },
];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((txn) => {
      const matchesSearch =
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.symbol?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "All" || txn.type === filterType;
      const matchesStatus = filterStatus === "All" || txn.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, filterType, filterStatus]);

  const totalDeposits = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(
      (t) => t.type === "deposit" && t.status === "completed"
    ).reduce((sum, t) => sum + t.amount, 0);
  }, []);

  const totalWithdrawals = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(
      (t) => t.type === "withdrawal" && t.status === "completed"
    ).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="h-5 w-5 text-emerald-400" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-5 w-5 text-rose-400" />;
      case "trade":
        return <TrendingUp className="h-5 w-5 text-cyan-400" />;
      case "copy_trade":
        return <TrendingDown className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      failed: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    };
    return (
      <span
        className={`px-2 py-1 rounded-lg text-xs font-medium border ${styles[status as keyof typeof styles]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Transaction History
              </h1>
              <p className="text-gray-400">
                View all your deposits, withdrawals, and trades
              </p>
            </div>
            <Button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Total Deposits</div>
              <div className="text-2xl font-bold text-emerald-400">
                {formatMoney(totalDeposits)}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Total Withdrawals</div>
              <div className="text-2xl font-bold text-rose-400">
                {formatMoney(totalWithdrawals)}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Net Flow</div>
              <div className="text-2xl font-bold text-white">
                {formatMoney(totalDeposits - totalWithdrawals)}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  <option value="All">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="trade">Trades</option>
                  <option value="copy_trade">Copy Trades</option>
                </select>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.map((txn, index) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(txn.type)}
                        <span className="text-sm text-gray-300 capitalize">
                          {txn.type.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{txn.description}</div>
                      {txn.symbol && (
                        <div className="text-xs text-gray-400 mt-1">
                          {txn.side} {txn.symbol}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-semibold ${
                          txn.amount >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {txn.amount >= 0 ? "+" : ""}
                        {formatMoney(Math.abs(txn.amount))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(txn.date).toLocaleDateString()}{" "}
                      {new Date(txn.date).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-500 font-mono">
                        {txn.id}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
                <p className="text-gray-400">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

