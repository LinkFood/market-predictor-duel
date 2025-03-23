
/**
 * Data adapters for converting database data to application types
 */

import { LeaderboardEntry, Prediction, UserStats } from './types';

/**
 * Convert database prediction to application Prediction type
 */
export function dbToPrediction(data: any): Prediction {
  return {
    id: data.id,
    userId: data.user_id,
    ticker: data.ticker,
    predictionType: data.prediction_type,
    timeframe: data.timeframe,
    startingValue: data.starting_value,
    userPrediction: data.user_prediction,
    aiPrediction: data.ai_prediction,
    status: data.status,
    outcome: data.outcome,
    points: data.points,
    createdAt: data.created_at,
    resolvesAt: data.resolves_at,
    resolvedAt: data.resolved_at,
    endValue: data.final_value, // Changed from finalValue to endValue which exists in the Prediction type
    percentChange: data.percent_change,
    actualResult: data.actual_result
  };
}

/**
 * Convert database user stats to application UserStats type
 */
export function dbToUserStats(data: any): UserStats {
  if (!data) return {
    totalPredictions: 0,
    completedPredictions: 0,
    pendingPredictions: 0,
    totalPoints: 0,
    winRate: 0,
    winStreak: 0,
    bestWinStreak: 0,
    aiVictories: 0,
    userVictories: 0,
    ties: 0
  };

  // Calculate win rate
  const winRate = data.total_predictions > 0 
    ? (data.correct_predictions / data.total_predictions) * 100 
    : 0;

  return {
    totalPredictions: data.total_predictions || 0,
    completedPredictions: data.total_predictions || 0, // Will be updated with pendingPredictions if available
    pendingPredictions: 0, // Will be set by caller
    totalPoints: data.total_points || 0,
    winRate: Math.round(winRate),
    winStreak: data.current_streak || 0,
    bestWinStreak: data.best_streak || 0,
    aiVictories: data.wins_against_ai || 0,
    userVictories: data.losses_against_ai || 0, // This is confusing naming in the database
    ties: data.ties || 0
  };
}

/**
 * Convert database leaderboard entry to application LeaderboardEntry type
 */
export function dbToLeaderboardEntry(data: any, position: number): LeaderboardEntry {
  // Handle the case where profiles is a nested object (from a join)
  const profileData = data.profiles || {};
  
  // Calculate win rate
  const totalPredictions = data.total_predictions || 0;
  const correctPredictions = data.correct_predictions || 0;
  const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) : 0;

  return {
    userId: data.user_id,
    position: position + 1,
    username: profileData.username || `User ${position + 1}`,
    avatarUrl: profileData.avatar_url || null,
    totalPredictions: totalPredictions,
    accuracy: accuracy,
    points: data.total_points || 0,
    winsAgainstAI: data.wins_against_ai || 0,
    joinDate: null // We don't have this in the current data structure
  };
}
