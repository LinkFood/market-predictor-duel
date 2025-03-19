
/**
 * Handles leaderboard functionality
 */

import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry, UserStats } from './types';
import { dbToLeaderboardEntry, dbToUserStats } from './adapters';

/**
 * Get leaderboard data
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // Try to fetch user stats joined with profiles to get usernames
    const { data: joinedData, error: joinError } = await supabase
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
    
    // If join failed, try to just get user stats
    if (joinError) {
      console.error("Error joining user_stats with profiles:", joinError);
      
      // Fetch user stats without the join
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(20);
      
      if (statsError) throw statsError;
      
      // Transform the data without profile information
      return statsData.map((entry, index) => {
        return dbToLeaderboardEntry({
          ...entry,
          profiles: { username: `User ${index + 1}`, avatar_url: null }
        }, index);
      });
    }
    
    // If join succeeded, transform the data
    return joinedData.map((entry, index) => dbToLeaderboardEntry(entry, index));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return []; // Return empty array to prevent UI errors
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
    
    if (error) {
      // If no stats found, return default stats
      if (error.code === 'PGRST116') {
        return {
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
      }
      throw error;
    }
    
    return dbToUserStats(data);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Return default stats to prevent UI errors
    return {
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
  }
}
