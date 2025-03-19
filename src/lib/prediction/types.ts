
/**
 * Prediction types
 */

// Request to create a new prediction
export interface PredictionRequest {
  ticker: string;
  predictionType: 'trend' | 'price';
  userPrediction: string;
  timeframe: string;
}

// Prediction data stored in the database
export interface Prediction {
  id: string;
  userId: string;
  ticker: string;
  targetName: string; 
  targetType: 'stock' | 'sector' | 'market';
  predictionType: 'trend' | 'price';
  userPrediction: string;
  aiPrediction: string;
  aiConfidence: number;
  timeframe: string;
  startingValue: number;
  endValue?: number;
  status: 'pending' | 'complete' | 'completed' | 'cancelled';
  points?: number;
  createdAt: string;
  resolvesAt: string;
  resolvedAt?: string;
  aiAnalysis: {
    reasoning: string;
    supporting: string[];
    counter: string[];
  };
  outcome?: 'user_win' | 'ai_win' | 'tie';
  stockName?: string; // For backward compatibility
  startPrice?: number; // For backward compatibility
  endPrice?: number; // For backward compatibility
  
  // Fields for backward compatibility with the existing application types
  target_name?: string;
  user_prediction?: string;
  ai_prediction?: string;
  prediction_type?: string;
  starting_value?: number;
  final_value?: number;
  created_at?: string;
  resolved_at?: string;
  ai_confidence?: number;
}

// Type for a resolved prediction with result
export interface ResolvedPrediction extends Prediction {
  status: 'complete' | 'completed';
  endValue: number;
  resolvedAt: string;
  result: 'win' | 'loss' | 'tie';
  points: number;
}

// Type for prediction statistics
export interface PredictionStats {
  total: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracy: number;
  vsAI: {
    wins: number;
    losses: number;
    ties: number;
    winRate: number;
  };
  byTimeframe: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
  totalPoints: number;
}

// Type for user statistics
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

// Type for leaderboard entries
export interface LeaderboardEntry {
  userId: string;
  username: string;
  predictionsCount: number;
  winCount: number;
  accuracy: number;
  points: number;
  vsAI: {
    wins: number;
    losses: number;
    winRate: number;
  };
  rank: number;
  // Add these for compatibility with existing code
  totalPoints?: number;
  winRate?: number;
  totalPredictions?: number;
  avatarUrl?: string;
  winRateAgainstAi?: number;
}
