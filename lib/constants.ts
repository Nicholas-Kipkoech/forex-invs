import type { PriceData } from "./types";

/* -------------------- category metadata -------------------- */

export interface MarketSymbol {
  id: string; // ticker used as the app-internal key, e.g. "AAPL"
  name: string; // display name, e.g. "Apple Inc."
  tv: string; // full TradingView symbol, e.g. "NASDAQ:AAPL"
}

export interface MarketCategory {
  label: string;
  color: string; // tailwind color token used for badges/accents, e.g. "emerald"
  list: MarketSymbol[];
}

export const CATEGORIES: Record<string, MarketCategory> = {
  stocks: {
    label: "Stocks",
    color: "emerald",
    list: [
      // Technology
      { id: "AAPL", name: "Apple Inc.", tv: "NASDAQ:AAPL" },
      { id: "MSFT", name: "Microsoft Corp.", tv: "NASDAQ:MSFT" },
      { id: "GOOGL", name: "Alphabet Inc.", tv: "NASDAQ:GOOGL" },
      { id: "AMZN", name: "Amazon.com Inc.", tv: "NASDAQ:AMZN" },
      { id: "NVDA", name: "NVIDIA Corp.", tv: "NASDAQ:NVDA" },
      { id: "META", name: "Meta Platforms Inc.", tv: "NASDAQ:META" },
      { id: "TSLA", name: "Tesla Inc.", tv: "NASDAQ:TSLA" },
      { id: "AVGO", name: "Broadcom Inc.", tv: "NASDAQ:AVGO" },
      { id: "ORCL", name: "Oracle Corp.", tv: "NYSE:ORCL" },
      { id: "CRM", name: "Salesforce Inc.", tv: "NYSE:CRM" },
      { id: "ADBE", name: "Adobe Inc.", tv: "NASDAQ:ADBE" },
      { id: "AMD", name: "Advanced Micro Devices", tv: "NASDAQ:AMD" },
      { id: "INTC", name: "Intel Corp.", tv: "NASDAQ:INTC" },
      { id: "CSCO", name: "Cisco Systems", tv: "NASDAQ:CSCO" },
      { id: "IBM", name: "IBM Corp.", tv: "NYSE:IBM" },
      { id: "NFLX", name: "Netflix Inc.", tv: "NASDAQ:NFLX" },
      { id: "UBER", name: "Uber Technologies", tv: "NYSE:UBER" },
      { id: "SHOP", name: "Shopify Inc.", tv: "NYSE:SHOP" },
      // Financials
      { id: "JPM", name: "JPMorgan Chase & Co.", tv: "NYSE:JPM" },
      { id: "BAC", name: "Bank of America Corp.", tv: "NYSE:BAC" },
      { id: "WFC", name: "Wells Fargo & Co.", tv: "NYSE:WFC" },
      { id: "GS", name: "Goldman Sachs Group", tv: "NYSE:GS" },
      { id: "MS", name: "Morgan Stanley", tv: "NYSE:MS" },
      { id: "V", name: "Visa Inc.", tv: "NYSE:V" },
      { id: "MA", name: "Mastercard Inc.", tv: "NYSE:MA" },
      { id: "AXP", name: "American Express Co.", tv: "NYSE:AXP" },
      { id: "BLK", name: "BlackRock Inc.", tv: "NYSE:BLK" },
      { id: "C", name: "Citigroup Inc.", tv: "NYSE:C" },
      // Healthcare
      { id: "UNH", name: "UnitedHealth Group", tv: "NYSE:UNH" },
      { id: "JNJ", name: "Johnson & Johnson", tv: "NYSE:JNJ" },
      { id: "LLY", name: "Eli Lilly and Co.", tv: "NYSE:LLY" },
      { id: "PFE", name: "Pfizer Inc.", tv: "NYSE:PFE" },
      { id: "ABBV", name: "AbbVie Inc.", tv: "NYSE:ABBV" },
      { id: "MRK", name: "Merck & Co.", tv: "NYSE:MRK" },
      { id: "TMO", name: "Thermo Fisher Scientific", tv: "NYSE:TMO" },
      { id: "ABT", name: "Abbott Laboratories", tv: "NYSE:ABT" },
      // Consumer
      { id: "WMT", name: "Walmart Inc.", tv: "NYSE:WMT" },
      { id: "PG", name: "Procter & Gamble Co.", tv: "NYSE:PG" },
      { id: "KO", name: "Coca-Cola Co.", tv: "NYSE:KO" },
      { id: "PEP", name: "PepsiCo Inc.", tv: "NASDAQ:PEP" },
      { id: "MCD", name: "McDonald's Corp.", tv: "NYSE:MCD" },
      { id: "NKE", name: "Nike Inc.", tv: "NYSE:NKE" },
      { id: "SBUX", name: "Starbucks Corp.", tv: "NASDAQ:SBUX" },
      { id: "COST", name: "Costco Wholesale", tv: "NASDAQ:COST" },
      { id: "HD", name: "Home Depot Inc.", tv: "NYSE:HD" },
      { id: "DIS", name: "Walt Disney Co.", tv: "NYSE:DIS" },
      // Energy & Industrials
      { id: "XOM", name: "Exxon Mobil Corp.", tv: "NYSE:XOM" },
      { id: "CVX", name: "Chevron Corp.", tv: "NYSE:CVX" },
      { id: "CAT", name: "Caterpillar Inc.", tv: "NYSE:CAT" },
      { id: "BA", name: "Boeing Co.", tv: "NYSE:BA" },
      { id: "GE", name: "General Electric Co.", tv: "NYSE:GE" },
      { id: "HON", name: "Honeywell International", tv: "NASDAQ:HON" },
      { id: "LMT", name: "Lockheed Martin Corp.", tv: "NYSE:LMT" },
    ],
  },

  funds: {
    label: "Index Funds & ETFs",
    color: "cyan",
    list: [
      { id: "SPY", name: "SPDR S&P 500 ETF Trust", tv: "AMEX:SPY" },
      { id: "VOO", name: "Vanguard S&P 500 ETF", tv: "AMEX:VOO" },
      { id: "IVV", name: "iShares Core S&P 500 ETF", tv: "AMEX:IVV" },
      { id: "QQQ", name: "Invesco QQQ Trust (Nasdaq 100)", tv: "NASDAQ:QQQ" },
      { id: "VTI", name: "Vanguard Total Stock Market ETF", tv: "AMEX:VTI" },
      {
        id: "VXUS",
        name: "Vanguard Total International Stock ETF",
        tv: "NASDAQ:VXUS",
      },
      {
        id: "DIA",
        name: "SPDR Dow Jones Industrial Average ETF",
        tv: "AMEX:DIA",
      },
      { id: "IWM", name: "iShares Russell 2000 ETF", tv: "AMEX:IWM" },
      { id: "VUG", name: "Vanguard Growth ETF", tv: "AMEX:VUG" },
      { id: "VTV", name: "Vanguard Value ETF", tv: "AMEX:VTV" },
      { id: "SCHD", name: "Schwab US Dividend Equity ETF", tv: "AMEX:SCHD" },
      { id: "VYM", name: "Vanguard High Dividend Yield ETF", tv: "AMEX:VYM" },
      { id: "ARKK", name: "ARK Innovation ETF", tv: "AMEX:ARKK" },
    ],
  },

  bonds: {
    label: "Bonds",
    color: "amber",
    list: [
      {
        id: "TLT",
        name: "iShares 20+ Year Treasury Bond ETF",
        tv: "NASDAQ:TLT",
      },
      {
        id: "IEF",
        name: "iShares 7-10 Year Treasury Bond ETF",
        tv: "NASDAQ:IEF",
      },
      {
        id: "SHY",
        name: "iShares 1-3 Year Treasury Bond ETF",
        tv: "NASDAQ:SHY",
      },
      { id: "AGG", name: "iShares Core US Aggregate Bond ETF", tv: "AMEX:AGG" },
      { id: "BND", name: "Vanguard Total Bond Market ETF", tv: "NASDAQ:BND" },
      {
        id: "LQD",
        name: "iShares Investment Grade Corp Bond ETF",
        tv: "AMEX:LQD",
      },
      { id: "HYG", name: "iShares High Yield Corp Bond ETF", tv: "AMEX:HYG" },
    ],
  },

  commodities: {
    label: "Commodities",
    color: "yellow",
    list: [
      { id: "GLD", name: "SPDR Gold Shares", tv: "AMEX:GLD" },
      { id: "SLV", name: "iShares Silver Trust", tv: "AMEX:SLV" },
      { id: "USO", name: "United States Oil Fund", tv: "AMEX:USO" },
      { id: "UNG", name: "United States Natural Gas Fund", tv: "AMEX:UNG" },
      { id: "DBA", name: "Invesco DB Agriculture Fund", tv: "AMEX:DBA" },
    ],
  },

  indices: {
    label: "Indices",
    color: "purple",
    list: [
      { id: "SPX", name: "S&P 500 Index", tv: "TVC:SPX" },
      { id: "DJI", name: "Dow Jones Industrial Average", tv: "TVC:DJI" },
      { id: "NDX", name: "Nasdaq 100 Index", tv: "TVC:NDX" },
      { id: "RUT", name: "Russell 2000 Index", tv: "TVC:RUT" },
      { id: "VIX", name: "CBOE Volatility Index", tv: "TVC:VIX" },
    ],
  },

  crypto: {
    label: "Crypto",
    color: "orange",
    list: [
      { id: "BTCUSD", name: "Bitcoin", tv: "COINBASE:BTCUSD" },
      { id: "ETHUSD", name: "Ethereum", tv: "COINBASE:ETHUSD" },
      { id: "SOLUSD", name: "Solana", tv: "COINBASE:SOLUSD" },
      { id: "XRPUSD", name: "XRP", tv: "COINBASE:XRPUSD" },
      { id: "ADAUSD", name: "Cardano", tv: "COINBASE:ADAUSD" },
      { id: "DOGEUSD", name: "Dogecoin", tv: "COINBASE:DOGEUSD" },
    ],
  },

  shariah: {
    label: "Shariah-Compliant",
    color: "teal",
    list: [
      { id: "SPUS", name: "SP Funds S&P 500 Sharia ETF", tv: "BATS:SPUS" },
      { id: "HLAL", name: "Wahed FTSE USA Shariah ETF", tv: "BATS:HLAL" },
      {
        id: "UMMA",
        name: "Wahed Dow Jones Islamic World ETF",
        tv: "BATS:UMMA",
      },
      {
        id: "SPRE",
        name: "SP Funds S&P Global REIT Sharia ETF",
        tv: "BATS:SPRE",
      },
      {
        id: "SPSK",
        name: "SP Funds Dow Jones Global Sukuk ETF",
        tv: "BATS:SPSK",
      },
    ],
  },
};

export const DEFAULT_CATEGORY = "stocks";
export const DEFAULT_SYMBOL = "AAPL";

export const START_BALANCE = 100000;
export const ADD_FUNDS_AMOUNT = 5000;

export const PRICE_UPDATE_INTERVAL = 2500; // ms
export const MAX_NOTIFICATIONS = 4;
export const MAX_TRADES_HISTORY = 50;

/* -------------------- helpers -------------------- */

export function findTvSymbol(id: string): string {
  for (const cat of Object.values(CATEGORIES)) {
    const found = cat.list.find((s) => s.id === id);
    if (found) return found.tv;
  }
  return `NASDAQ:${id}`;
}

export function findSymbolMeta(id: string): MarketSymbol | undefined {
  for (const cat of Object.values(CATEGORIES)) {
    const found = cat.list.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

/**
 * Simulated random-walk price generator — symmetric, no upward bias.
 * Includes a very gentle pull back toward the session's starting price
 * so simulated prices don't wander off to zero or infinity over a long
 * session, without favoring gains over losses.
 */
export function generateNextPrice(current: number, base: number): number {
  const VOLATILITY = 0.015; // ~1.5% max move per tick
  const meanReversionStrength = 0.03;
  const meanReversion = ((base - current) / base) * meanReversionStrength;
  const shock = (Math.random() - 0.5) * 2 * VOLATILITY;
  const next = current * (1 + shock + meanReversion);
  return Math.max(0.01, Math.round(next * 100) / 100);
}

export function mockSeries(points: number, startValue: number) {
  const out: { name: string; value: number }[] = [];
  let value = startValue;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * (value * 0.004);
    value = Math.max(0, Math.round((value + change) * 100) / 100);
    out.push({ name: `T${i + 1}`, value });
  }
  return out;
}

export type { PriceData };
