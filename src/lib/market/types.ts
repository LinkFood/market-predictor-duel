
/**
 * Market Data Types
 */

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
  avgVolume?: number;
  yield?: number;
  beta?: number;
  datetime: string;
}

export interface HistoricalData {
  symbol: string;
  data: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}
