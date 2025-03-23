
import { Prediction as AppPrediction } from '@/types';
import { Prediction as ApiPrediction } from '@/lib/prediction/types';

/**
 * Adapts a prediction from the API format to the application format
 */
export const adaptPrediction = (prediction: ApiPrediction): AppPrediction => {
  return {
    id: prediction.id,
    ticker: prediction.ticker,
    targetName: prediction.target_name || prediction.target_name,
    userPrediction: prediction.user_prediction as any, // Type conversion necessary due to enum vs string
    aiPrediction: prediction.ai_prediction as any, // Type conversion necessary due to enum vs string
    targetType: prediction.target_type,
    startingValue: prediction.starting_value,
    finalValue: prediction.final_value,
    percentChange: prediction.percent_change,
    createdAt: prediction.created_at || new Date().toISOString(),
    resolvesAt: prediction.resolves_at,
    resolvedAt: prediction.resolved_at,
    status: prediction.status,
    outcome: prediction.outcome,
    actualResult: prediction.actual_result,
    predictionType: prediction.prediction_type,
    timeframe: prediction.timeframe,
    aiConfidence: prediction.ai_confidence || 0,
    points: prediction.points || 0,
    userId: prediction.user_id
  };
};
