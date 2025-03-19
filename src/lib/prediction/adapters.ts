
/**
 * Adapters to convert between database and application data models
 */
import { Json } from "@/integrations/supabase/types";
import { Prediction, LeaderboardEntry, UserStats } from "./types";

/**
 * Convert database prediction record to application Prediction model
 */
export function dbToPrediction(dbPrediction: any): Prediction {
  return {
    id: dbPrediction.id,
    userId: dbPrediction.user_id,
    ticker: dbPrediction.ticker,
    targetName: dbPrediction.target_name,
    targetType: dbPrediction.target_type,
    predictionType: dbPrediction.prediction_type,
    userPrediction: dbPrediction.user_prediction,
    aiPrediction: dbPrediction.ai_prediction,
    aiConfidence: dbPrediction.ai_confidence,
    timeframe: dbPrediction.timeframe,
    startingValue: dbPrediction.starting_value,
    endValue: dbPrediction.final_value,
    status: dbPrediction.status,
    points: dbPrediction.points,
    createdAt: dbPrediction.created_at,
    resolvesAt: dbPrediction.resolves_at,
    resolvedAt: dbPrediction.resolved_at,
    aiAnalysis: dbPrediction.ai_analysis as {
      reasoning: string;
      supporting: string[];
      counter: string[];
    },
    outcome: dbPrediction.outcome,
    stockName: dbPrediction.target_name, // For backward compatibility
    startPrice: dbPrediction.starting_value, // For backward compatibility
    endPrice: dbPrediction.final_value, // For backward compatibility
  };
}

/**
 * Convert application Prediction model to database format for insert/update
 */
export function predictionToDb(prediction: Partial<Prediction>): Record<string, any> {
  const result: Record<string, any> = {};
  
  if (prediction.id !== undefined) result.id = prediction.id;
  if (prediction.userId !== undefined) result.user_id = prediction.userId;
  if (prediction.ticker !== undefined) result.ticker = prediction.ticker;
  if (prediction.targetName !== undefined) result.target_name = prediction.targetName;
  if (prediction.targetType !== undefined) result.target_type = prediction.targetType;
  if (prediction.predictionType !== undefined) result.prediction_type = prediction.predictionType;
  if (prediction.userPrediction !== undefined) result.user_prediction = prediction.userPrediction;
  if (prediction.aiPrediction !== undefined) result.ai_prediction = prediction.aiPrediction;
  if (prediction.aiConfidence !== undefined) result.ai_confidence = prediction.aiConfidence;
  if (prediction.timeframe !== undefined) result.timeframe = prediction.timeframe;
  if (prediction.startingValue !== undefined) result.starting_value = prediction.startingValue;
  if (prediction.endValue !== undefined) result.final_value = prediction.endValue;
  if (prediction.status !== undefined) result.status = prediction.status;
  if (prediction.points !== undefined) result.points = prediction.points;
  if (prediction.createdAt !== undefined) result.created_at = prediction.createdAt;
  if (prediction.resolvesAt !== undefined) result.resolves_at = prediction.resolvesAt;
  if (prediction.resolvedAt !== undefined) result.resolved_at = prediction.resolvedAt;
  if (prediction.aiAnalysis !== undefined) result.ai_analysis = prediction.aiAnalysis as Json;
  if (prediction.outcome !== undefined) result.outcome = prediction.outcome;
  
  return result;
}

/**
 * Convert database user stats record to application UserStats model
 */
export function dbToUserStats(dbStats: any): UserStats {
  return {
    totalPredictions: dbStats.total_predictions || 0,
    completedPredictions: dbStats.total_predictions || 0, // Since we only update stats when predictions are completed
    pendingPredictions: 0, // We'll calculate this separately
    totalPoints: dbStats.total_points || 0,
    winRate: dbStats.total_predictions > 0
      ? (dbStats.correct_predictions / dbStats.total_predictions) * 100 
      : 0,
    winStreak: dbStats.current_streak || 0,
    bestWinStreak: dbStats.best_streak || 0,
    aiVictories: dbStats.losses_against_ai || 0,
    userVictories: dbStats.wins_against_ai || 0,
    ties: dbStats.ties || 0,
  };
}

/**
 * Convert database leaderboard record to application LeaderboardEntry model
 */
export function dbToLeaderboardEntry(entry: any, index: number): LeaderboardEntry {
  return {
    userId: entry.user_id,
    username: entry.profiles?.username || `User ${index + 1}`,
    avatarUrl: entry.profiles?.avatar_url,
    points: entry.total_points || 0,
    totalPoints: entry.total_points || 0, // For backward compatibility
    totalPredictions: entry.total_predictions || 0,
    predictionsCount: entry.total_predictions || 0,
    winCount: entry.correct_predictions || 0,
    accuracy: entry.total_predictions > 0
      ? (entry.correct_predictions / entry.total_predictions)
      : 0,
    winRate: entry.total_predictions > 0
      ? (entry.correct_predictions / entry.total_predictions)
      : 0,
    winRateAgainstAi: (entry.wins_against_ai + entry.losses_against_ai) > 0
      ? (entry.wins_against_ai / (entry.wins_against_ai + entry.losses_against_ai))
      : 0,
    rank: index + 1,
    vsAI: {
      wins: entry.wins_against_ai || 0,
      losses: entry.losses_against_ai || 0,
      winRate: (entry.wins_against_ai + entry.losses_against_ai) > 0
        ? (entry.wins_against_ai / (entry.wins_against_ai + entry.losses_against_ai))
        : 0
    }
  };
}
