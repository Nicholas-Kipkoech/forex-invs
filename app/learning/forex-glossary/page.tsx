"use client";

import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";

export default function ForexGlossary() {
  const [searchTerm, setSearchTerm] = useState("");

  const glossary = [
    { term: "Ask Price", definition: "The price at which you can buy a currency pair. Also called the 'offer' price." },
    { term: "Bid Price", definition: "The price at which you can sell a currency pair." },
    { term: "Spread", definition: "The difference between the bid and ask price. This is how brokers make money." },
    { term: "Pip", definition: "Percentage In Point - the smallest price movement in forex. Usually 0.0001 for most pairs." },
    { term: "Lot", definition: "Standard unit of currency traded. Standard lot = 100,000 units of base currency." },
    { term: "Leverage", definition: "Borrowed capital to increase trading position size. Example: 1:100 means $1 controls $100." },
    { term: "Margin", definition: "Collateral required to open and maintain a leveraged position." },
    { term: "Margin Call", definition: "Broker's demand for additional funds when account equity falls below margin requirement." },
    { term: "Long Position", definition: "Buying a currency pair, expecting it to rise in value." },
    { term: "Short Position", definition: "Selling a currency pair, expecting it to fall in value." },
    { term: "Base Currency", definition: "The first currency in a pair. In EUR/USD, EUR is the base currency." },
    { term: "Quote Currency", definition: "The second currency in a pair. In EUR/USD, USD is the quote currency." },
    { term: "Major Pairs", definition: "Currency pairs that include USD and are most liquid (EUR/USD, GBP/USD, USD/JPY)." },
    { term: "Minor Pairs", definition: "Currency pairs that don't include USD (EUR/GBP, EUR/JPY)." },
    { term: "Exotic Pairs", definition: "Pairs with one major currency and one from emerging economy (USD/ZAR, USD/TRY)." },
    { term: "Stop Loss", definition: "Order to automatically close a position at a specific price to limit losses." },
    { term: "Take Profit", definition: "Order to automatically close a position at a specific price to lock in profits." },
    { term: "Market Order", definition: "Order to buy or sell immediately at current market price." },
    { term: "Limit Order", definition: "Order to buy or sell at a specific price or better." },
    { term: "Pending Order", definition: "Order placed to execute when price reaches a specified level." },
    { term: "Buy Limit", definition: "Pending order to buy at a price below current market price." },
    { term: "Sell Limit", definition: "Pending order to sell at a price above current market price." },
    { term: "Buy Stop", definition: "Pending order to buy at a price above current market price (breakout order)." },
    { term: "Sell Stop", definition: "Pending order to sell at a price below current market price (breakdown order)." },
    { term: "Slippage", definition: "Difference between expected price and actual execution price." },
    { term: "Liquidity", definition: "Ease of buying/selling without affecting price. High liquidity = tight spreads." },
    { term: "Volatility", definition: "Measure of price fluctuations. High volatility = larger price swings." },
    { term: "Trend", definition: "General direction of price movement. Can be uptrend, downtrend, or sideways." },
    { term: "Support", definition: "Price level where buying pressure is strong enough to prevent further decline." },
    { term: "Resistance", definition: "Price level where selling pressure is strong enough to prevent further rise." },
    { term: "Breakout", definition: "When price moves beyond a support or resistance level." },
    { term: "Candlestick", definition: "Chart element showing open, high, low, and close prices for a time period." },
    { term: "Bullish", definition: "Market sentiment expecting prices to rise." },
    { term: "Bearish", definition: "Market sentiment expecting prices to fall." },
    { term: "Carry Trade", definition: "Strategy of buying high-interest currency and selling low-interest currency." },
    { term: "Central Bank", definition: "Institution that manages a country's monetary policy (Fed, ECB, BoE)." },
    { term: "Interest Rate", definition: "Cost of borrowing money. Higher rates attract foreign investment." },
    { term: "GDP", definition: "Gross Domestic Product - total economic output of a country." },
    { term: "CPI", definition: "Consumer Price Index - measures inflation by tracking price changes." },
    { term: "NFP", definition: "Non-Farm Payrolls - US employment data released monthly, highly influential." },
    { term: "FOMC", definition: "Federal Open Market Committee - sets US interest rates." },
    { term: "ECB", definition: "European Central Bank - manages monetary policy for Eurozone." },
    { term: "BoE", definition: "Bank of England - UK's central bank." },
    { term: "BoJ", definition: "Bank of Japan - Japan's central bank." },
    { term: "Scalping", definition: "Trading strategy making many quick trades to capture small price movements." },
    { term: "Day Trading", definition: "Opening and closing positions within the same trading day." },
    { term: "Swing Trading", definition: "Holding positions for days to weeks to capture medium-term moves." },
    { term: "Position Trading", definition: "Long-term trading holding positions for weeks to months." },
    { term: "Risk/Reward Ratio", definition: "Comparison of potential profit to potential loss. Example: 2:1 means $2 profit for $1 risk." },
    { term: "Drawdown", definition: "Peak-to-trough decline in account value during losing period." },
    { term: "Equity", definition: "Current account value including open positions' unrealized P&L." },
    { term: "Balance", definition: "Total funds in account excluding unrealized P&L from open positions." },
    { term: "Free Margin", definition: "Available margin for opening new positions (Equity - Margin Used)." },
    { term: "Margin Level", definition: "Ratio of equity to margin used. Lower = higher risk of margin call." },
    { term: "Expert Advisor (EA)", definition: "Automated trading program that executes trades based on algorithms." },
    { term: "Backtesting", definition: "Testing trading strategy on historical data to evaluate performance." },
    { term: "Demo Account", definition: "Practice account with virtual money to learn trading without risk." },
    { term: "Live Account", definition: "Real trading account with actual money." },
    { term: "Lot Size", definition: "Volume of currency traded. Standard = 1.0, Mini = 0.1, Micro = 0.01." },
    { term: "Point", definition: "Smallest price change. For most pairs = 0.00001 (5th decimal)." },
    { term: "Swap", definition: "Interest paid or earned for holding positions overnight." },
    { term: "Rollover", definition: "Process of extending settlement date for open positions (involves swap)." },
    { term: "Gap", definition: "Price jump between closing and opening prices, common after weekends." },
    { term: "Correlation", definition: "Relationship between two currency pairs moving together or opposite." },
    { term: "Divergence", definition: "When price and indicator move in opposite directions, potential reversal signal." },
    { term: "Overbought", definition: "Condition when price has risen too much, potential reversal down." },
    { term: "Oversold", definition: "Condition when price has fallen too much, potential reversal up." },
  ];

  const filteredGlossary = glossary.filter((item) =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 md:px-12 py-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
          Forex Glossary
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Comprehensive dictionary of forex trading terms. Search and learn all the jargon used in currency trading.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-emerald-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Found {filteredGlossary.length} terms
        </p>
      </motion.div>

      {/* Glossary Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGlossary.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.01 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-emerald-300">{item.term}</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{item.definition}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {filteredGlossary.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg">No terms found matching your search.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-emerald-400 hover:text-emerald-300 underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Quick Reference</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Trading Basics</h3>
              <p className="text-slate-300">Pip, Lot, Spread, Bid, Ask, Long, Short</p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Orders</h3>
              <p className="text-slate-300">Market Order, Limit Order, Stop Loss, Take Profit</p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Risk Management</h3>
              <p className="text-slate-300">Leverage, Margin, Drawdown, Risk/Reward</p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Analysis</h3>
              <p className="text-slate-300">Support, Resistance, Trend, Breakout, Volatility</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



