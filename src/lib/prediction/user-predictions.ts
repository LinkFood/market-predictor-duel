
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
    
    if (!USE_DEV_MODE) {
      // Fetch from Supabase in production mode
      let query = supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform database field names to match our client-side model
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        ticker: item.ticker,
        targetName: item.stock_name,
        targetType: 'stock',
        predictionType: item.prediction_type,
        userPrediction: item.user_prediction,
        aiPrediction: item.ai_prediction,
        aiConfidence: item.confidence / 10, // Convert from 0-100 to 0-10 scale
        timeframe: item.timeframe,
        startingValue: item.start_price,
        endValue: item.end_price,
        status: item.status,
        outcome: item.outcome,
        points: item.points,
        createdAt: item.created_at,
        resolvesAt: item.resolves_at,
        resolvedAt: item.resolved_at,
        aiAnalysis: item.ai_analysis,
        // Compatibility properties
        stockName: item.stock_name,
        startPrice: item.start_price,
        endPrice: item.end_price,
      }));
    } else {
      // In dev mode, fetch from localStorage
      try {
        const storedPredictions = localStorage.getItem('dev_predictions');
        if (storedPredictions) {
          const predictions = JSON.parse(storedPredictions) as Prediction[];
          console.log('🧪 Development mode: Retrieved predictions from localStorage', predictions.length);
          
          // Filter by status if provided
          if (status) {
            return predictions.filter(p => p.status === status);
          }
          return predictions;
        }
      } catch (storageError) {
        console.error('Failed to retrieve predictions from localStorage:', storageError);
      }
      
      // Return mock data if nothing in localStorage
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
    if (!USE_DEV_MODE) {
      // In production mode, fetch from Supabase
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching prediction from Supabase:", error);
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        throw error;
      }
      
      // Transform database fields to match client model
      return {
        id: data.id,
        userId: data.user_id,
        ticker: data.ticker,
        targetName: data.stock_name,
        targetType: 'stock',
        predictionType: data.prediction_type,
        userPrediction: data.user_prediction,
        aiPrediction: data.ai_prediction,
        aiConfidence: data.confidence / 10, // Convert from 0-100 to 0-10 scale
        timeframe: data.timeframe,
        startingValue: data.start_price,
        endValue: data.end_price,
        status: data.status,
        outcome: data.outcome,
        points: data.points,
        createdAt: data.created_at,
        resolvesAt: data.resolves_at,
        resolvedAt: data.resolved_at,
        aiAnalysis: data.ai_analysis,
        // Compatibility properties
        stockName: data.stock_name,
        startPrice: data.start_price,
        endPrice: data.end_price,
      };
    } else {
      // In dev mode, fetch from localStorage
      try {
        const storedPredictions = localStorage.getItem('dev_predictions');
        if (storedPredictions) {
          const predictions = JSON.parse(storedPredictions) as Prediction[];
          const prediction = predictions.find(p => p.id === id);
          if (prediction) {
            console.log('🧪 Development mode: Retrieved prediction from localStorage', prediction.id);
            return prediction;
          }
        }
      } catch (storageError) {
        console.error('Failed to retrieve prediction from localStorage:', storageError);
      }
      
      // If not found in localStorage, return the first mock prediction
      const mockPredictions = await getUserPredictions();
      return mockPredictions[0];
    }
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
}
