
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
  
  // Get the ticker symbol for more realistic predictions
  const ticker = request.ticker.toUpperCase();
  
  // Create custom supporting and counter points based on the timeframe
  const timeframeText = getTimeframeText(request.timeframe);
  
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
        ? `Based on technical indicators and recent news, ${ticker} is likely to see positive momentum in the ${timeframeText}.`
        : `Recent market volatility and sector weakness suggest a potential ${timeframeText} pullback for ${ticker}.`,
      supportingPoints: getCustomSupportingPoints(ticker, isUptrend, request.timeframe),
      counterPoints: getCustomCounterPoints(ticker, isUptrend, request.timeframe),
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      prediction: isUptrend ? 'uptrend' : 'downtrend',
      confidence,
      rationale: isUptrend 
        ? `Technical indicators for ${ticker} show bullish patterns with strong volume and positive news sentiment over the ${timeframeText}.`
        : `${ticker} shows recent resistance levels, decreased volume, and broader market concerns indicating potential weakness in the ${timeframeText}.`,
      supportingPoints: getCustomSupportingPoints(ticker, isUptrend, request.timeframe),
      counterPoints: getCustomCounterPoints(ticker, isUptrend, request.timeframe),
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate mock analysis for testing
 */
export function getMockAnalysis(ticker: string): string {
  ticker = ticker.toUpperCase();
  return `
    Market Analysis for ${ticker}:
    
    Technical Indicators:
    - ${ticker} is trading ${Math.random() > 0.5 ? 'above' : 'below'} its 50-day and 200-day moving averages, indicating a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} trend.
    - RSI is at ${Math.floor(Math.random() * 40) + 30}, suggesting ${Math.random() > 0.5 ? 'momentum without being overbought' : 'potential for reversal'}.
    - MACD shows a recent ${Math.random() > 0.5 ? 'bullish' : 'bearish'} crossover, signaling potential ${Math.random() > 0.5 ? 'upward' : 'downward'} movement.
    
    Fundamental Analysis:
    - Recent earnings ${Math.random() > 0.7 ? 'exceeded' : 'missed'} expectations by ${Math.floor(Math.random() * 15) + 1}%.
    - P/E ratio is ${Math.random() > 0.5 ? 'favorable' : 'concerning'} compared to industry average.
    - Company ${Math.random() > 0.6 ? 'announced expansion into new markets' : 'facing challenges in core business segments'}.
    
    Market Sentiment:
    - Institutional investors have ${Math.random() > 0.5 ? 'increased' : 'decreased'} their positions by ${(Math.random() * 5 + 1).toFixed(1)}% in the last quarter.
    - Analyst consensus has ${Math.random() > 0.6 ? 'upgraded from "hold" to "buy"' : 'maintained "hold" rating'} in recent weeks.
    - Social media sentiment analysis shows ${Math.random() > 0.5 ? 'increasing positive' : 'mixed'} mentions.
    
    Risks:
    - Industry regulatory changes may impact operations.
    - ${Math.random() > 0.5 ? 'Rising' : 'Falling'} interest rates could affect growth projections.
    - ${Math.random() > 0.7 ? 'Increased competition in core markets' : 'Supply chain disruptions may affect production'}.
  `;
}

// Helper functions for realistic mock data

function getTimeframeText(timeframe: string): string {
  switch (timeframe) {
    case '1d': return 'next day';
    case '1w': return 'next week';
    case '1m': return 'next month';
    case '3m': return 'next quarter';
    default: return 'short term';
  }
}

function getCustomSupportingPoints(ticker: string, isUptrend: boolean, timeframe: string): string[] {
  const timeframeText = getTimeframeText(timeframe);
  
  if (isUptrend) {
    return [
      `${ticker}'s recent ${Math.random() > 0.5 ? 'earnings beat' : 'positive analyst ratings'} suggests strong fundamentals`,
      `Technical indicators show a ${timeframe === '1d' ? 'short-term' : 'sustained'} bullish pattern with increasing volume`,
      `${ticker}'s sector has outperformed the broader market by ${(Math.random() * 5 + 2).toFixed(1)}% ${timeframe === '1d' ? 'today' : 'recently'}`
    ];
  } else {
    return [
      `${ticker} has encountered ${Math.random() > 0.5 ? 'resistance at key price levels' : 'declining momentum indicators'}`,
      `Volume patterns suggest ${Math.random() > 0.5 ? 'distribution' : 'decreased institutional interest'} in recent sessions`,
      `The broader ${Math.random() > 0.5 ? 'sector' : 'market'} is showing signs of ${timeframe === '1d' ? 'short-term' : 'prolonged'} weakness`
    ];
  }
}

function getCustomCounterPoints(ticker: string, isUptrend: boolean, timeframe: string): string[] {
  if (isUptrend) {
    return [
      `${ticker}'s RSI of ${Math.floor(Math.random() * 15) + 75} indicates potentially overbought conditions`,
      `Resistance at $${(Math.random() * 20 + 100).toFixed(2)} could limit further gains`,
      `Broader market ${Math.random() > 0.5 ? 'volatility' : 'uncertainty'} might impact even strong performers`
    ];
  } else {
    return [
      `${ticker} is approaching support at $${(Math.random() * 20 + 80).toFixed(2)} which may trigger a bounce`,
      `RSI of ${Math.floor(Math.random() * 15) + 25} suggests oversold conditions in the near term`,
      `Any positive news could trigger a ${Math.random() > 0.5 ? 'short squeeze' : 'rapid recovery'} due to negative sentiment`
    ];
  }
}
