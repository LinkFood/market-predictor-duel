/**
 * Test module for X.AI API integration
 * This file contains test functions for the X.AI service
 */

import { 
  getStockPrediction, 
  generateAIPrediction, 
  analyzePredictionResult,
  StockPredictionRequest
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
    console.log('Testing X.AI getStockPrediction...');
    
    const request: StockPredictionRequest = {
      ticker: 'AAPL',
      timeframe: '1w',
      predictionType: 'trend',
      currentPrice: 180.25
    };
    
    const result = await getStockPrediction(request);
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
    
    const result = await generateAIPrediction(request);
    console.log('X.AI enhanced prediction result:');
    console.log('- Prediction:', result.aiPrediction);
    console.log('- Confidence:', result.confidence);
    console.log('- Supporting factors:', result.aiAnalysis.supporting);
    console.log('- Counter factors:', result.aiAnalysis.counter);
    
    if (result.aiAnalysis.technicalFactors) {
      console.log('- Technical factors:', result.aiAnalysis.technicalFactors.length);
    }
    
    return result;
  } catch (error) {
    console.error('X.AI generateAIPrediction test failed:', error);
    throw error;
  }
}

// Test prediction result analysis
export async function testAnalyzePredictionResult() {
  try {
    console.log('Testing X.AI analyzePredictionResult...');
    
    const result = await analyzePredictionResult(mockPrediction);
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