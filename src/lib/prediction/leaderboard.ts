
/**
 * Handles leaderboard functionality
 */

import { supabase } from '../supabase';
import { DEV_USER } from '../dev-mode';
import { LeaderboardEntry, UserStats } from './types';

// Dev mode flag
const USE_DEV_MODE = true;

/**
 * Get leaderboard data
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    /* In a real implementation, we would fetch from Supabase
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('totalPoints', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    return data;
    */
    
    // Return mock data with corrected properties to match LeaderboardEntry type
    return Array.from({ length: 20 }).map((_, index) => ({
      userId: Math.random().toString(36).substring(2, 15),
      username: [
        'InvestorPro', 'MarketGuru', 'StockWhisperer', 'WallStWizard', 'BullishTrader',
        'AlphaBrain', 'BetaBuilder', 'MarketMaster', 'WealthWisdom', 'TrendTracker',
        'ProfitProphet', 'StockSage', 'ValueVenture', 'WealthWarrior', 'MarketMogul',
        'TradingTitan', 'StockStrategist', 'PortfolioPro', 'ReturnRanger', 'EquityExpert'
      ][index],
      points: 1000 - index * 40 + Math.floor(Math.random() * 30),
      winRate: 70 - index * 1.5 + Math.random() * 5,
      predictionsCount: 50 - index + Math.floor(Math.random() * 10),
      winCount: Math.floor((50 - index) * (70 - index * 1.5) / 100),
      accuracy: (70 - index * 1.5 + Math.random() * 5) / 100,
      rank: index + 1,
      vsAI: {
        wins: Math.floor((50 - index) * 0.4),
        losses: Math.floor((50 - index) * 0.3),
        winRate: 0.6 - (index * 0.01)
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
      if (USE_DEV_MODE) {
        // In dev mode, use dev user
        userId = DEV_USER.id;
        console.log('🧪 Development mode: Using dev user for stats');
      } else {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("User not authenticated");
        }
        userId = userData.user.id;
      }
    }
    
    /* In a real implementation, we would fetch from Supabase
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('userId', userId)
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    // Return mock data
    return {
      totalPredictions: 47,
      completedPredictions: 42,
      pendingPredictions: 5,
      totalPoints: 560,
      winRate: 62,
      winStreak: 3,
      bestWinStreak: 7,
      aiVictories: 14,
      userVictories: 26,
      ties: 2
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}
