"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, roundToDecimal } from "@/lib/utils";

export default function TradingToolsPage() {
  const [positionSize, setPositionSize] = useState({
    accountBalance: 10000,
    riskPercent: 2,
    entryPrice: 100,
    stopLoss: 95,
  });

  const [riskCalculator, setRiskCalculator] = useState({
    accountSize: 10000,
    riskAmount: 200,
    entryPrice: 100,
    stopLoss: 95,
  });

  const calculatePositionSize = () => {
    const riskAmount = (positionSize.accountBalance * positionSize.riskPercent) / 100;
    const priceDifference = Math.abs(positionSize.entryPrice - positionSize.stopLoss);
    const riskPerShare = priceDifference;
    const shares = riskAmount / riskPerShare;
    return {
      shares: Math.floor(shares),
      riskAmount: roundToDecimal(riskAmount),
      totalValue: roundToDecimal(shares * positionSize.entryPrice),
    };
  };

  const calculateRisk = () => {
    const priceDifference = Math.abs(riskCalculator.entryPrice - riskCalculator.stopLoss);
    const riskPerShare = priceDifference;
    const shares = riskCalculator.riskAmount / riskPerShare;
    const totalValue = shares * riskCalculator.entryPrice;
    const riskPercent = (riskCalculator.riskAmount / riskCalculator.accountSize) * 100;
    return {
      shares: Math.floor(shares),
      totalValue: roundToDecimal(totalValue),
      riskPercent: roundToDecimal(riskPercent),
    };
  };

  const positionResult = calculatePositionSize();
  const riskResult = calculateRisk();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Trading Tools</h1>
              <p className="text-gray-400">
                Professional calculators for position sizing and risk management
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position Size Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Position Size Calculator</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Account Balance
                </label>
                <input
                  type="number"
                  value={positionSize.accountBalance}
                  onChange={(e) =>
                    setPositionSize({
                      ...positionSize,
                      accountBalance: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Risk Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={positionSize.riskPercent}
                  onChange={(e) =>
                    setPositionSize({
                      ...positionSize,
                      riskPercent: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={positionSize.entryPrice}
                  onChange={(e) =>
                    setPositionSize({
                      ...positionSize,
                      entryPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={positionSize.stopLoss}
                  onChange={(e) =>
                    setPositionSize({
                      ...positionSize,
                      stopLoss: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-sm text-emerald-400 mb-3 font-medium">Results</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Position Size:</span>
                  <span className="text-white font-semibold">
                    {positionResult.shares} shares
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Amount:</span>
                  <span className="text-white font-semibold">
                    {formatMoney(positionResult.riskAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Position Value:</span>
                  <span className="text-white font-semibold">
                    {formatMoney(positionResult.totalValue)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Risk Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Risk Calculator</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Account Size
                </label>
                <input
                  type="number"
                  value={riskCalculator.accountSize}
                  onChange={(e) =>
                    setRiskCalculator({
                      ...riskCalculator,
                      accountSize: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Risk Amount ($)
                </label>
                <input
                  type="number"
                  value={riskCalculator.riskAmount}
                  onChange={(e) =>
                    setRiskCalculator({
                      ...riskCalculator,
                      riskAmount: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={riskCalculator.entryPrice}
                  onChange={(e) =>
                    setRiskCalculator({
                      ...riskCalculator,
                      entryPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={riskCalculator.stopLoss}
                  onChange={(e) =>
                    setRiskCalculator({
                      ...riskCalculator,
                      stopLoss: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-sm text-cyan-400 mb-3 font-medium">Results</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shares to Buy:</span>
                  <span className="text-white font-semibold">
                    {riskResult.shares} shares
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position Value:</span>
                  <span className="text-white font-semibold">
                    {formatMoney(riskResult.totalValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Percentage:</span>
                  <span className="text-white font-semibold">
                    {riskResult.riskPercent}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <TrendingUp className="h-6 w-6 text-emerald-400 mb-2" />
            <div className="text-sm font-medium text-white mb-1">Position Sizing</div>
            <div className="text-xs text-gray-400">
              Calculate the optimal position size based on your risk tolerance
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Shield className="h-6 w-6 text-cyan-400 mb-2" />
            <div className="text-sm font-medium text-white mb-1">Risk Management</div>
            <div className="text-xs text-gray-400">
              Never risk more than 1-2% of your account on a single trade
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Target className="h-6 w-6 text-blue-400 mb-2" />
            <div className="text-sm font-medium text-white mb-1">Stop Loss</div>
            <div className="text-xs text-gray-400">
              Always set stop losses to protect your capital
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


