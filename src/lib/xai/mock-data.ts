
/**
 * Mock data utilities for X.ai service
 */

import { StockPredictionRequest, StockPredictionResponse } from './types';

/**
 * Generate a mock prediction for testing
 */
export function getMockPrediction(request: StockPredictionRequest): StockPredictionResponse {
  console.log('Using mock prediction for', request.ticker);
  
  // For demo purposes, we'll make the prediction somewhat random but biased toward uptrend
  const isUptrend = Math.random() > 0.4;
  const confidence = Math.floor(Math.random() * 30) + 65; // 65-95 range
  
  if (request.predictionType === 'price') {
    const currentPrice = request.currentPrice || 100;
    const changePercent = isUptrend 
      ? (Math.random() * 5) + 1 // 1-6% increase
      : (Math.random() * 4) - 4; // 0-4% decrease
    
    const newPrice = currentPrice * (1 + (changePercent / 100));
    
    return {
      prediction: `$${newPrice.toFixed(2)}`,
      confidence,
      rationale: isUptrend 
        ? "Based on technical indicators and recent news, this stock is likely to see positive momentum in the short term."
        : "Recent market volatility and sector weakness suggest a potential short-term pullback for this stock.",
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      prediction: isUptrend ? 'uptrend' : 'downtrend',
      confidence,
      rationale: isUptrend 
        ? "Technical indicators show bullish patterns with strong volume and positive news sentiment."
        : "Recent resistance levels, decreased volume, and broader market concerns indicate potential weakness ahead.",
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate mock analysis for testing
 */
export function getMockAnalysis(ticker: string): string {
  return `
    Market Analysis for ${ticker}:
    
    Technical Indicators:
    - The stock is trading above its 50-day and 200-day moving averages, indicating a bullish trend.
    - RSI is at 62, suggesting momentum without being overbought.
    - MACD shows a recent crossover, signaling potential upward movement.
    
    Fundamental Analysis:
    - Recent earnings exceeded expectations by 12%.
    - P/E ratio is favorable compared to industry average.
    - Company announced expansion into new markets.
    
    Market Sentiment:
    - Institutional investors have increased their positions by 3.5% in the last quarter.
    - Analyst consensus has upgraded from "hold" to "buy" in recent weeks.
    - Social media sentiment analysis shows increasing positive mentions.
    
    Risks:
    - Industry regulatory changes may impact operations.
    - Rising interest rates could affect growth projections.
    - Increased competition in core markets.
  `;
}
