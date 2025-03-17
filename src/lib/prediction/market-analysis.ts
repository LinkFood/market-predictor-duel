
/**
 * Market Analysis Service
 * Handles getting market analysis data for predictions
 */

import { FEATURES } from '../config';
import { getMarketAnalysis as getXAIAnalysis } from '../xai-service';

/**
 * Get market analysis for a stock
 */
const getMarketAnalysis = async (ticker: string): Promise<string> => {
  try {
    console.log('Getting market analysis for', ticker);
    
    // Add retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        const analysis = await getXAIAnalysis(ticker);
        return analysis;
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)));
      }
    }
    
    throw new Error('All retry attempts failed');
  } catch (error) {
    console.error('Error getting market analysis:', error);
    return `Unable to retrieve market analysis for ${ticker}. Please try again later.`;
  }
};

export default getMarketAnalysis;
