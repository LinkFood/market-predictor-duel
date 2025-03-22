
/**
 * X.ai Prediction Service
 * Handles stock prediction functionality using X.ai API through Supabase edge function
 */

import { FEATURES } from '../config';
import { StockPredictionRequest, StockPredictionResponse } from './types';
import { getMockPrediction } from './mock-data';
import { supabase } from '@/integrations/supabase/client';
import { logError, showErrorToast } from '../error-handling';

// Number of retries for API calls
const MAX_RETRIES = 2;

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
    
    // Try to get prediction with retries
    let lastError = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt} for prediction`);
        }
        
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
          lastError = error;
          // Continue to retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        if (!data || !data.prediction) {
          console.error('Invalid response from xai-prediction function:', data);
          
          // If we got an error message in the response
          if (data?.error) {
            console.error('Error from edge function:', data.error);
            lastError = new Error(data.error);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          lastError = new Error('Invalid response from xai-prediction function');
          // Continue to retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
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
      } catch (retryError) {
        console.error(`Error on attempt ${attempt}:`, retryError);
        lastError = retryError;
        
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If we got here, all retries failed
    throw lastError || new Error('Failed to get prediction after multiple attempts');
  } catch (error) {
    logError(error, "getStockPrediction");
    console.error("Error fetching AI prediction:", error);
    
    // Check if we should show a specific error message to the user
    if (error.message && error.message.includes('API key')) {
      showErrorToast({
        title: "AI Prediction Error",
        description: "API key configuration issue. Using simulated prediction data instead."
      });
    } else {
      showErrorToast({
        title: "AI Prediction Error",
        description: "Could not generate prediction. Using simulated data instead."
      });
    }
    
    // Return mock data on error
    console.log('Falling back to mock prediction');
    return getMockPrediction(request);
  }
}

/**
 * Test X.ai API connection
 */
export async function testXaiApiConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('Testing X.ai API connection');
    const { data, error } = await supabase.functions.invoke('test-api-connection');
    
    if (error) {
      console.error('Error testing X.ai API:', error);
      return {
        success: false,
        message: `Error testing API: ${error.message}`
      };
    }
    
    console.log('API test results:', data);
    
    return {
      success: data.success,
      message: data.success ? 'API connection successful' : 'API connection failed',
      details: data
    };
  } catch (error) {
    console.error('Error testing X.ai API connection:', error);
    return {
      success: false,
      message: `Exception testing API: ${error.message}`
    };
  }
}
