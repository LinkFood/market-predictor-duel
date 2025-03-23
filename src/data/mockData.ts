// Import necessary types
import { GlobalStats, Prediction, MarketData, User } from "@/types";
import { Bracket, BracketTimeframe, BracketStatus, BracketSize, AIPersonality } from "@/lib/duel/types";

// Stock data interface - locally defined to avoid conflict 
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
  marketCap?: number;
  volume?: number;
  datetime?: string;
}

// Create mock bracket with specified ID
export function createMockBracket(id: string): Bracket {
  return {
    id,
    name: "Weekly Tech Showdown",
    status: "active" as BracketStatus,
    aiPersonality: "ValueHunter" as AIPersonality, 
    timeframe: "weekly" as BracketTimeframe,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    size: 3 as BracketSize,
    userEntries: [],
    aiEntries: [],
    matches: [],
    createdAt: new Date().toISOString(),
    userPoints: 0,
    aiPoints: 0
  };
}

// Global stats for AI vs humans battle
export const mockGlobalStats: GlobalStats = {
  totalPredictions: 12458,
  aiWins: 5723,
  humanWins: 6128,
  ties: 607,
  marketPredictions: 3245,
  sectorPredictions: 4126,
  stockPredictions: 5087,
  totalDuels: 1568,
  humansWon: 847,
  aiWon: 721,
  humanWinRate: 54,
  humanTrendAccuracy: 62,
  aiTrendAccuracy: 59,
  recentHumanAdvantage: 3,
  topHumanScore: 156,
  topAiScore: 142
};

// Mock leaderboard data
export const mockLeaderboard = [
  { 
    userId: "user-001", 
    name: "TradeMaster", 
    avatar: "👑", 
    score: 1250, 
    rank: 1, 
    winRate: 76, 
    streakCount: 5 
  },
  { 
    userId: "user-002", 
    name: "MarketWizard", 
    avatar: "🧙‍♂️", 
    score: 980, 
    rank: 2, 
    winRate: 68, 
    streakCount: 3 
  },
  { 
    userId: "user-003", 
    name: "StockWhisperer", 
    avatar: "🐘", 
    score: 870, 
    rank: 3, 
    winRate: 64, 
    streakCount: 0 
  },
  { 
    userId: "user-004", 
    name: "BullRider", 
    avatar: "🐂", 
    score: 740, 
    rank: 4, 
    winRate: 59, 
    streakCount: 2 
  },
  { 
    userId: "user-005", 
    name: "AlphaCatcher", 
    avatar: "🦊", 
    score: 690, 
    rank: 5, 
    winRate: 57, 
    streakCount: 1 
  }
];

// Mock market data for landing page
export const mockMarketData = [
  {
    name: "S&P 500",
    ticker: "SPY",
    price: 5192.24,
    change: 38.52,
    changePercent: 0.75,
    volume: 2874523
  },
  {
    name: "Nasdaq",
    ticker: "QQQ",
    price: 16298.87,
    change: 156.32,
    changePercent: 0.97,
    volume: 3874521
  },
  {
    name: "Dow Jones",
    ticker: "DIA",
    price: 38675.42,
    change: 214.76,
    changePercent: 0.56,
    volume: 1987452
  },
  {
    name: "Bitcoin",
    ticker: "BTC-USD",
    price: 69842.18,
    change: 1587.34,
    changePercent: 2.33,
    volume: 4587621
  }
];

// Mock stock data for different sectors
export const mockStockData: StockData[] = [
  // Technology
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.35, changePercent: 1.33, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 403.78, change: 3.45, changePercent: 0.86, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.34, change: 1.87, changePercent: 1.09, sector: 'Technology' },
  
  // Financial
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 197.45, change: 0.68, changePercent: 0.35, sector: 'Financial Services' },
  { symbol: 'BAC', name: 'Bank of America Corp.', price: 37.92, change: -0.28, changePercent: -0.73, sector: 'Financial Services' },
  
  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.67, change: -1.23, changePercent: -0.80, sector: 'Healthcare' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.12, change: 0.34, changePercent: 1.22, sector: 'Healthcare' },
  
  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 114.98, change: -0.87, changePercent: -0.75, sector: 'Energy' },
  
  // Consumer
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75, change: 1.87, changePercent: 1.06, sector: 'Consumer Cyclical' },
  { symbol: 'KO', name: 'Coca-Cola Company', price: 60.87, change: 0.23, changePercent: 0.38, sector: 'Consumer Defensive' }
];

// Example predictions
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
    aiConfidence: 0.78,
    aiAnalysis: {
      supporting: ["Recent product launches", "Strong revenue growth"],
      counter: ["Supply chain challenges", "Market saturation"],
      reasoning: "While Apple has shown strong revenue growth, supply chain challenges may impact short-term performance."
    },
    timeframe: "1w",
    startingValue: 165.23,
    endValue: 174.56,
    percentChange: 5.65,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "bullish",
    winner: "user",
    points: 15
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
    aiConfidence: 0.92,
    aiAnalysis: {
      supporting: ["Cloud business growth", "AI investments"],
      counter: ["Competition in cloud space", "Potential regulatory challenges"],
      reasoning: "Microsoft's strong cloud business and AI investments are likely to drive growth."
    },
    timeframe: "1w",
    startingValue: 395.24,
    endValue: 403.78,
    percentChange: 2.16,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "bullish",
    winner: "both",
    points: 10
  },
  {
    id: "pred-3",
    userId: "user-1",
    targetType: "stock",
    targetName: "JPMorgan Chase & Co.",
    ticker: "JPM",
    predictionType: "trend",
    userPrediction: "bearish",
    aiPrediction: "bullish",
    aiConfidence: 0.68,
    aiAnalysis: {
      supporting: ["Strong financial performance", "Interest rate environment"],
      counter: ["Potential economic slowdown", "Credit risk exposure"],
      reasoning: "Despite potential economic headwinds, JPMorgan's strong financial position will likely lead to positive performance."
    },
    timeframe: "1w",
    startingValue: 198.34,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending"
  }
];