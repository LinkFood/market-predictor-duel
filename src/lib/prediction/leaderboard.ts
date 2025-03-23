
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
    // Fetch user stats and join with profiles table
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_predictions,
        correct_predictions,
        wins_against_ai,
        losses_against_ai,
        total_points
      `)
      .order('total_points', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    // Get usernames for each user
    const enrichedData = await Promise.all(
      data.map(async (stat, index) => {
        // Get profile data for each user
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', stat.user_id)
          .single();
        
        // Create a combined object with profile data
        return dbToLeaderboardEntry({
          ...stat,
          profiles: profileData || { username: `User ${index + 1}`, avatar_url: null }
        }, index);
      })
    );
    
    return enrichedData;
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
