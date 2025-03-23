
/**
 * XAI Service - Connects to the X.AI prediction service
 */

import { toast } from "sonner";
import { FEATURES } from "./config";

// Define types for the API requests and responses
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

/**
 * Get a prediction from the X.AI service
 */
export async function getPrediction(request: StockPredictionRequest): Promise<StockPredictionResponse> {
  try {
    // In a real implementation, this would call the X.AI API
    // For now, we'll return mock data

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a mock prediction
    const bullish = Math.random() > 0.5;
    const confidence = 0.6 + Math.random() * 0.3; // 0.6 - 0.9
    
    return {
      prediction: bullish ? 'bullish' : 'bearish',
      confidence,
      rationale: `Based on ${request.ticker}'s recent performance and market conditions`,
      supportingPoints: [
        "Strong technical indicators",
        `Favorable ${request.timeframe} price movement`,
        "Sector-wide momentum"
      ],
      counterPoints: [
        "Potential market volatility",
        "Economic uncertainty"
      ],
      timestamp: new Date().toISOString(),
      learningApplied: false
    };
  } catch (error) {
    console.error("Error getting prediction:", error);
    toast.error("Failed to get prediction");
    throw error;
  }
}

/**
 * Generate an AI prediction with enhanced analysis
 */
export async function generateAIPrediction(ticker: string, timeframe: string, predictionType: string): Promise<StockPredictionResponse> {
  // This function would call the enhanced X.AI API endpoint
  // For now, we'll just use the regular prediction function
  return getPrediction({
    ticker,
    timeframe,
    predictionType: predictionType as 'price' | 'trend'
  });
}

/**
 * Analyze a prediction result and provide insights
 */
export async function analyzePredictionResult(predictionId: string) {
  try {
    // In a real implementation, this would call the X.AI API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      explanation: "The stock declined during the prediction period due to lower than expected earnings report and broader market volatility.",
      factors: [
        "Negative earnings surprise",
        "Market-wide tech sector correction",
        "Analysts downgraded price targets"
      ],
      accuracy: 0.85,
      learningPoints: [
        "This stock typically shows higher volatility around earnings"
      ]
    };
  } catch (error) {
    console.error("Error analyzing prediction result:", error);
    toast.error("Failed to analyze prediction result");
    throw error;
  }
}
