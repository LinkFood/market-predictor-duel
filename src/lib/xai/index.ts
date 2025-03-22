
/**
 * X.ai API Service main entry point
 * Exports all X.ai related functionality
 */

// Export types
export type { StockPredictionRequest, StockPredictionResponse } from './types';

// Export main functionality
export { getStockPrediction, testXaiApiConnection } from './prediction-service';
export { evaluatePrediction } from './evaluation';
export { getMarketAnalysis } from '../market-analysis-service';

// For convenience, re-export the mock functions as well
export { getMockPrediction, getMockAnalysis } from './mock-data';
