
/**
 * Market Movers Service
 * Handles fetching top gainers and losers
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { getMockTopMovers } from "./mock-data-utils";
import { getPolygonMarketMovers } from "./polygon-api-service";
import { logError } from "../error-handling";

/**
 * Get top gainers and losers for the day
 */
export async function getTopMovers(): Promise<{ gainers: StockData[]; losers: StockData[] }> {
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Attempting to fetch market movers from Polygon.io`);
      
      try {
        // Add retry mechanism
        let attempts = 0;
        const maxAttempts = 3;
        let lastError = null;
        
        while (attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`Attempt ${attempts} to fetch market movers from Polygon.io`);
            
            const realData = await getPolygonMarketMovers();
            
            // Validate that we have data before returning
            if (realData && realData.gainers && realData.losers && 
                (realData.gainers.length > 0 || realData.losers.length > 0)) {
              console.log(`✅ Successfully fetched market movers: ${realData.gainers.length} gainers, ${realData.losers.length} losers`);
              return realData;
            } else {
              console.warn('⚠️ Empty or invalid data received from Polygon API:', realData);
              throw new Error('Empty or invalid data received from Polygon API');
            }
          } catch (attemptError) {
            lastError = attemptError;
            console.error(`❌ Attempt ${attempts} failed:`, attemptError);
            
            if (attempts >= maxAttempts) {
              throw attemptError;
            }
            
            // Wait before retrying (exponential backoff)
            const backoffTime = 1000 * Math.pow(2, attempts - 1);
            console.log(`Waiting ${backoffTime}ms before retry ${attempts + 1}`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          }
        }
        
        throw lastError || new Error('All retry attempts failed');
      } catch (apiError) {
        logError(apiError, 'getTopMovers:polygon');
        console.error("❌ Error fetching Polygon market movers:", apiError);
        console.log("Falling back to mock data due to API error");
        return getMockTopMovers();
      }
    } else {
      console.log(`🧪 Using mock market movers data (real data disabled in config)`);
      return getMockTopMovers();
    }
  } catch (error) {
    logError(error, 'getTopMovers');
    console.error("❌ Error in getTopMovers:", error);
    console.log("Falling back to mock data due to general error");
    // Fall back to mock data on error
    return getMockTopMovers();
  }
}
