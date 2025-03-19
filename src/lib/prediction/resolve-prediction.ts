
/**
 * Handles resolving predictions and determining outcomes
 */

import { supabase } from '@/integrations/supabase/client';
import { getStockData } from '../market';
import { Prediction } from './types';
import { getPredictionById } from './user-predictions';

/**
 * Resolve a prediction (determine the outcome)
 */
export async function resolvePrediction(id: string): Promise<Prediction> {
  try {
    // Get the prediction
    const prediction = await getPredictionById(id);
    if (!prediction) {
      throw new Error("Prediction not found");
    }
    
    // Get current stock data
    const stockData = await getStockData(prediction.ticker);
    
    // Determine the outcome
    let outcome: 'user_win' | 'ai_win' | 'tie';
    let points = 0;
    
    // For price predictions, we'll determine if the prediction is closer to the actual price
    if (prediction.prediction_type === 'price') {
      const actualPrice = stockData.price;
      const userPredictionPrice = parseFloat(prediction.user_prediction.replace('$', ''));
      const aiPredictionPrice = parseFloat(prediction.ai_prediction.replace('$', ''));
      
      const userDifference = Math.abs(userPredictionPrice - actualPrice);
      const aiDifference = Math.abs(aiPredictionPrice - actualPrice);
      
      if (userDifference < aiDifference) {
        outcome = 'user_win';
        points = 20;
      } else if (aiDifference < userDifference) {
        outcome = 'ai_win';
        points = 0;
      } else {
        outcome = 'tie';
        points = 10;
      }
    }
    // For trend predictions, determine if the trend prediction was correct
    else {
      const actualTrend = stockData.change >= 0 ? 'uptrend' : 'downtrend';
      const userCorrect = prediction.user_prediction === actualTrend || 
                          (prediction.user_prediction === 'bullish' && actualTrend === 'uptrend') ||
                          (prediction.user_prediction === 'bearish' && actualTrend === 'downtrend');
      const aiCorrect = prediction.ai_prediction === actualTrend || 
                        (prediction.ai_prediction === 'bullish' && actualTrend === 'uptrend') ||
                        (prediction.ai_prediction === 'bearish' && actualTrend === 'downtrend');
      
      if (userCorrect && !aiCorrect) {
        outcome = 'user_win';
        points = 20;
      } else if (!userCorrect && aiCorrect) {
        outcome = 'ai_win';
        points = 0;
      } else if (userCorrect && aiCorrect) {
        outcome = 'tie';
        points = 10;
      } else {
        outcome = 'tie';
        points = 5; // Both wrong
      }
    }
    
    // Calculate percent change
    const percentChange = ((stockData.price - prediction.starting_value) / prediction.starting_value) * 100;
    
    // Update the prediction in Supabase
    const { data, error } = await supabase
      .from('predictions')
      .update({
        status: 'complete',
        final_value: stockData.price,
        percent_change: percentChange,
        actual_result: stockData.change >= 0 ? 'uptrend' : 'downtrend',
        outcome,
        points,
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Prediction;
  } catch (error) {
    console.error("Error resolving prediction:", error);
    throw error;
  }
}
