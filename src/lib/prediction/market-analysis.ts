
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
    return await getXAIAnalysis(ticker);
  } catch (error) {
    console.error('Error getting market analysis:', error);
    return `Unable to retrieve market analysis for ${ticker}. Please try again later.`;
  }
};

export default getMarketAnalysis;
