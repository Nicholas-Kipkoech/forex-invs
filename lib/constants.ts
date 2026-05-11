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
      {
        id: "FXAIX",
        name: "Fidelity 500 Index Fund",
        tvSymbol: "MUTF:FXAIX",
      },
    ],
  },

  Commodities: {
    label: "Commodities",
    list: [
      {
        id: "XAUUSD",
        name: "Gold (XAU/USD)",
        tvSymbol: "FOREXCOM:XAUUSD",
      },
      {
        id: "CL",
        name: "Crude Oil (WTI)",
        tvSymbol: "NYMEX:CL1!",
      },
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
      {
        id: "BTCUSD",
        name: "Bitcoin",
        tvSymbol: "COINBASE:BTCUSD",
      },
      {
        id: "ETHUSD",
        name: "Ethereum",
        tvSymbol: "COINBASE:ETHUSD",
      },
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
      {
        id: "SPSK",
        name: "SP Funds Sukuk ETF",
        tvSymbol: "NYSEARCA:SPSK",
      },
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

export const MIN_WITHDRAWAL_AMOUNT = 5210;

export const PRICE_UPDATE_INTERVAL = 2500;

// smaller movement
export const PRICE_JITTER_PERCENT = 0.0025;

export const MAX_NOTIFICATIONS = 6;
export const MAX_TRADES_HISTORY = 50;

export function findTvSymbol(id: string): string {
  for (const cat of Object.values(CATEGORIES)) {
    const found = cat.list.find((s) => s.id === id);

    if (found) return found.tvSymbol;
  }

  return `NASDAQ:${id}`;
}

/**
 * Realistic market simulation:
 *
 * - slow upward drift
 * - random pullbacks
 * - low volatility
 * - occasional corrections
 */

export function mockSeries(
  len = 30,
  base = 5000,
): Array<{ name: string; value: number }> {
  let value = base;

  return Array.from({ length: len }).map((_, i) => {
    /**
     * Small market drift upward
     * (~0.02% to 0.12%)
     */
    const drift = base * (Math.random() * 0.001);

    /**
     * Natural volatility
     */
    const volatility = base * ((Math.random() - 0.5) * 0.004);

    /**
     * Rare correction dips
     */
    const correction =
      Math.random() < 0.08 ? -(base * (0.003 + Math.random() * 0.01)) : 0;

    /**
     * Final movement
     */
    value += drift + volatility + correction;

    /**
     * Prevent unrealistic collapse
     */
    value = Math.max(base * 0.7, value);

    return {
      name: `T${i + 1}`,
      value: roundToDecimal(value),
    };
  });
}

export function generateNextPrice(current: number, base: number): number {
  /**
   * Very small upward bias
   */
  const drift = base * 0.00015;

  /**
   * Market volatility
   */
  const volatility = base * ((Math.random() - 0.5) * 0.003);

  /**
   * Random correction event
   */
  const correction =
    Math.random() < 0.03 ? -(base * (0.002 + Math.random() * 0.01)) : 0;

  let next = current + drift + volatility + correction;

  /**
   * Clamp unrealistic growth
   */
  const maxGrowth = base * 1.12;
  const minGrowth = base * 0.88;

  next = Math.min(maxGrowth, Math.max(minGrowth, next));

  return roundToDecimal(next);
}

function roundToDecimal(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
