
/**
 * Handles leaderboard functionality
 */

import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry, UserStats } from './types';
import { dbToLeaderboardEntry, dbToUserStats } from './adapters';
import { toast } from '@/hooks/use-toast';

/**
 * Get leaderboard data with detailed user information
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    console.log("Fetching leaderboard data...");
    
    // Fetch user stats with profile data in a single query
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_predictions,
        correct_predictions,
        wins_against_ai,
        losses_against_ai,
        total_points,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('total_points', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No leaderboard data returned");
      return [];
    }
    
    console.log(`Retrieved ${data.length} leaderboard entries`);
    
    // Transform the data
    const leaderboardEntries = data.map((entry, index) => 
      dbToLeaderboardEntry(entry, index)
    );
    
    return leaderboardEntries;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    toast({
      title: "Error loading leaderboard",
      description: "Could not load leaderboard data. Please try again later.",
      variant: "destructive"
    });
    return []; // Return empty array to prevent UI errors
  }
}

/**
 * Get user statistics with improved error handling
 */
export async function getUserStats(userId?: string): Promise<UserStats> {
  try {
    // Get current user if no userId is provided
    if (!userId) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting current user:", userError);
        throw userError;
      }
      
      if (!userData.user) {
        console.warn("No authenticated user found");
        throw new Error("User not authenticated");
      }
      
      userId = userData.user.id;
    }
    
    console.log(`Fetching stats for user: ${userId}`);
    
    // Fetch user stats from database
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_predictions,
        correct_predictions,
        wins_against_ai,
        losses_against_ai,
        ties,
        total_points,
        current_streak,
        best_streak
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no stats found, return default stats
      if (error.code === 'PGRST116') {
        console.log(`No stats found for user ${userId}, returning defaults`);
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
      
      console.error("Error fetching user stats:", error);
      throw error;
    }
    
    // Calculate additional stats
    const pendingPredictionsPromise = getPendingPredictionsCount(userId);
    
    // Get pending predictions count
    let pendingPredictions = 0;
    try {
      pendingPredictions = await pendingPredictionsPromise;
    } catch (error) {
      console.warn("Could not fetch pending predictions count:", error);
    }
    
    // Convert data to UserStats format
    const userStats = dbToUserStats(data);
    
    // Add pending predictions count
    userStats.pendingPredictions = pendingPredictions;
    
    return userStats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    toast({
      title: "Error loading user statistics",
      description: "Could not load your statistics. Please try again later.",
      variant: "destructive"
    });
    
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

/**
 * Get count of pending predictions for a user
 */
async function getPendingPredictionsCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('predictions')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'pending');
    
    if (error) {
      console.error("Error fetching pending predictions count:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getPendingPredictionsCount:", error);
    return 0;
  }
}

/**
 * Get user's rank on the leaderboard
 */
export async function getUserRank(userId: string): Promise<number | null> {
  try {
    // Get the rank by querying all users ordered by points
    const { data, error } = await supabase
      .from('user_stats')
      .select('user_id, total_points')
      .order('total_points', { ascending: false });
    
    if (error) {
      console.error("Error fetching user ranks:", error);
      return null;
    }
    
    // Find the index of the user
    const userIndex = data.findIndex(user => user.user_id === userId);
    
    // Return rank (1-based index)
    return userIndex === -1 ? null : userIndex + 1;
  } catch (error) {
    console.error("Error in getUserRank:", error);
    return null;
  }
}
