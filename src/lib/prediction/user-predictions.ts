
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
export async function getUserPredictions(status?: 'pending' | 'complete' | 'completed'): Promise<Prediction[]> {
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
    
    // Return mock data that matches the Prediction type structure
    return Array.from({ length: 5 }).map((_, index) => ({
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id,
      ticker: ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL'][index % 5],
      targetName: ['Apple Inc.', 'Tesla Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Alphabet Inc.'][index % 5],
      targetType: 'stock',
      predictionType: index % 2 === 0 ? 'trend' : 'price' as 'trend' | 'price',
      userPrediction: index % 2 === 0 ? (index % 4 === 0 ? 'uptrend' : 'downtrend') : `$${150 + index * 5}`,
      aiPrediction: index % 2 === 0 ? (index % 3 === 0 ? 'uptrend' : 'downtrend') : `$${150 + index * 4}`,
      aiConfidence: 70 + Math.floor(Math.random() * 20) / 10,
      timeframe: ['1d', '1w', '2w', '1m', '3m'][index % 5],
      startingValue: 150 + index * 2,
      endValue: status === 'complete' || status === 'completed' ? 150 + index * 2 + (Math.random() * 10 - 5) : undefined,
      status: status || (index % 3 === 0 ? 'complete' : 'pending'),
      outcome: status === 'complete' || status === 'completed' ? ['user_win', 'ai_win', 'tie'][index % 3] as 'user_win' | 'ai_win' | 'tie' : undefined,
      points: status === 'complete' || status === 'completed' ? Math.floor(Math.random() * 20) : undefined,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      resolvesAt: new Date(Date.now() + 86400000).toISOString(),
      resolvedAt: status === 'complete' || status === 'completed' ? new Date().toISOString() : undefined,
      aiAnalysis: {
        reasoning: "Based on technical indicators and market sentiment analysis, this prediction has a strong likelihood of success.",
        supporting: [
          "Strong technical indicators show bullish trend continuation",
          "Recent earnings reports exceeded market expectations",
          "Institutional investors have increased their positions"
        ],
        counter: [
          "Market volatility could impact short-term performance",
          "Sector rotation might temporarily affect price action",
          "Macroeconomic uncertainty remains a concern"
        ]
      },
      // Compatibility properties
      stockName: ['Apple Inc.', 'Tesla Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Alphabet Inc.'][index % 5],
      startPrice: 150 + index * 2,
      endPrice: status === 'complete' || status === 'completed' ? 150 + index * 2 + (Math.random() * 10 - 5) : undefined,
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
