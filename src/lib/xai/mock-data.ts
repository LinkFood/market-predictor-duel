
import { StockPredictionRequest, StockPredictionResponse } from './types';

/**
 * Get a mock prediction for testing without using the real API
 */
export function getMockPrediction(request: StockPredictionRequest): StockPredictionResponse {
  // Add randomness to make it seem more realistic
  const confidenceScore = Math.floor(Math.random() * 20) + 70; // 70-90
  const isPriceUp = Math.random() > 0.45; // Slightly higher chance of uptrend to avoid seeming too pessimistic
  
  // For price predictions, generate a reasonable fictional price
  const mockPrice = request.predictionType === 'price' ? 
    (request.currentPrice || 100) * (isPriceUp ? (1 + Math.random() * 0.1) : (1 - Math.random() * 0.1)) : null;
  
  // Define the ticker symbol and current price for more tailored mocks
  const ticker = request.ticker.toUpperCase();
  const currentPrice = request.currentPrice || 100;
  
  // Define the timeframe reference
  const timeframeText = request.timeframe === '1d' ? 'next day' : 
                        request.timeframe === '1w' ? 'next week' : 
                        request.timeframe === '1m' ? 'next month' : 'coming period';
  
  // Generate custom supporting and counter points based on the prediction direction
  const trendKeyword = isPriceUp ? 'uptrend' : 'downtrend';
  const direction = isPriceUp ? 'upward' : 'downward';
  
  // Create a structured mock prediction
  const prediction: StockPredictionResponse = {
    prediction: request.predictionType === 'trend' ? trendKeyword : `$${mockPrice?.toFixed(2) || '0.00'}`,
    confidence: confidenceScore,
    rationale: `Based on analysis of ${ticker}'s recent performance and market conditions, an ${direction} movement is expected over the ${timeframeText}. Technical indicators, trading volumes, and overall market sentiment suggest this prediction has a confidence level of ${confidenceScore}%.`,
    timestamp: new Date().toISOString(),
    supportingPoints: [
      isPriceUp ? 
        `${ticker} has shown strong momentum in recent trading sessions` : 
        `${ticker} has been encountering resistance at current price levels`,
      isPriceUp ? 
        `Positive earnings outlook and strong fundamental indicators` : 
        `Recent sector rotation away from ${ticker}'s industry`,
      isPriceUp ? 
        `Favorable market conditions and increased institutional buying` : 
        `Technical indicators show overbought conditions`
    ],
    counterPoints: [
      isPriceUp ? 
        `Potential market volatility could limit upside` : 
        `The stock may find support at key technical levels`,
      isPriceUp ? 
        `Profit-taking could occur after recent gains` : 
        `Oversold conditions may trigger a technical bounce`,
      isPriceUp ? 
        `Sector-wide challenges could impact performance` : 
        `Recent insider buying suggests company confidence`
    ]
  };
  
  return prediction;
}

/**
 * Get mock market analysis for a stock
 */
export function getMockAnalysis(ticker: string): string {
  const analysis = `
# Market Analysis for ${ticker}

## Technical Analysis
- The stock is currently trading ${Math.random() > 0.5 ? 'above' : 'below'} its 50-day moving average
- RSI is at ${Math.floor(Math.random() * 40) + 30}, indicating ${Math.random() > 0.5 ? 'neutral momentum' : 'potential reversal'}
- MACD shows a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} crossover pattern
- Volume has been ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} on ${Math.random() > 0.5 ? 'up' : 'down'} days

## Fundamental Factors
- Latest quarterly earnings ${Math.random() > 0.6 ? 'exceeded' : 'missed'} expectations by ${Math.floor(Math.random() * 10) + 1}%
- P/E ratio of ${Math.floor(Math.random() * 25) + 10} compared to industry average of ${Math.floor(Math.random() * 20) + 15}
- Revenue growth of ${Math.floor(Math.random() * 15) + 1}% year-over-year
- Free cash flow has ${Math.random() > 0.5 ? 'improved' : 'declined'} by ${Math.floor(Math.random() * 10) + 1}% 

## Market Sentiment
- Institutional ownership has ${Math.random() > 0.5 ? 'increased' : 'decreased'} by ${Math.floor(Math.random() * 5) + 1}% in the last quarter
- Analyst ratings: ${Math.floor(Math.random() * 3) + 3} Buy, ${Math.floor(Math.random() * 3) + 2} Hold, ${Math.floor(Math.random() * 2)} Sell
- Short interest is at ${Math.floor(Math.random() * 10) + 1}% of float
- Options market indicates ${Math.random() > 0.5 ? 'bullish' : 'bearish'} sentiment based on put/call ratio

## Risk Factors
- Market volatility due to macroeconomic conditions
- Sector competition intensifying 
- Regulatory changes could impact operations
- Supply chain challenges in the industry
`;

  return analysis;
}
