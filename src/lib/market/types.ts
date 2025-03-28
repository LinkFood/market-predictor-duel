
/**
 * Market Data Types
 * Shared type definitions for market data
 */

// Stock data representation
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high52Week?: number | null;
  low52Week?: number | null;
  volume?: number;
  datetime: string;
  // Additional fields that are used in the application
  sector?: string;
  marketCap?: number;
  pe?: number;
  avgVolume?: number;
  yield?: number;
  beta?: number;
}

// Historical data point structure
export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Complete historical data response
export interface HistoricalData {
  symbol: string;
  data: HistoricalDataPoint[];
}

// Market data search response
export interface StockSearchResponse {
  results: StockData[];
  status: string;
  count: number;
}

// Market movers response
export interface MarketMoversResponse {
  gainers: StockData[];
  losers: StockData[];
}
