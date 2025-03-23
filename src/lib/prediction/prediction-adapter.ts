
import { Prediction as AppPrediction, PredictionDirection, PredictionTimeframe } from '@/types';
import { Prediction as ApiPrediction } from '@/lib/prediction/types';

/**
 * Adapts a prediction from the API format to the application format
 */
export const adaptPrediction = (prediction: ApiPrediction): AppPrediction => {
  return {
    id: prediction.id,
    ticker: prediction.ticker,
    targetName: prediction.targetName || prediction.target_name || "",
    userPrediction: (prediction.userPrediction || prediction.user_prediction || "bullish") as PredictionDirection,
    aiPrediction: (prediction.aiPrediction || prediction.ai_prediction || "bullish") as PredictionDirection,
    targetType: prediction.targetType || prediction.target_type || "stock",
    startingValue: prediction.startingValue || prediction.starting_value || 0,
    finalValue: prediction.final_value,
    percentChange: prediction.percent_change,
    createdAt: prediction.createdAt || prediction.created_at || new Date().toISOString(),
    resolvesAt: prediction.resolvesAt || prediction.resolves_at || "",
    resolvedAt: prediction.resolvedAt || prediction.resolved_at,
    status: prediction.status,
    outcome: prediction.outcome,
    actualResult: (prediction.actualResult || prediction.actual_result || "bullish") as PredictionDirection,
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
    endValue: prediction.endValue || prediction.endPrice,
    winner: prediction.winner
  };
};

/**
 * Adapts a prediction from the application format to the API format
 */
export const adaptToApiPrediction = (prediction: AppPrediction): ApiPrediction => {
  return {
    id: prediction.id,
    userId: prediction.userId,
    ticker: prediction.ticker,
    targetName: prediction.targetName,
    userPrediction: prediction.userPrediction,
    aiPrediction: prediction.aiPrediction,
    targetType: prediction.targetType,
    startingValue: prediction.startingValue,
    final_value: prediction.finalValue,
    percent_change: prediction.percentChange,
    createdAt: prediction.createdAt,
    resolvesAt: prediction.resolvesAt,
    resolvedAt: prediction.resolvedAt,
    status: prediction.status,
    outcome: prediction.outcome,
    actualResult: prediction.actualResult,
    predictionType: prediction.predictionType,
    timeframe: prediction.timeframe,
    aiConfidence: prediction.aiConfidence,
    points: prediction.points,
    aiAnalysis: prediction.aiAnalysis,
    
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
    ai_confidence: prediction.aiConfidence
  };
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
