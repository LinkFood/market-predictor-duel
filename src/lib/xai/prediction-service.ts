
/**
 * X.ai Prediction Service
 * Handles stock prediction functionality using X.ai API through Supabase edge function
 */

import { FEATURES } from '../config';
import { StockPredictionRequest, StockPredictionResponse } from './types';
import { getMockPrediction } from './mock-data';
import { supabase } from '@/integrations/supabase/client';
import { logError, showErrorToast } from '../error-handling';
import { enhancePrediction } from '../analysis/prediction-learner';

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

        // Ensure we have confidence score (number between 0-100)
        let confidence = data.confidence;
        if (typeof confidence === 'string') {
          confidence = parseInt(confidence, 10);
        }
        
        if (isNaN(confidence) || confidence === undefined) {
          console.warn('Missing confidence score, using default 80');
          confidence = 80;
        }
        
        // Normalize field names for consistency
        // Convert supportingPoints to supporting if needed
        let supporting = data.supportingPoints || data.supporting || [];
        if (!Array.isArray(supporting) || supporting.length === 0) {
          console.warn('Missing supporting points, using default');
          supporting = [
            "Technical indicators suggest this direction",
            "Recent price action supports this view",
            "Market sentiment aligns with this prediction"
          ];
        }
        
        // Convert counterPoints to counter if needed
        let counter = data.counterPoints || data.counter || [];
        if (!Array.isArray(counter) || counter.length === 0) {
          console.warn('Missing counter points, using default');
          counter = [
            "Market volatility is a risk factor",
            "External economic events could impact this prediction",
            "Sector-specific challenges may arise"
          ];
        }
        
        // Enhance the prediction confidence using our learning system
        const enhancedConfidence = await enhancePrediction(
          request.ticker,
          request.timeframe,
          request.predictionType,
          confidence
        );
        
        console.log(`Enhanced confidence for ${request.ticker}: ${confidence} → ${enhancedConfidence}`);
        
        return {
          prediction: data.prediction,
          confidence: enhancedConfidence,
          originalConfidence: confidence, // Store original for comparison
          rationale: data.rationale || data.reasoning || "Based on market analysis, the AI has made this prediction.",
          supportingPoints: supporting,
          counterPoints: counter,
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
