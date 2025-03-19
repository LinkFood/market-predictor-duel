
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
  rationale: string;
  reasoning?: string;
  supportingPoints?: string[];
  counterPoints?: string[];
  supportingData?: any;
  timestamp: string;
}
