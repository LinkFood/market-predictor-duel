
/**
 * X.ai API Type Definitions
 */

export interface StockPredictionRequest {
  ticker: string;
  timeframe: string; // '1d', '1w', '1m', etc.
  predictionType: 'price' | 'trend';
  currentPrice?: number;
}

export interface StockPredictionResponse {
  prediction: string;
  confidence: number;
  originalConfidence?: number; // Original confidence before learning enhancement
  rationale: string;
  reasoning?: string;
  supportingPoints?: string[];
  counterPoints?: string[];
  supportingData?: any;
  timestamp: string;
  learningApplied?: boolean; // Indicates if the learning system enhanced this prediction
}
