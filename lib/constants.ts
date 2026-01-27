// Application constants

import { Category } from "./types";

export const CATEGORIES: Record<string, Category> = {
  Stocks: {
    label: "Stocks",
    list: [
      { id: "AAPL", name: "Apple", tvSymbol: "NASDAQ:AAPL" },
      { id: "TSLA", name: "Tesla", tvSymbol: "NASDAQ:TSLA" },
      { id: "NVDA", name: "NVIDIA", tvSymbol: "NASDAQ:NVDA" },
      { id: "AMZN", name: "Amazon", tvSymbol: "NASDAQ:AMZN" },
      { id: "MSFT", name: "Microsoft", tvSymbol: "NASDAQ:MSFT" },
    ],
  },
  ETFs: {
    label: "ETFs",
    list: [
      { id: "SPY", name: "SPDR S&P 500 ETF", tvSymbol: "ARCA:SPY" },
      { id: "QQQ", name: "Invesco QQQ", tvSymbol: "NASDAQ:QQQ" },
      { id: "VOO", name: "Vanguard S&P 500", tvSymbol: "AMEX:VOO" },
    ],
  },
  Bonds: {
    label: "Bonds",
    list: [
      { id: "US10Y", name: "U.S. 10Y Yield", tvSymbol: "CBOE:TNX" },
      { id: "US02Y", name: "U.S. 2Y Yield", tvSymbol: "CBOE:US02Y" },
    ],
  },
  Funds: {
    label: "Mutual Funds",
    list: [
      {
        id: "VTSAX",
        name: "Vanguard Total Stock Mkt Adm",
        tvSymbol: "MUTF:VTSAX",
      },
      { id: "FXAIX", name: "Fidelity 500 Index Fund", tvSymbol: "MUTF:FXAIX" },
    ],
  },
  Commodities: {
    label: "Commodities",
    list: [
      { id: "XAUUSD", name: "Gold (XAU/USD)", tvSymbol: "FOREXCOM:XAUUSD" },
      { id: "CL", name: "Crude Oil (WTI)", tvSymbol: "NYMEX:CL1!" },
    ],
  },
  Indices: {
    label: "Indices",
    list: [
      { id: "SPX", name: "S&P 500", tvSymbol: "SP:SPX" },
      { id: "NDX", name: "NASDAQ 100", tvSymbol: "NASDAQ:NDX" },
    ],
  },
  Crypto: {
    label: "Crypto",
    list: [
      { id: "BTCUSD", name: "Bitcoin", tvSymbol: "COINBASE:BTCUSD" },
      { id: "ETHUSD", name: "Ethereum", tvSymbol: "COINBASE:ETHUSD" },
    ],
  },
  shariah: {
    label: "Shariah-Compliant",
    list: [
      {
        id: "HLAL",
        name: "Wahed FTSE USA Shariah ETF",
        tvSymbol: "NASDAQ:HLAL",
      },
      {
        id: "SPUS",
        name: "SP Funds S&P 500 Shariah ETF",
        tvSymbol: "NYSEARCA:SPUS",
      },
      { id: "SPSK", name: "SP Funds Sukuk ETF", tvSymbol: "NYSEARCA:SPSK" },
      {
        id: "ISWD",
        name: "iShares MSCI World Islamic ETF",
        tvSymbol: "LSE:ISWD",
      },
      {
        id: "ISUS",
        name: "iShares MSCI USA Islamic ETF",
        tvSymbol: "LSE:ISUS",
      },
    ],
  },
};

export const DEFAULT_CATEGORY = "Stocks";
export const DEFAULT_SYMBOL = CATEGORIES[DEFAULT_CATEGORY].list[0].id;
export const START_BALANCE = 0;
export const MIN_WITHDRAWAL_AMOUNT = 5000;
export const PRICE_UPDATE_INTERVAL = 2000; // 2 seconds
export const PRICE_JITTER_PERCENT = 0.003; // 0.3%
export const MAX_NOTIFICATIONS = 6;
export const MAX_TRADES_HISTORY = 50;

export function findTvSymbol(id: string): string {
  for (const cat of Object.values(CATEGORIES)) {
    const found = cat.list.find((s) => s.id === id);
    if (found) return found.tvSymbol;
  }
  return `NASDAQ:${id}`;
}

export function mockSeries(len = 30, base = 5000): Array<{ name: string; value: number }> {
  let val = base;
  return Array.from({ length: len }).map((_, i) => {
    const change = (Math.random() - 0.45) * (base * 0.01);
    val = Math.max(0, roundToDecimal(val + change));
    return { name: `T${i + 1}`, value: val };
  });
}

function roundToDecimal(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

