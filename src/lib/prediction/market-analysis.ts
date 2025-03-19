
/**
 * Market Analysis Service
 * Handles getting market analysis data for predictions
 */

import { FEATURES } from '../config';
import { getMarketAnalysis as getXAIAnalysis } from '../market-analysis-service';
import { showErrorToast } from '../error-handling';

/**
 * Get market analysis for a stock
 */
const getMarketAnalysis = async (ticker: string): Promise<string> => {
  try {
    console.log('Getting market analysis for', ticker);
    
    if (!FEATURES.enableAIAnalysis) {
      console.log('AI analysis is disabled in features. Returning error message.');
      return `AI analysis is currently disabled in the application features.`;
    }
    
    // Add retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Attempt ${attempts} to get analysis for ${ticker}`);
        const analysis = await getXAIAnalysis(ticker);
        
        // Check if we got valid analysis (not mock data)
        if (analysis && !analysis.includes("Market Analysis for") && analysis.length > 100) {
          console.log('Received valid analysis from X.ai');
          return analysis;
        } else {
          console.warn('Received potentially mock or invalid analysis, retrying...');
          throw new Error('Invalid analysis received');
        }
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const backoffTime = 1000 * Math.pow(2, attempts - 1);
        console.log(`Waiting ${backoffTime}ms before retry ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
    
    throw new Error('All retry attempts failed');
  } catch (error) {
    console.error('Error getting market analysis:', error);
    showErrorToast(error, 'AI Analysis Error');
    return `Unable to retrieve market analysis for ${ticker}. The AI analysis service may be temporarily unavailable. Please try again later.`;
  }
};

export default getMarketAnalysis;
