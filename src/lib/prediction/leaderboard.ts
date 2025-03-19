
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
    return data.map((entry, index) => dbToLeaderboardEntry(entry, index));
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
    
    return dbToUserStats(data);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}
