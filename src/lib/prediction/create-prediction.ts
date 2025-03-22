
/**
 * Handles creating new predictions
 */

import { supabase } from '../supabase';
import { getStockPrediction } from '../xai-service';
import { getStockData } from '../market';
import { DEV_USER } from '../dev-mode';
import { Prediction, PredictionRequest } from './types';
import { toast } from '@/hooks/use-toast';

// Dev mode flag
const USE_DEV_MODE = true;

/**
 * Create a new prediction
 */
export async function createPrediction(request: PredictionRequest): Promise<Prediction> {
  try {
    console.log('Creating prediction for', request);
    
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
    console.log('Stock data retrieved:', stockData);
    
    // Get AI prediction
    const aiPredictionResult = await getStockPrediction({
      ticker: request.ticker,
      timeframe: request.timeframe,
      predictionType: request.predictionType,
      currentPrice: stockData.price
    });
    
    console.log('AI prediction generated:', aiPredictionResult);
    
    // Mock resolving date (using timeframe to calculate)
    const resolvesAt = calculateResolvesAt(request.timeframe);
    
    // Generate mock AI analysis (this would be part of the real AI response)
    const aiAnalysis = generateMockAnalysis(request.predictionType, aiPredictionResult.prediction);
    
    // Create the prediction record
    const newPrediction: Prediction = {
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id,
      ticker: request.ticker,
      targetName: stockData.name,
      targetType: 'stock',
      predictionType: request.predictionType,
      userPrediction: request.userPrediction,
      aiPrediction: aiPredictionResult.prediction,
      aiConfidence: aiPredictionResult.confidence / 10, // Scale from 0-100 to 0-10
      timeframe: request.timeframe,
      startingValue: stockData.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      resolvesAt,
      aiAnalysis
    };
    
    // Insert the prediction into Supabase
    console.log('Saving prediction to database:', newPrediction);
    
    if (!USE_DEV_MODE) {
      // In production mode, save to Supabase database
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          id: newPrediction.id,
          user_id: newPrediction.userId,
          ticker: newPrediction.ticker,
          stock_name: newPrediction.targetName,
          prediction_type: newPrediction.predictionType,
          user_prediction: newPrediction.userPrediction,
          ai_prediction: newPrediction.aiPrediction,
          confidence: newPrediction.aiConfidence * 10, // Convert back to 0-100 scale for DB
          timeframe: newPrediction.timeframe,
          start_price: newPrediction.startingValue,
          status: 'pending',
          created_at: newPrediction.createdAt,
          resolves_at: newPrediction.resolvesAt,
          ai_analysis: newPrediction.aiAnalysis
        });
      
      if (error) {
        console.error("Error inserting prediction into Supabase:", error);
        throw error;
      }
      
      console.log('Prediction saved to Supabase:', data);
    } else {
      // In dev mode, just log the prediction
      console.log('🧪 Development mode: Skipping database insertion for prediction', newPrediction.id);
      // Here we would typically save to a local storage or mock database
      // Store in localStorage to persist between page refreshes
      try {
        const existingPredictions = JSON.parse(localStorage.getItem('dev_predictions') || '[]');
        existingPredictions.push(newPrediction);
        localStorage.setItem('dev_predictions', JSON.stringify(existingPredictions));
        console.log('🧪 Development mode: Saved prediction to localStorage');
      } catch (storageError) {
        console.error('Failed to save prediction to localStorage:', storageError);
      }
    }
    
    return newPrediction;
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

// Generate mock AI analysis for demonstration
function generateMockAnalysis(predictionType: 'trend' | 'price', aiPrediction: string): {
  reasoning: string;
  supporting: string[];
  counter: string[];
} {
  const isBullish = predictionType === 'trend' 
    ? aiPrediction === 'uptrend' 
    : !aiPrediction.includes('-');
  
  return {
    reasoning: isBullish 
      ? "The combination of strong technical indicators, positive earnings reports, and increasing institutional interest suggests an upward movement is likely in the specified timeframe."
      : "Recent resistance levels, market uncertainty, and potential sector rotation indicate a likely pullback in the short term.",
    supporting: isBullish ? [
      "Price is trading above both 50-day and 200-day moving averages, indicating bullish momentum.",
      "Trading volume has increased on up days, suggesting strong buying interest.",
      "Relative Strength Index (RSI) shows momentum without being overbought.",
      "Recent earnings report exceeded analyst expectations by 12%.",
      "Institutional ownership has increased 3.5% in the last quarter."
    ] : [
      "Price is approaching a significant resistance level that has rejected previous attempts.",
      "Volume has been declining on recent up days, indicating potential weakness.",
      "Multiple technical indicators showing bearish divergence patterns.",
      "Broader market uncertainty with upcoming economic data releases.",
      "Sector rotation suggests money flowing out of this stock's sector."
    ],
    counter: isBullish ? [
      "The stock is approaching significant psychological resistance levels.",
      "Overall market volatility remains elevated, which could impact all stocks negatively.",
      "Profit-taking could occur after the recent price increases.",
      "Sector rotation might temporarily move funds away from this stock.",
      "Macro economic concerns might override company-specific strengths."
    ] : [
      "The company announced a new product line that could generate significant revenue.",
      "Technical support levels are nearby and could prevent further downside.",
      "The stock is already oversold according to multiple indicators.",
      "Analyst consensus remains positive despite short-term concerns.",
      "Overall sector strength might provide support even with company-specific challenges."
    ]
  };
}
