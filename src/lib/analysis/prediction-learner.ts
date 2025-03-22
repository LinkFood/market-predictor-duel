/**
 * Prediction Learning System
 * Analyzes resolved predictions to improve future AI predictions
 */
import { Prediction } from '../prediction/types';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '../error-handling';

// Types for learning system
export interface PredictionPattern {
  id: string;
  marketCondition: string;
  timeframe: string;
  targetType: string;
  sector?: string;
  accuracyScore: number;
  confidenceAdjustment: number;
  sampleSize: number;
  createdAt: string;
  updatedAt: string;
}

interface MarketCondition {
  overallTrend: 'bullish' | 'bearish' | 'neutral';
  volatility: 'high' | 'medium' | 'low';
  recentMovement: 'uptrend' | 'downtrend' | 'sideways';
}

/**
 * Analyze a batch of resolved predictions to identify patterns
 */
export async function analyzePredictionBatch(predictions: Prediction[]): Promise<void> {
  try {
    console.log(`Analyzing batch of ${predictions.length} resolved predictions`);
    
    // Only analyze completed predictions
    const completedPredictions = predictions.filter(p => 
      p.status === 'complete' || p.status === 'completed');
    
    if (completedPredictions.length === 0) {
      console.log('No completed predictions to analyze');
      return;
    }
    
    // Group predictions by conditions
    const groupedPredictions = groupPredictionsByConditions(completedPredictions);
    
    // For each group, calculate accuracy and generate pattern insights
    for (const [groupKey, group] of Object.entries(groupedPredictions)) {
      await analyzeGroup(groupKey, group);
    }
    
    console.log('Prediction analysis complete');
  } catch (error) {
    logError(error, 'analyzePredictionBatch');
    console.error('Error analyzing predictions:', error);
  }
}

/**
 * Group predictions by relevant conditions
 */
function groupPredictionsByConditions(predictions: Prediction[]): Record<string, Prediction[]> {
  const groups: Record<string, Prediction[]> = {};
  
  predictions.forEach(prediction => {
    // Create grouping key based on conditions
    // This is a simplified version - in production you would include more factors
    const key = `${prediction.timeframe}_${prediction.targetType}_${prediction.predictionType}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(prediction);
  });
  
  return groups;
}

/**
 * Analyze a group of predictions with similar conditions
 */
async function analyzeGroup(groupKey: string, predictions: Prediction[]): Promise<void> {
  try {
    // Calculate AI accuracy for this group
    const totalPredictions = predictions.length;
    let correctAiPredictions = 0;
    let correctUserPredictions = 0;
    
    predictions.forEach(prediction => {
      // For trend predictions
      if (prediction.predictionType === 'trend') {
        // AI was correct (simplified logic - enhance with actual comparison logic)
        if (prediction.outcome === 'ai_win' || prediction.outcome === 'tie') {
          correctAiPredictions++;
        }
        
        // User was correct
        if (prediction.outcome === 'user_win' || prediction.outcome === 'tie') {
          correctUserPredictions++;
        }
      } 
      // For price predictions
      else if (prediction.predictionType === 'price') {
        // Similar logic but would compare numerical differences
        if (prediction.outcome === 'ai_win' || prediction.outcome === 'tie') {
          correctAiPredictions++;
        }
        
        if (prediction.outcome === 'user_win' || prediction.outcome === 'tie') {
          correctUserPredictions++;
        }
      }
    });
    
    // Calculate accuracy scores
    const aiAccuracy = totalPredictions > 0 ? correctAiPredictions / totalPredictions : 0;
    const userAccuracy = totalPredictions > 0 ? correctUserPredictions / totalPredictions : 0;
    
    // Determine if AI needs adjustment based on accuracy differential
    const accuracyDiff = userAccuracy - aiAccuracy;
    
    // Confidence adjustment factor (positive means increase AI confidence, negative means decrease)
    // This is a simple linear adjustment - could be more sophisticated
    const confidenceAdjustment = -accuracyDiff * 2; // Scale the adjustment
    
    // Parse the group key to get components
    const [timeframe, targetType, predictionType] = groupKey.split('_');
    
    // Store this pattern in the database
    const patternData = {
      group_key: groupKey,
      timeframe,
      target_type: targetType,
      prediction_type: predictionType,
      ai_accuracy: aiAccuracy,
      user_accuracy: userAccuracy,
      confidence_adjustment: confidenceAdjustment,
      sample_size: totalPredictions,
      created_at: new Date().toISOString(),
    };
    
    // Insert or update the pattern in the database
    const { error } = await supabase
      .from('prediction_patterns')
      .upsert(patternData, { 
        onConflict: 'group_key',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Error storing prediction pattern:', error);
      return;
    }
    
    console.log(`Updated prediction pattern for group ${groupKey}: AI accuracy ${aiAccuracy.toFixed(2)}, confidence adjustment ${confidenceAdjustment.toFixed(2)}`);
  } catch (error) {
    logError(error, 'analyzeGroup');
    console.error(`Error analyzing prediction group ${groupKey}:`, error);
  }
}

/**
 * Apply learned patterns to enhance a new prediction
 */
export async function enhancePrediction(
  ticker: string,
  timeframe: string, 
  predictionType: 'trend' | 'price',
  baseConfidence: number
): Promise<number> {
  try {
    // Create the group key to look up relevant patterns
    const groupKey = `${timeframe}_stock_${predictionType}`;
    
    // Query for matching patterns
    const { data, error } = await supabase
      .from('prediction_patterns')
      .select('*')
      .eq('group_key', groupKey)
      .single();
    
    if (error) {
      // If no pattern exists yet, return the base confidence
      console.log(`No prediction pattern found for ${groupKey}, using base confidence`);
      return baseConfidence;
    }
    
    // Apply the confidence adjustment
    let adjustedConfidence = baseConfidence + data.confidence_adjustment;
    
    // Ensure confidence stays within reasonable bounds (0-100%)
    adjustedConfidence = Math.max(0, Math.min(100, adjustedConfidence));
    
    console.log(`Enhanced prediction confidence for ${ticker} (${timeframe}, ${predictionType}): ${baseConfidence}% → ${adjustedConfidence}%`);
    
    return adjustedConfidence;
  } catch (error) {
    logError(error, 'enhancePrediction');
    console.error('Error enhancing prediction:', error);
    // Return original confidence if enhancement fails
    return baseConfidence;
  }
}

/**
 * Schedule routine analysis of recent predictions
 */
export function scheduleRoutineAnalysis(intervalMinutes = 60): () => void {
  console.log(`Scheduling routine prediction analysis every ${intervalMinutes} minutes`);
  
  const intervalId = setInterval(async () => {
    try {
      // Get recently resolved predictions (last 24 hours)
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('status', 'completed')
        .gte('resolved_at', yesterdayDate.toISOString());
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Convert to application model
        const predictions = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          ticker: item.ticker,
          targetName: item.target_name,
          targetType: item.target_type,
          predictionType: item.prediction_type,
          userPrediction: item.user_prediction,
          aiPrediction: item.ai_prediction,
          aiConfidence: item.ai_confidence,
          timeframe: item.timeframe,
          startingValue: item.starting_value,
          endValue: item.final_value,
          status: item.status,
          outcome: item.outcome,
          points: item.points,
          createdAt: item.created_at,
          resolvesAt: item.resolves_at,
          resolvedAt: item.resolved_at,
          aiAnalysis: item.ai_analysis,
        } as Prediction));
        
        await analyzePredictionBatch(predictions);
      } else {
        console.log('No recent predictions to analyze');
      }
    } catch (error) {
      logError(error, 'routineAnalysis');
      console.error('Error in routine prediction analysis:', error);
    }
  }, intervalMinutes * 60 * 1000);
  
  // Return a cleanup function
  return () => clearInterval(intervalId);
}