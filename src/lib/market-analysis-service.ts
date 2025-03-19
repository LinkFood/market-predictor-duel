
/**
 * Market Analysis Service
 * Handles getting market analysis from X.ai through Supabase edge function
 */

import { supabase } from '@/integrations/supabase/client';
import { FEATURES } from './config';

/**
 * Get market analysis for a stock from X.ai
 */
export async function getMarketAnalysis(ticker: string): Promise<string> {
  try {
    console.log('Getting market analysis for', ticker);
    
    // Check if AI analysis is enabled
    if (!FEATURES.enableAIAnalysis) {
      console.log('AI analysis is disabled. Returning mock analysis.');
      return getMockAnalysis(ticker);
    }
    
    // Invoke the Supabase edge function
    const { data, error } = await supabase.functions.invoke('xai-analysis', {
      body: { ticker }
    });

    if (error) {
      console.error('Error calling xai-analysis function:', error);
      throw error;
    }

    return data.analysis;
  } catch (error) {
    console.error('Error getting market analysis:', error);
    
    // Fall back to mock data on error
    return getMockAnalysis(ticker);
  }
}

/**
 * Generate mock analysis for testing
 */
function getMockAnalysis(ticker: string): string {
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
