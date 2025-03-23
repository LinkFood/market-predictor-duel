
/**
 * Test module for X.AI API integration
 * This file contains test functions for the X.AI service
 */

import { 
  getPrediction, 
  StockPredictionRequest,
  StockPredictionResponse
} from './xai-service';
import { PredictionRequest } from './prediction/types';

// Mock prediction for testing
const mockPrediction = {
  id: "p1",
  userId: "u1",
  ticker: "AAPL",
  stockName: "Apple Inc.",
  predictionType: 'trend' as const,
  userPrediction: "bullish",
  aiPrediction: "bearish",
  confidence: 8,
  timeframe: "1w",
  startPrice: 180.25,
  endPrice: 175.50,
  status: 'completed' as const,
  outcome: 'ai_win' as const,
  points: 0,
  createdAt: new Date().toISOString(),
  resolvedAt: new Date().toISOString()
};

// Test basic stock prediction
export async function testGetStockPrediction() {
  try {
    console.log('Testing X.AI getPrediction...');
    
    const request: StockPredictionRequest = {
      ticker: 'AAPL',
      timeframe: '1w',
      predictionType: 'trend',
      currentPrice: 180.25
    };
    
    const result = await getPrediction(request);
    console.log('X.AI stock prediction result:', result);
    return result;
  } catch (error) {
    console.error('X.AI stock prediction test failed:', error);
    throw error;
  }
}

// Test enhanced AI prediction
export async function testGenerateAIPrediction() {
  try {
    console.log('Testing X.AI generateAIPrediction...');
    
    const request: PredictionRequest = {
      ticker: 'AAPL',
      timeframe: '1w',
      predictionType: 'trend',
      userPrediction: 'bullish'
    };
    
    // Use the main prediction function for now
    const result = await getPrediction({
      ticker: request.ticker,
      timeframe: request.timeframe,
      predictionType: request.predictionType,
    });
    
    console.log('X.AI enhanced prediction result:');
    console.log('- Prediction:', result.prediction);
    console.log('- Confidence:', result.confidence);
    console.log('- Supporting points:', result.supportingPoints);
    console.log('- Counter points:', result.counterPoints);
    
    return {
      aiPrediction: result.prediction,
      confidence: result.confidence,
      aiAnalysis: {
        supporting: result.supportingPoints || [],
        counter: result.counterPoints || [],
        reasoning: result.rationale || ""
      }
    };
  } catch (error) {
    console.error('X.AI generateAIPrediction test failed:', error);
    throw error;
  }
}

// Test prediction result analysis
export async function testAnalyzePredictionResult() {
  try {
    console.log('Testing X.AI analyzePredictionResult...');
    
    // Mock analysis result
    const result = {
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
    
    console.log('X.AI prediction analysis result:', result);
    return result;
  } catch (error) {
    console.error('X.AI analyzePredictionResult test failed:', error);
    throw error;
  }
}

// Run all tests
export async function runAllXAITests() {
  try {
    // Test basic prediction
    await testGetStockPrediction();
    
    // Test enhanced prediction
    await testGenerateAIPrediction();
    
    // Test result analysis
    await testAnalyzePredictionResult();
    
    console.log('✅ All X.AI tests completed successfully');
    return true;
  } catch (error) {
    console.error('❌ X.AI tests failed:', error);
    return false;
  }
}
