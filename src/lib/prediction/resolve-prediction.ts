
/**
 * Handles resolving predictions and determining outcomes
 */

import { getStockData } from '../market';
import { Prediction } from './types';
import { getPredictionById } from './user-predictions';

/**
 * Resolve a prediction (determine the outcome)
 * Note: In a real application, this would likely be handled by a backend job
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
    if (prediction.predictionType === 'price') {
      const actualPrice = stockData.price;
      const userPredictionPrice = parseFloat(prediction.userPrediction.replace('$', ''));
      const aiPredictionPrice = parseFloat(prediction.aiPrediction.replace('$', ''));
      
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
      const userCorrect = prediction.userPrediction === actualTrend || 
                          (prediction.userPrediction === 'bullish' && actualTrend === 'uptrend') ||
                          (prediction.userPrediction === 'bearish' && actualTrend === 'downtrend');
      const aiCorrect = prediction.aiPrediction === actualTrend || 
                        (prediction.aiPrediction === 'bullish' && actualTrend === 'uptrend') ||
                        (prediction.aiPrediction === 'bearish' && actualTrend === 'downtrend');
      
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
    
    // Update the prediction - using "complete" to match the type
    const updatedPrediction: Prediction = {
      ...prediction,
      status: 'complete',
      endPrice: stockData.price,
      outcome,
      points,
      resolvedAt: new Date().toISOString()
    };
    
    /* In a real implementation, we would update in Supabase
    const { data, error } = await supabase
      .from('predictions')
      .update(updatedPrediction)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    return updatedPrediction;
  } catch (error) {
    console.error("Error resolving prediction:", error);
    throw error;
  }
}
