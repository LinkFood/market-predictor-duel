
export interface PatternSummary {
  totalPatterns: number;
  averageAiAccuracy: number;
  averageUserAccuracy: number;
  largestAdjustment: number;
  mostAnalyzedPattern: string;
  sampleSize: number;
}

export interface PredictionPattern {
  id: string;
  group_key: string;
  timeframe: string;
  target_type: string;
  prediction_type: string;
  ai_accuracy: number;
  user_accuracy: number;
  confidence_adjustment: number;
  sample_size: number;
  market_condition?: string;
  sector?: string;
  created_at: string;
  updated_at: string;
}
