
// Adapters for converting between different prediction data formats
import { Prediction } from "@/types";

/**
 * Adapts a prediction from the database format to the application format
 */
export function adaptPrediction(dbPrediction: any): Prediction {
  return {
    id: dbPrediction.id,
    userId: dbPrediction.user_id,
    targetSymbol: dbPrediction.ticker,
    targetName: dbPrediction.target_name,
    targetType: dbPrediction.target_type || 'stock',
    predictionType: dbPrediction.prediction_type,
    userPrediction: dbPrediction.user_prediction,
    aiPrediction: dbPrediction.ai_prediction,
    aiConfidence: dbPrediction.ai_confidence,
    timeframe: dbPrediction.timeframe,
    startingValue: dbPrediction.starting_value,
    finalValue: dbPrediction.final_value,
    percentageChange: dbPrediction.percent_change, // Fixed property name to match type definition
    actualResult: dbPrediction.actual_result,
    outcome: dbPrediction.outcome,
    points: dbPrediction.points,
    status: dbPrediction.status || 'pending',
    createdAt: dbPrediction.created_at,
    resolvesAt: dbPrediction.resolves_at,
    resolvedAt: dbPrediction.resolved_at,
    aiAnalysis: dbPrediction.ai_analysis
  };
}

/**
 * Adapts a prediction from the application format to the database format
 */
export function adaptPredictionForDB(prediction: Prediction): any {
  return {
    id: prediction.id,
    user_id: prediction.userId,
    ticker: prediction.targetSymbol,
    target_name: prediction.targetName,
    target_type: prediction.targetType,
    prediction_type: prediction.predictionType,
    user_prediction: prediction.userPrediction,
    ai_prediction: prediction.aiPrediction,
    ai_confidence: prediction.aiConfidence,
    timeframe: prediction.timeframe,
    starting_value: prediction.startingValue,
    final_value: prediction.finalValue,
    percent_change: prediction.percentageChange, // Fixed property name to match type definition
    actual_result: prediction.actualResult,
    outcome: prediction.outcome,
    points: prediction.points,
    status: prediction.status,
    created_at: prediction.createdAt,
    resolves_at: prediction.resolvesAt,
    resolved_at: prediction.resolvedAt,
    ai_analysis: prediction.aiAnalysis
  };
}
