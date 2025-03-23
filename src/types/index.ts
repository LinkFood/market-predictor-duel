
export type PredictionTimeframe = "1d" | "1w" | "1m";
export type PredictionCategory = "market" | "sector" | "stock";
export type PredictionDirection = "bullish" | "bearish" | "uptrend" | "downtrend";
export type PredictionStatus = "pending" | "complete" | "completed" | "cancelled";
export type PredictionWinner = "user" | "ai" | "both" | "neither";

// Using properties from both old and new prediction models to ensure compatibility
export interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  totalPredictions: number;
  correctPredictions: number;
  winsAgainstAi: number;
  lossesAgainstAi: number;
  ties: number;
  currentStreak: number;
  bestStreak: number;
  points: number;
  createdAt: string;
  lastLogin?: string;
  // For compatibility with Supabase Auth
  user_metadata?: Record<string, any>;
  created_at?: string;
}

export interface Prediction {
  id: string;
  userId: string;
  targetType: PredictionCategory;
  targetName: string;
  userPrediction: PredictionDirection;
  aiPrediction: PredictionDirection;
  aiConfidence: number;
  aiAnalysis: {
    supporting: string[];
    counter: string[];
    reasoning: string;
  };
  timeframe: PredictionTimeframe;
  startingValue: number;
  createdAt: string;
  resolvesAt: string;
  status: PredictionStatus;
  finalValue?: number;
  endValue?: number;
  percentChange?: number;
  percent_change?: number;
  actualResult?: PredictionDirection;
  actual_result?: string;
  winner?: PredictionWinner;
  resolvedAt?: string;
  outcome?: "user_win" | "ai_win" | "tie";
  points?: number;
  
  // Required fields
  ticker: string;
  predictionType: "trend" | "price";
  
  // Legacy fields
  stockName?: string;
  startPrice?: number;
  endPrice?: number;
  user_prediction?: string;
  ai_prediction?: string;
  ai_confidence?: number;
  target_name?: string;
  starting_value?: number;
  final_value?: number; 
  created_at?: string;
  resolved_at?: string;
  prediction_type?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  points: number;
  totalPredictions: number;
  accuracy: number;
  winRateAgainstAi: number;
  rank: number;
}

export interface MarketData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  symbol?: string;
}

export interface GlobalStats {
  totalPredictions: number;
  aiWins: number;
  humanWins: number;
  ties: number;
  marketPredictions: number;
  sectorPredictions: number;
  stockPredictions: number;
  totalDuels: number;
  humansWon: number;
  aiWon: number;
  humanWinRate: number;
  humanTrendAccuracy?: number;
  aiTrendAccuracy?: number;
  recentHumanAdvantage?: number;
  topHumanScore: number;
  topAiScore?: number;
}
