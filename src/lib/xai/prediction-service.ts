
/**
 * X.ai Prediction Service
 * Handles stock prediction functionality using X.ai API through Supabase edge function
 */

import { FEATURES } from '../config';
import { StockPredictionRequest, StockPredictionResponse } from './types';
import { getMockPrediction } from './mock-data';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '../error-handling';

/**
 * Get an AI prediction for a stock
 */
export async function getStockPrediction(request: StockPredictionRequest): Promise<StockPredictionResponse> {
  try {
    // Check if AI analysis is enabled
    if (!FEATURES.enableAIAnalysis) {
      console.log('AI analysis is disabled. Returning mock prediction.');
      return getMockPrediction(request);
    }
    
    console.log('Fetching AI prediction for', request.ticker);
    
    // Call the Supabase edge function for prediction
    console.log('Calling xai-prediction edge function');
    const { data, error } = await supabase.functions.invoke('xai-prediction', {
      body: { 
        ticker: request.ticker,
        timeframe: request.timeframe,
        predictionType: request.predictionType,
        currentPrice: request.currentPrice
      }
    });

    if (error) {
      console.error('Error calling xai-prediction function:', error);
      throw error;
    }
    
    if (!data || !data.prediction) {
      console.error('Invalid response from xai-prediction function:', data);
      throw new Error('Invalid response from xai-prediction function');
    }
    
    console.log('Successfully received prediction from edge function:', data);
    
    // Ensure the prediction type is valid
    if (request.predictionType === 'trend' && 
        !['uptrend', 'downtrend'].includes(data.prediction)) {
      console.warn('Invalid trend prediction from API, normalizing:', data.prediction);
      data.prediction = data.prediction.toLowerCase().includes('up') || 
                        data.prediction.toLowerCase().includes('bull') ? 
                        'uptrend' : 'downtrend';
    }
    
    return {
      prediction: data.prediction,
      confidence: data.confidence || 80,
      rationale: data.rationale || data.reasoning || "Based on market analysis, the AI has made this prediction.",
      supportingPoints: data.supportingPoints || [],
      counterPoints: data.counterPoints || [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logError(error, "getStockPrediction");
    console.error("Error fetching AI prediction:", error);
    // Return mock data on error
    return getMockPrediction(request);
  }
}
