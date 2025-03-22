
/**
 * Handles creating new predictions
 */

import { supabase } from '@/integrations/supabase/client';
import { getStockPrediction } from '../xai';
import { getStockData } from '../market';
import { Prediction, PredictionRequest } from './types';
import { logError } from '../error-handling';
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
    const { data: stockData, usingMockData } = await getStockData(request.ticker);
    console.log('Stock data retrieved:', stockData, 'Using mock data:', usingMockData);
    
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
    
    // Generate AI analysis with supporting and counter points
    const aiAnalysis = {
      reasoning: aiPredictionResult.rationale || aiPredictionResult.reasoning || 
                "Based on market analysis, this prediction has a reasonable likelihood of success.",
      supporting: aiPredictionResult.supportingPoints || [
        "Technical indicators suggest this direction", 
        "Recent price action supports this view",
        "Market sentiment is favorable"
      ],
      counter: aiPredictionResult.counterPoints || [
        "Market volatility is a risk factor", 
        "External events could change the trajectory",
        "Potential for profit-taking could limit gains"
      ]
    };
    
    console.log('Processed AI analysis:', aiAnalysis);
    
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
    
    console.log('Saving prediction to database:', newPredictionData);
    
    // Add additional error handling and better logging for the insert operation
    const { data, error } = await supabase
      .from('predictions')
      .insert(newPredictionData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error inserting prediction:', error);
      throw new Error(`Failed to save prediction: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data returned from insert operation');
      throw new Error('Failed to save prediction: No data returned');
    }
    
    console.log('Prediction saved successfully:', data);
    
    // Convert the database record to our application model
    const prediction = dbToPrediction(data);
    console.log('Converted prediction:', prediction);
    
    return prediction;
  } catch (error) {
    logError(error, "createPrediction");
    console.error("Error creating prediction:", error);
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
    case '2w':
      resolveDate.setDate(now.getDate() + 14);
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
