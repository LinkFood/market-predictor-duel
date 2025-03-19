
/**
 * X.ai Prediction Service
 * Handles stock prediction functionality using X.ai API
 */

import { FEATURES, config } from '../config';
import { StockPredictionRequest, StockPredictionResponse } from './types';
import { getMockPrediction } from './mock-data';

// Configuration
const API_KEY = config.xai.apiKey;
const API_URL = config.xai.baseUrl;

/**
 * Get an AI prediction for a stock
 */
export async function getStockPrediction(request: StockPredictionRequest): Promise<StockPredictionResponse> {
  try {
    // Check if AI analysis is enabled
    if (!FEATURES.enableAIAnalysis) {
      console.log('AI analysis is disabled. Returning mock prediction.');
      return getMockPrediction(request);
    }
    
    console.log('Fetching AI prediction for', request.ticker);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${API_URL}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gemini-pro', // Using a powerful model for financial predictions
          messages: [
            {
              role: 'system',
              content: `You are a financial analysis AI specialized in stock market predictions. 
                        Analyze the given stock and provide a prediction based on current market data, 
                        trends, and historical performance. Explain your reasoning and provide a 
                        confidence score from 0 to 100.`
            },
            {
              role: 'user',
              content: `Please predict the ${request.predictionType} for ${request.ticker} 
                        over the next ${request.timeframe}. ${request.currentPrice ? 
                        `The current price is $${request.currentPrice}.` : ''}`
            }
          ],
          temperature: 0.2, // Low temperature for more consistent predictions
          top_p: 0.7,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`X.ai API request failed with status ${response.status}`);
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        return getMockPrediction(request);
      }

      const data = await response.json();
      
      // Process the response to extract prediction, confidence, and rationale
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        console.error('Invalid AI response format, falling back to mock data');
        return getMockPrediction(request);
      }
      
      // Here we would parse the AI response to extract structured data
      // For now, we'll use our mock response structure
      return {
        prediction: request.predictionType === 'price' ? '$185.75' : 'uptrend',
        confidence: 85,
        rationale: aiResponse || "Based on recent market trends, strong earnings reports, and positive sentiment analysis, I predict an uptrend for this stock.",
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.error('Request timeout for X.ai API');
        return getMockPrediction(request);
      }
      throw err;
    }
  } catch (error) {
    console.error("Error fetching AI prediction:", error);
    // Return mock data on error
    return getMockPrediction(request);
  }
}
