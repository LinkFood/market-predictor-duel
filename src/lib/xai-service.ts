/**
 * X.ai API Service
 * Handles all interactions with the X.ai API for AI predictions
 */

// Configuration
const API_KEY = "xai-4rv1Rbqn7wij0qg71KGIkjst8TLHn71I79yFflHgVrpwmC4fk0r57IqmuELV2SUMgkadDfPH7sbZfta4";
const API_URL = "https://api.x.ai/v1";

// Types
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
  supportingData?: any;
  timestamp: string;
}

/**
 * Get an AI prediction for a stock
 */
export async function getStockPrediction(request: StockPredictionRequest): Promise<StockPredictionResponse> {
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
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Process the response to extract prediction, confidence, and rationale
    const aiResponse = data.choices[0].message.content;
    
    // In a real implementation, we would parse the AI response
    // For now, we'll use a simplified mock response structure
    return {
      prediction: request.predictionType === 'price' ? '$185.75' : 'uptrend',
      confidence: 85,
      rationale: "Based on recent market trends, strong earnings reports, and positive sentiment analysis, I predict an uptrend for this stock.",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching AI prediction:", error);
    throw error;
  }
}

/**
 * Compare user prediction with AI prediction and calculate score
 */
export function evaluatePrediction(userPrediction: string, aiPrediction: string, actualResult: string): number {
  // Simple scoring system:
  // - If both user and AI are correct: 10 points
  // - If user is correct and AI is wrong: 20 points
  // - If user is wrong and AI is correct: 0 points
  // - If both are wrong: 5 points (for participation)
  
  const userCorrect = userPrediction === actualResult;
  const aiCorrect = aiPrediction === actualResult;
  
  if (userCorrect && aiCorrect) return 10;
  if (userCorrect && !aiCorrect) return 20;
  if (!userCorrect && aiCorrect) return 0;
  return 5;
}

/**
 * Get market analysis for a stock
 */
export async function getMarketAnalysis(ticker: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemini-pro',
        messages: [
          {
            role: 'system',
            content: `You are a financial analysis AI specialized in stock market analysis.
                      Provide detailed market analysis for the given stock.`
          },
          {
            role: 'user',
            content: `Please provide a comprehensive market analysis for ${ticker}.`
          }
        ],
        temperature: 0.3,
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // For now, return a mock analysis
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
  } catch (error) {
    console.error("Error fetching market analysis:", error);
    throw error;
  }
}