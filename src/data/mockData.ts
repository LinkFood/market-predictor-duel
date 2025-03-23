// Add 'price' property to mockStockData to fix issues where 'value' is referenced
import { MarketData, Prediction } from "@/types";
import { StockData } from "@/lib/market/types";

export const mockStockData = [
  { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    price: 175.45, 
    changePercent: 1.25, 
    sector: "Technology",
    change: 2.19,
    datetime: new Date().toISOString(),
    marketCap: 2850000000000,
    volume: 75365421
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft Corporation", 
    price: 325.76, 
    changePercent: 0.78, 
    sector: "Technology" 
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet Inc.", 
    price: 137.23, 
    changePercent: -0.45, 
    sector: "Technology" 
  },
  { 
    symbol: "AMZN", 
    name: "Amazon.com Inc.", 
    price: 3128.92, 
    changePercent: 2.34, 
    sector: "Consumer Cyclical" 
  },
  { 
    symbol: "TSLA", 
    name: "Tesla Inc.", 
    price: 680.52, 
    changePercent: -1.87, 
    sector: "Automotive" 
  },
  { 
    symbol: "FB", 
    name: "Meta Platforms Inc.", 
    price: 327.35, 
    changePercent: 3.52, 
    sector: "Technology" 
  },
  { 
    symbol: "NFLX", 
    name: "Netflix Inc.", 
    price: 542.76, 
    changePercent: 0.65, 
    sector: "Entertainment" 
  },
  { 
    symbol: "JPM", 
    name: "JPMorgan Chase & Co.", 
    price: 154.23, 
    changePercent: -0.28, 
    sector: "Financial Services" 
  },
  { 
    symbol: "V", 
    name: "Visa Inc.", 
    price: 235.69, 
    changePercent: 0.92, 
    sector: "Financial Services" 
  }
];

export const mockPredictions: Prediction[] = [
  {
    id: "pred-1",
    userId: "user-1",
    targetType: "stock",
    targetName: "Apple Inc.",
    ticker: "AAPL",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bearish",
    aiConfidence: 0.75,
    aiAnalysis: {
      supporting: ["Strong product lineup", "Expanding services revenue"],
      counter: ["Potential supply chain issues"],
      reasoning: "Based on technical indicators and sentiment analysis"
    },
    timeframe: "1w",
    startingValue: 175.45,
    endValue: 171.23,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    percentChange: -2.41,
    prediction_type: "trend"
  },
  {
    id: "pred-2",
    userId: "user-1",
    targetType: "stock",
    targetName: "Microsoft Corporation",
    ticker: "MSFT",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 0.89,
    aiAnalysis: {
      supporting: ["Strong cloud growth", "Enterprise adoption increasing"],
      counter: ["Valuation concerns"],
      reasoning: "Cloud growth trajectory and enterprise spending forecasts"
    },
    timeframe: "1m",
    startingValue: 325.76,
    endValue: 340.15,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "bullish",
    winner: "both",
    percentChange: 4.42,
    points: 100,
    prediction_type: "trend"
  },
  {
    id: "pred-3",
    userId: "user-1",
    targetType: "stock",
    targetName: "Tesla Inc.",
    ticker: "TSLA",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bearish",
    aiConfidence: 0.67,
    aiAnalysis: {
      supporting: ["Production scaling well", "New factory opening"],
      counter: ["Competition increasing", "Valuation stretched"],
      reasoning: "Technical analysis suggests potential pullback"
    },
    timeframe: "1w",
    startingValue: 680.52,
    endValue: 650.31,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "bearish",
    winner: "ai",
    percentChange: -4.44,
    points: 0,
    prediction_type: "trend"
  }
];

export const mockMarketIndices: MarketData[] = [
  {
    name: "S&P 500",
    symbol: "SPX",
    value: 4587.32,
    change: 12.45,
    changePercent: 0.27
  },
  {
    name: "Dow Jones",
    symbol: "DJI",
    value: 35927.43,
    change: -65.75,
    changePercent: -0.18
  },
  {
    name: "Nasdaq",
    symbol: "IXIC",
    value: 15157.89,
    change: 45.23,
    changePercent: 0.30
  },
  {
    name: "Russell 2000",
    symbol: "RUT",
    value: 2245.67,
    change: 8.92,
    changePercent: 0.40
  }
];

// Define StockData interface
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
  datetime?: string;
  sector?: string;
}

// Create a mock bracket for testing
import { 
  Bracket, 
  BracketTimeframe, 
  BracketStatus, 
  BracketSize,
  BracketEntry,
  BracketMatch,
  AIPersonality
} from '@/lib/duel/types';

export function createMockBracket(id: string): Bracket {
  // Generate common properties
  const now = new Date();
  const startDate = now.toISOString();
  const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const createdAt = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  
  // Create user entries
  const userEntries: BracketEntry[] = [
    {
      id: `${id}-user-1`,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      entryType: 'stock',
      direction: 'bullish',
      startPrice: 178.72,
      marketCap: 'large',
      sector: 'Technology',
      order: 1
    },
    {
      id: `${id}-user-2`,
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      entryType: 'stock',
      direction: 'bearish',
      startPrice: 197.45,
      marketCap: 'large',
      sector: 'Financial Services',
      order: 2
    },
    {
      id: `${id}-user-3`,
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      entryType: 'stock',
      direction: 'bullish',
      startPrice: 152.67,
      marketCap: 'large',
      sector: 'Healthcare',
      order: 3
    }
  ];
  
  // Create AI entries
  const aiEntries: BracketEntry[] = [
    {
      id: `${id}-ai-1`,
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      entryType: 'stock',
      direction: 'bullish',
      startPrice: 403.78,
      marketCap: 'large',
      sector: 'Technology',
      order: 1
    },
    {
      id: `${id}-ai-2`,
      symbol: 'BAC',
      name: 'Bank of America Corp.',
      entryType: 'stock',
      direction: 'bearish',
      startPrice: 37.92,
      marketCap: 'large',
      sector: 'Financial Services',
      order: 2
    },
    {
      id: `${id}-ai-3`,
      symbol: 'PFE',
      name: 'Pfizer Inc.',
      entryType: 'stock',
      direction: 'bearish',
      startPrice: 28.12,
      marketCap: 'large',
      sector: 'Healthcare',
      order: 3
    }
  ];
  
  // Create matches
  const matches: BracketMatch[] = [
    {
      id: `${id}-match-1`,
      roundNumber: 1,
      matchNumber: 1,
      entry1Id: `${id}-user-1`,
      entry2Id: `${id}-ai-1`,
      completed: false
    },
    {
      id: `${id}-match-2`,
      roundNumber: 1,
      matchNumber: 2,
      entry1Id: `${id}-user-2`,
      entry2Id: `${id}-ai-2`,
      completed: false
    },
    {
      id: `${id}-match-3`,
      roundNumber: 1,
      matchNumber: 3,
      entry1Id: `${id}-user-3`,
      entry2Id: `${id}-ai-3`,
      completed: false
    }
  ];
  
  // Return complete bracket
  return {
    id,
    userId: 'user-1',
    name: 'Weekly Tech Face-off',
    timeframe: 'weekly',
    size: 3,
    status: 'active',
    aiPersonality: 'ValueHunter',
    userEntries,
    aiEntries,
    matches,
    startDate,
    endDate,
    createdAt,
    userPoints: 0,
    aiPoints: 0
  };
}

// Export mock gainers and losers for market movers service
export function getMockGainers() {
  return mockStockData.slice(0, 5).map(stock => ({
    ...stock,
    changePercent: Math.abs(stock.changePercent) 
  }));
}

export function getMockLosers() {
  return mockStockData.slice(5, 10).map(stock => ({
    ...stock,
    changePercent: -Math.abs(stock.changePercent)
  }));
}

export const mockGlobalStats = {
  totalPredictions: 124823,
  aiWins: 58932,
  humanWins: 61284,
  ties: 4607,
  marketPredictions: 34278,
  sectorPredictions: 29871,
  stockPredictions: 60674
};
