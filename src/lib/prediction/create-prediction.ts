/**
 * Handles creating new predictions
 */

import { supabase } from '@/integrations/supabase/client';
import { getStockPrediction } from '../xai-service';
import { getStockData } from '../market';
import { Prediction, PredictionRequest } from './types';
import { toast } from '@/hooks/use-toast';
import { dbToPrediction } from './adapters';

/**
 * Create a new prediction
 */
export async function createPrediction(request: PredictionRequest): Promise<Prediction> {
  try {
    console.log('Creating prediction for', request);
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Get current stock data
    const stockData = await getStockData(request.ticker);
    console.log('Stock data retrieved:', stockData);
    
    // Get AI prediction
    const aiPredictionResult = await getStockPrediction({
      ticker: request.ticker,
      timeframe: request.timeframe,
      predictionType: request.predictionType,
      currentPrice: stockData.price
    });
    
    console.log('AI prediction generated:', aiPredictionResult);
    
    // Calculate resolves date based on timeframe
    const resolvesAt = calculateResolvesAt(request.timeframe);
    
    // Generate AI analysis with safe defaults if properties don't exist
    const aiAnalysis = {
      reasoning: aiPredictionResult.reasoning || "Based on market analysis, this prediction has a reasonable likelihood of success.",
      supporting: aiPredictionResult.supportingPoints || ["Technical indicators suggest this direction", "Recent price action supports this view"],
      counter: aiPredictionResult.counterPoints || ["Market volatility is a risk factor", "External events could change the trajectory"]
    };
    
    // Create prediction record in database
    const newPredictionData = {
      user_id: userData.user.id,
      ticker: request.ticker,
      target_name: stockData.name,
      target_type: 'stock',
      prediction_type: request.predictionType,
      user_prediction: request.userPrediction,
      ai_prediction: aiPredictionResult.prediction,
      ai_confidence: (aiPredictionResult.confidence || 80) / 10, // Scale from 0-100 to 0-10, default to 80 if missing
      timeframe: request.timeframe,
      starting_value: stockData.price,
      status: 'pending',
      resolves_at: resolvesAt,
      ai_analysis: aiAnalysis
    };
    
    const { data, error } = await supabase
      .from('predictions')
      .insert(newPredictionData)
      .select()
      .single();
    
    if (error) throw error;
    
    return dbToPrediction(data);
  } catch (error) {
    console.error("Error creating prediction:", error);
    toast({
      variant: "destructive",
      title: "Error creating prediction",
      description: "Please try again later."
    });
    throw error;
  }
}

// Helper to calculate the resolves at date based on timeframe
function calculateResolvesAt(timeframe: string): string {
  const now = new Date();
  let resolveDate = new Date(now);
  
  switch(timeframe) {
    case '1d':
      resolveDate.setDate(now.getDate() + 1);
      break;
    case '1w':
      resolveDate.setDate(now.getDate() + 7);
      break;
    case '1m':
      resolveDate.setMonth(now.getMonth() + 1);
      break;
    case '3m':
      resolveDate.setMonth(now.getMonth() + 3);
      break;
    default:
      resolveDate.setDate(now.getDate() + 1);
  }
  
  return resolveDate.toISOString();
}
