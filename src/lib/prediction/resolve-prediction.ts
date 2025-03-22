
/**
 * Handles resolving predictions and determining outcomes
 */

import { supabase } from '@/integrations/supabase/client';
import { getStockData } from '../market';
import { Prediction } from './types';
import { getPredictionById } from './user-predictions';
import { dbToPrediction } from './adapters';
import { toast } from "sonner";

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
    
    // Check if the prediction is already resolved
    if (prediction.status === "complete" || prediction.status === "completed") {
      console.log(`Prediction ${id} is already resolved`);
      return prediction;
    }
    
    // Check if the prediction has reached its resolution date
    const now = new Date();
    const resolveDate = new Date(prediction.resolvesAt);
    
    if (now < resolveDate) {
      console.log(`Prediction ${id} is not yet ready to be resolved. Resolves at: ${resolveDate.toISOString()}`);
      toast.info("Prediction not yet ready", {
        description: `This prediction will be resolved on ${resolveDate.toLocaleDateString()} at ${resolveDate.toLocaleTimeString()}`
      });
      return prediction;
    }
    
    // Notify user that resolution is in progress
    toast.info("Resolving prediction...", {
      id: `resolve-${id}`,
      description: "Fetching latest market data"
    });
    
    // Get current stock data
    const { data: stockData } = await getStockData(prediction.ticker);
    
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
    
    // Calculate percent change
    const percentChange = ((stockData.price - prediction.startingValue) / prediction.startingValue) * 100;
    
    // Create update data object
    const updateData = {
      status: 'complete',
      final_value: stockData.price,
      percent_change: percentChange,
      actual_result: stockData.change >= 0 ? 'uptrend' : 'downtrend',
      outcome,
      points,
      resolved_at: new Date().toISOString()
    };
    
    // Update the prediction in Supabase
    const { data, error } = await supabase
      .from('predictions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error("Error resolving prediction", { 
        id: `resolve-${id}`,
        description: error.message
      });
      throw error;
    }
    
    // Show success notification
    const resultMessage = outcome === 'user_win' ? 'You won!' : outcome === 'ai_win' ? 'AI won' : 'It\'s a tie';
    toast.success(`Prediction resolved: ${resultMessage}`, {
      id: `resolve-${id}`,
      description: `You earned ${points} points`
    });
    
    return dbToPrediction(data);
  } catch (error) {
    console.error("Error resolving prediction:", error);
    toast.error("Failed to resolve prediction", {
      description: error.message
    });
    throw error;
  }
}
