
/**
 * Handles leaderboard functionality
 */

import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry, UserStats } from './types';

/**
 * Get leaderboard data
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // Fetch user stats joined with profiles to get usernames
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_predictions,
        correct_predictions,
        wins_against_ai,
        losses_against_ai,
        total_points,
        profiles(username, avatar_url)
      `)
      .order('total_points', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    // Transform the data to match LeaderboardEntry type
    return data.map((entry, index) => ({
      userId: entry.user_id,
      username: entry.profiles.username || `User ${index + 1}`,
      avatarUrl: entry.profiles.avatar_url,
      points: entry.total_points,
      totalPredictions: entry.total_predictions,
      accuracy: entry.total_predictions > 0 
        ? (entry.correct_predictions / entry.total_predictions) 
        : 0,
      winRateAgainstAi: (entry.wins_against_ai + entry.losses_against_ai) > 0 
        ? (entry.wins_against_ai / (entry.wins_against_ai + entry.losses_against_ai)) 
        : 0,
      rank: index + 1,
      predictionsCount: entry.total_predictions,
      winCount: entry.correct_predictions,
      vsAI: {
        wins: entry.wins_against_ai,
        losses: entry.losses_against_ai,
        winRate: (entry.wins_against_ai + entry.losses_against_ai) > 0 
          ? (entry.wins_against_ai / (entry.wins_against_ai + entry.losses_against_ai)) 
          : 0
      }
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId?: string): Promise<UserStats> {
  try {
    // Get current user if no userId is provided
    if (!userId) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      userId = userData.user.id;
    }
    
    // Fetch user stats from database
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      totalPredictions: data.total_predictions,
      completedPredictions: data.total_predictions, // Since we only update stats when predictions are completed
      pendingPredictions: 0, // We'll calculate this separately
      totalPoints: data.total_points,
      winRate: data.total_predictions > 0 
        ? (data.correct_predictions / data.total_predictions) * 100 
        : 0,
      winStreak: data.current_streak,
      bestWinStreak: data.best_streak,
      aiVictories: data.losses_against_ai,
      userVictories: data.wins_against_ai,
      ties: data.ties
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}
