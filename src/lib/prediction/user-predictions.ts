
/**
 * Handles fetching and managing user predictions
 */

import { supabase } from '../supabase';
import { DEV_USER } from '../dev-mode';
import { Prediction } from './types';

// Dev mode flag
const USE_DEV_MODE = true;

/**
 * Get user predictions
 */
export async function getUserPredictions(status?: 'pending' | 'completed'): Promise<Prediction[]> {
  try {
    // Get current user (use dev user in dev mode)
    let user;
    if (USE_DEV_MODE) {
      user = DEV_USER;
      console.log('🧪 Development mode: Using dev user for getting predictions');
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      user = userData.user;
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
      userId: user.id,
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
