
import { Prediction as PredictionType } from '@/types/index';
import { Prediction as LibPrediction } from '@/lib/prediction/types';

/**
 * Converts between different Prediction type formats to ensure compatibility across the application
 */
export function adaptPrediction(prediction: LibPrediction | any): PredictionType {
  return {
    id: prediction.id,
    userId: prediction.userId || prediction.user_id,
    targetType: prediction.targetType || prediction.target_type,
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
  };
}

/**
 * Type guard to check if a prediction has been resolved
 */
export function isPredictionResolved(prediction: PredictionType | LibPrediction): boolean {
  return prediction.status === 'complete' || prediction.status === 'completed';
}
