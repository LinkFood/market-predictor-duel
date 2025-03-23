
/**
 * Mock XAI Service
 * This is a mock implementation to fix missing module errors
 */

import { StockPredictionRequest, StockPredictionResponse } from './xai/types';

export async function getPrediction(request: StockPredictionRequest): Promise<StockPredictionResponse> {
  // Return a mock prediction
  return {
    prediction: request.predictionType === 'trend' ? 'bullish' : '180.45',
    confidence: 0.75,
    rationale: 'This is a mock prediction from the mock XAI service.',
    supportingPoints: ['Mock supporting point 1', 'Mock supporting point 2'],
    counterPoints: ['Mock counter point 1'],
    timestamp: new Date().toISOString(),
    learningApplied: false
  };
}

export async function testConnection(): Promise<{ success: boolean, message: string }> {
  return {
    success: true,
    message: 'Mock XAI service connection successful'
  };
}
