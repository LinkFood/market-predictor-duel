/**
 * Prediction Service
 * Handles all operations related to user predictions and AI competitions
 */

import { supabase } from './supabase';
import { getStockPrediction } from './xai-service';
import { getStockData } from './market-data-service';

// Types
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

/**
 * Create a new prediction
 */
export async function createPrediction(request: PredictionRequest): Promise<Prediction> {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Get current stock data
    const stockData = await getStockData(request.ticker);
    
    // Get AI prediction
    const aiPredictionResult = await getStockPrediction({
      ticker: request.ticker,
      timeframe: request.timeframe,
      predictionType: request.predictionType,
      currentPrice: stockData.price
    });
    
    // Create the prediction record
    const newPrediction: Omit<Prediction, 'id'> = {
      userId: userData.user.id,
      ticker: request.ticker,
      stockName: stockData.name,
      predictionType: request.predictionType,
      userPrediction: request.userPrediction,
      aiPrediction: aiPredictionResult.prediction,
      confidence: aiPredictionResult.confidence,
      timeframe: request.timeframe,
      startPrice: stockData.price,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // For now, we'll mock the database insertion and return a prediction with an ID
    // In a real implementation, we would insert this into Supabase
    /* 
    const { data, error } = await supabase
      .from('predictions')
      .insert(newPrediction)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    // Return mock data
    return {
      ...newPrediction,
      id: Math.random().toString(36).substring(2, 15)
    };
  } catch (error) {
    console.error("Error creating prediction:", error);
    throw error;
  }
}

/**
 * Get user predictions
 */
export async function getUserPredictions(status?: 'pending' | 'completed'): Promise<Prediction[]> {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    /* In a real implementation, we would fetch from Supabase
    let query = supabase
      .from('predictions')
      .select('*')
      .eq('userId', userData.user.id)
      .order('createdAt', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
    */
    
    // Return mock data
    return Array.from({ length: 5 }).map((_, index) => ({
      id: Math.random().toString(36).substring(2, 15),
      userId: userData.user.id,
      ticker: ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL'][index % 5],
      stockName: ['Apple Inc.', 'Tesla Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Alphabet Inc.'][index % 5],
      predictionType: index % 2 === 0 ? 'trend' : 'price' as 'trend' | 'price',
      userPrediction: index % 2 === 0 ? (index % 4 === 0 ? 'uptrend' : 'downtrend') : `$${150 + index * 5}`,
      aiPrediction: index % 2 === 0 ? (index % 3 === 0 ? 'uptrend' : 'downtrend') : `$${150 + index * 4}`,
      confidence: 70 + Math.floor(Math.random() * 20),
      timeframe: ['1d', '1w', '2w', '1m', '3m'][index % 5],
      startPrice: 150 + index * 2,
      endPrice: status === 'completed' ? 150 + index * 2 + (Math.random() * 10 - 5) : undefined,
      status: status || (index % 3 === 0 ? 'completed' : 'pending'),
      outcome: status === 'completed' ? ['user_win', 'ai_win', 'tie'][index % 3] as 'user_win' | 'ai_win' | 'tie' : undefined,
      points: status === 'completed' ? Math.floor(Math.random() * 20) : undefined,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      resolvedAt: status === 'completed' ? new Date().toISOString() : undefined
    }));
  } catch (error) {
    console.error("Error fetching user predictions:", error);
    throw error;
  }
}

/**
 * Get a single prediction by ID
 */
export async function getPredictionById(id: string): Promise<Prediction | null> {
  try {
    /* In a real implementation, we would fetch from Supabase
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    // Return mock data
    const mockPredictions = await getUserPredictions();
    return mockPredictions[0]; // Just return the first mock prediction
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
}

/**
 * Resolve a prediction (determine the outcome)
 * Note: In a real application, this would likely be handled by a backend job
 */
export async function resolvePrediction(id: string): Promise<Prediction> {
  try {
    // Get the prediction
    const prediction = await getPredictionById(id);
    if (!prediction) {
      throw new Error("Prediction not found");
    }
    
    // Get current stock data
    const stockData = await getStockData(prediction.ticker);
    
    // Determine the outcome
    let outcome: 'user_win' | 'ai_win' | 'tie';
    let points = 0;
    
    // For price predictions, we'll determine if the prediction is closer to the actual price
    if (prediction.predictionType === 'price') {
      const actualPrice = stockData.price;
      const userPredictionPrice = parseFloat(prediction.userPrediction.replace('$', ''));
      const aiPredictionPrice = parseFloat(prediction.aiPrediction.replace('$', ''));
      
      const userDifference = Math.abs(userPredictionPrice - actualPrice);
      const aiDifference = Math.abs(aiPredictionPrice - actualPrice);
      
      if (userDifference < aiDifference) {
        outcome = 'user_win';
        points = 20;
      } else if (aiDifference < userDifference) {
        outcome = 'ai_win';
        points = 0;
      } else {
        outcome = 'tie';
        points = 10;
      }
    }
    // For trend predictions, determine if the trend prediction was correct
    else {
      const actualTrend = stockData.change >= 0 ? 'uptrend' : 'downtrend';
      const userCorrect = prediction.userPrediction === actualTrend;
      const aiCorrect = prediction.aiPrediction === actualTrend;
      
      if (userCorrect && !aiCorrect) {
        outcome = 'user_win';
        points = 20;
      } else if (!userCorrect && aiCorrect) {
        outcome = 'ai_win';
        points = 0;
      } else if (userCorrect && aiCorrect) {
        outcome = 'tie';
        points = 10;
      } else {
        outcome = 'tie';
        points = 5; // Both wrong
      }
    }
    
    // Update the prediction
    const updatedPrediction: Prediction = {
      ...prediction,
      status: 'completed',
      endPrice: stockData.price,
      outcome,
      points,
      resolvedAt: new Date().toISOString()
    };
    
    /* In a real implementation, we would update in Supabase
    const { data, error } = await supabase
      .from('predictions')
      .update(updatedPrediction)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    return updatedPrediction;
  } catch (error) {
    console.error("Error resolving prediction:", error);
    throw error;
  }
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(): Promise<{ userId: string; username: string; totalPoints: number; winRate: number; predictions: number; }[]> {
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
    
    // Return mock data
    return Array.from({ length: 20 }).map((_, index) => ({
      userId: Math.random().toString(36).substring(2, 15),
      username: [
        'InvestorPro', 'MarketGuru', 'StockWhisperer', 'WallStWizard', 'BullishTrader',
        'AlphaBrain', 'BetaBuilder', 'MarketMaster', 'WealthWisdom', 'TrendTracker',
        'ProfitProphet', 'StockSage', 'ValueVenture', 'WealthWarrior', 'MarketMogul',
        'TradingTitan', 'StockStrategist', 'PortfolioPro', 'ReturnRanger', 'EquityExpert'
      ][index],
      totalPoints: 1000 - index * 40 + Math.floor(Math.random() * 30),
      winRate: 70 - index * 1.5 + Math.random() * 5,
      predictions: 50 - index + Math.floor(Math.random() * 10)
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId?: string): Promise<{
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
}> {
  try {
    // Get current user if no userId is provided
    if (!userId) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      userId = userData.user.id;
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