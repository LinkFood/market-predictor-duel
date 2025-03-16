
/**
 * Handles creating new predictions
 */

import { supabase } from '../supabase';
import { getStockPrediction } from '../xai-service';
import { getStockData } from '../market';
import { DEV_USER } from '../dev-mode';
import { Prediction, PredictionRequest } from './types';

// Dev mode flag
const USE_DEV_MODE = true;

/**
 * Create a new prediction
 */
export async function createPrediction(request: PredictionRequest): Promise<Prediction> {
  try {
    // Get current user (use dev user in dev mode)
    let user;
    if (USE_DEV_MODE) {
      user = DEV_USER;
      console.log('🧪 Development mode: Using dev user for prediction creation');
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      user = userData.user;
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
      userId: user.id,
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
