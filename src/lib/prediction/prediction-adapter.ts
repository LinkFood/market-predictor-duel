
import { Prediction as PredictionType } from '@/types/index';
import { Prediction as LibPrediction } from '@/lib/prediction/types';

/**
 * Converts between different Prediction type formats to ensure compatibility across the application
 */
export function adaptPrediction(prediction: LibPrediction | any): PredictionType {
  // If target type is not provided, use a default
  const targetType = prediction.targetType || prediction.target_type || 'stock';
  
  // Generate a ticker from targetName if not provided
  const ticker = prediction.ticker || prediction.targetName || prediction.target_name || '';
  
  // Ensure predictionType is set
  const predictionType = prediction.predictionType || prediction.prediction_type || 'trend';
  
  return {
    id: prediction.id,
    userId: prediction.userId || prediction.user_id,
    targetType: targetType,
    targetName: prediction.targetName || prediction.target_name || prediction.stockName,
    userPrediction: prediction.userPrediction || prediction.user_prediction,
    aiPrediction: prediction.aiPrediction || prediction.ai_prediction,
    aiConfidence: prediction.aiConfidence || prediction.ai_confidence,
    aiAnalysis: prediction.aiAnalysis || {
      supporting: [],
      counter: [],
      reasoning: ''
    },
    timeframe: prediction.timeframe,
    startingValue: prediction.startingValue || prediction.starting_value,
    createdAt: prediction.createdAt || prediction.created_at,
    resolvesAt: prediction.resolvesAt || prediction.resolves_at,
    status: prediction.status,
    finalValue: prediction.finalValue || prediction.final_value || prediction.endValue,
    endValue: prediction.endValue || prediction.final_value,
    percentChange: prediction.percentChange || prediction.percent_change,
    actualResult: prediction.actualResult || prediction.actual_result,
    winner: prediction.winner || prediction.outcome === 'user_win' ? 'user' : 
            prediction.outcome === 'ai_win' ? 'ai' : 
            prediction.outcome === 'tie' ? 'both' : 'neither',
    resolvedAt: prediction.resolvedAt || prediction.resolved_at,
    outcome: prediction.outcome,
    points: prediction.points,
    ticker: ticker, // Ensure ticker is always set
    predictionType: predictionType, // Ensure predictionType is always set
  };
}

/**
 * Adapts from application Prediction type to library Prediction type
 */
export function adaptToLibPrediction(prediction: PredictionType): LibPrediction {
  return {
    id: prediction.id,
    userId: prediction.userId,
    ticker: prediction.ticker || prediction.targetName || "", // Ensure ticker is set
    targetName: prediction.targetName,
    targetType: prediction.targetType,
    predictionType: prediction.predictionType || 'trend', // Default to trend
    userPrediction: prediction.userPrediction,
    aiPrediction: prediction.aiPrediction,
    aiConfidence: prediction.aiConfidence,
    timeframe: prediction.timeframe,
    startingValue: prediction.startingValue,
    endValue: prediction.finalValue || prediction.endValue,
    status: prediction.status,
    points: prediction.points,
    createdAt: prediction.createdAt,
    resolvesAt: prediction.resolvesAt,
    resolvedAt: prediction.resolvedAt,
    aiAnalysis: prediction.aiAnalysis,
    outcome: prediction.outcome
  };
}

/**
 * Type guard to check if a prediction has been resolved
 */
export function isPredictionResolved(prediction: PredictionType | LibPrediction): boolean {
  return prediction.status === 'complete' || prediction.status === 'completed';
}
