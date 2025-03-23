
import { Prediction as AppPrediction, PredictionDirection, PredictionTimeframe } from '@/types';
import { Prediction as ApiPrediction } from '@/lib/prediction/types';

/**
 * Adapts a prediction from the API format to the application format
 */
export const adaptPrediction = (prediction: ApiPrediction): AppPrediction => {
  // Check if property exists in either camelCase or snake_case format
  const userPredictionValue = prediction.userPrediction || prediction.user_prediction;
  const aiPredictionValue = prediction.aiPrediction || prediction.ai_prediction;
  const actualResultValue = 
    typeof prediction.actualResult !== 'undefined' ? prediction.actualResult : 
    typeof prediction.actual_result !== 'undefined' ? prediction.actual_result : 
    "bullish";
  
  return {
    id: prediction.id,
    ticker: prediction.ticker || "",
    targetName: prediction.targetName || prediction.target_name || "",
    userPrediction: (userPredictionValue || "bullish") as PredictionDirection,
    aiPrediction: (aiPredictionValue || "bullish") as PredictionDirection,
    targetType: prediction.targetType || prediction.target_type || "stock",
    startingValue: prediction.startingValue || prediction.starting_value || 0,
    finalValue: prediction.final_value || 0,
    percentChange: prediction.percent_change || 0,
    createdAt: prediction.createdAt || prediction.created_at || new Date().toISOString(),
    resolvesAt: prediction.resolvesAt || prediction.resolves_at || "",
    resolvedAt: prediction.resolvedAt || prediction.resolved_at,
    status: prediction.status || "pending",
    outcome: prediction.outcome,
    actualResult: actualResultValue as PredictionDirection,
    predictionType: (prediction.predictionType || prediction.prediction_type || "trend") as "trend" | "price",
    timeframe: (prediction.timeframe || "1d") as PredictionTimeframe,
    aiConfidence: prediction.aiConfidence || prediction.ai_confidence || 0,
    points: prediction.points || 0,
    userId: prediction.userId || prediction.user_id || "",
    aiAnalysis: prediction.aiAnalysis || {
      supporting: [],
      counter: [],
      reasoning: ""
    },
    endValue: prediction.endValue || prediction.endPrice || 0,
    winner: prediction.winner || undefined
  };
};

/**
 * Adapts a prediction from the application format to the API format
 */
export const adaptToApiPrediction = (prediction: AppPrediction): ApiPrediction => {
  // Create a base object with all camelCase properties
  const baseObject = {
    id: prediction.id,
    userId: prediction.userId,
    ticker: prediction.ticker,
    targetName: prediction.targetName,
    userPrediction: prediction.userPrediction,
    aiPrediction: prediction.aiPrediction,
    targetType: prediction.targetType,
    startingValue: prediction.startingValue,
    predictionType: prediction.predictionType,
    timeframe: prediction.timeframe,
    aiConfidence: prediction.aiConfidence,
    createdAt: prediction.createdAt,
    resolvesAt: prediction.resolvesAt,
    resolvedAt: prediction.resolvedAt,
    status: prediction.status,
    outcome: prediction.outcome,
    actualResult: prediction.actualResult,
    points: prediction.points,
    aiAnalysis: prediction.aiAnalysis,
    
    // Add properties that exist on ApiPrediction but not AppPrediction
    final_value: prediction.finalValue,
    endValue: prediction.endValue
  } as ApiPrediction;

  // Add snake_case properties for API compatibility
  return {
    ...baseObject,
    // For compatibility with API expected format
    user_id: prediction.userId,
    target_name: prediction.targetName,
    user_prediction: prediction.userPrediction,
    ai_prediction: prediction.aiPrediction,
    target_type: prediction.targetType,
    starting_value: prediction.startingValue,
    prediction_type: prediction.predictionType,
    created_at: prediction.createdAt,
    resolves_at: prediction.resolvesAt,
    resolved_at: prediction.resolvedAt,
    actual_result: prediction.actualResult,
    ai_confidence: prediction.aiConfidence,
    // We need to explicitly add these fields from the app type to the API type
    percent_change: prediction.percentChange
  } as ApiPrediction;
};

/**
 * Checks if a prediction is resolved
 */
export const isPredictionResolved = (prediction: AppPrediction): boolean => {
  return prediction.status === "complete" || 
         prediction.status === "completed" || 
         !!prediction.resolvedAt || 
         !!prediction.outcome;
};

/**
 * For compatibility with components expecting the lib prediction type
 */
export const adaptToLibPrediction = (prediction: AppPrediction): ApiPrediction => {
  return adaptToApiPrediction(prediction);
};
