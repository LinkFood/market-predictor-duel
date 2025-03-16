
/**
 * Type definitions for the prediction module
 */

export interface Prediction {
  id: string;
  userId: string;
  ticker: string;
  stockName: string;
  predictionType: 'price' | 'trend';
  userPrediction: string;
  aiPrediction: string;
  confidence: number;
  timeframe: string;
  startPrice: number;
  endPrice?: number;
  status: 'pending' | 'completed';
  outcome?: 'user_win' | 'ai_win' | 'tie';
  points?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface PredictionRequest {
  ticker: string;
  predictionType: 'price' | 'trend';
  userPrediction: string;
  timeframe: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  winRate: number;
  predictions: number;
}

export interface UserStats {
  totalPredictions: number;
  completedPredictions: number;
  pendingPredictions: number;
  totalPoints: number;
  winRate: number;
  winStreak: number;
  bestWinStreak: number;
  aiVictories: number;
  userVictories: number;
  ties: number;
}
