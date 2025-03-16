
export type PredictionTimeframe = "1d" | "1w" | "1m";
export type PredictionCategory = "market" | "sector" | "stock";
export type PredictionDirection = "bullish" | "bearish";
export type PredictionStatus = "pending" | "correct" | "incorrect";
export type PredictionWinner = "user" | "ai" | "both" | "neither";

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
  resolved: boolean;
  finalValue?: number;
  percentChange?: number;
  actualResult?: PredictionDirection;
  winner?: PredictionWinner;
  resolvedAt?: string;
  status?: PredictionStatus;
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
}

export interface GlobalStats {
  totalPredictions: number;
  aiWins: number;
  humanWins: number;
  ties: number;
  marketPredictions: number;
  sectorPredictions: number;
  stockPredictions: number;
}
