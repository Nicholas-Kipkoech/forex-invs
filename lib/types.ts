// Type definitions for the application

export interface Investor {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  phone?: string;
  created_at?: string;
}

export interface PortfolioHolding {
  shares: number;
  avgPrice: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  shares: number;
  price: number;
  cost: number;
  time: string;
}

export interface Asset {
  id: string;
  name: string;
  tvSymbol: string;
}

export interface Category {
  label: string;
  list: Asset[];
}

export interface NotificationData {
  type: "registration" | "deposit" | "withdrawal" | "withdrawal_complete";
  name: string;
  email: string;
  phone?: string;
  depositAmount?: string;
  withdrawalAmount?: string;
  file?: {
    filename: string;
    base64: string;
    mimetype: string;
  };
}

export interface TradeOrder {
  side: "BUY" | "SELL";
  symbol: string;
  shares: number;
}

export interface PriceData {
  [symbol: string]: number;
}

export interface PortfolioData {
  [symbol: string]: PortfolioHolding;
}

