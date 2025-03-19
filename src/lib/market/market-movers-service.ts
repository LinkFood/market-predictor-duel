
/**
 * Market Movers Service
 * Handles fetching top gainers and losers
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { getMockTopMovers } from "./mock-data-utils";
import { getPolygonMarketMovers } from "./polygon-api-service";
import { logError, showErrorToast } from "../error-handling";

/**
 * Get top gainers and losers for the day
 */
export async function getTopMovers(): Promise<{ gainers: StockData[]; losers: StockData[] }> {
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Attempting to fetch market movers from Polygon.io`);
      
      try {
        const realData = await getPolygonMarketMovers();
        
        // Validate that we have data before returning
        if (realData && realData.gainers && realData.losers && 
            (realData.gainers.length > 0 || realData.losers.length > 0)) {
          console.log(`✅ Successfully fetched market movers: ${realData.gainers.length} gainers, ${realData.losers.length} losers`);
          return realData;
        } else {
          const error = new Error('Empty or invalid data received from Polygon API');
          console.warn('⚠️ Empty or invalid data received from Polygon API:', realData);
          showErrorToast(error, "Market Data Error");
          throw error;
        }
      } catch (apiError) {
        logError(apiError, 'getTopMovers:polygon');
        console.error("❌ Error fetching Polygon market movers:", apiError);
        showErrorToast(apiError, "Market Data Error");
        throw apiError; // Propagate error rather than silently falling back
      }
    } else {
      console.log(`🧪 Using mock market movers data (real data disabled in config)`);
      return getMockTopMovers();
    }
  } catch (error) {
    logError(error, 'getTopMovers');
    console.error("❌ Error in getTopMovers:", error);
    
    // Only fall back to mock data if real data is not supposed to be used
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      throw error; // Propagate error when real data is expected
    }
    
    console.log("Using mock data as real data was not requested");
    return getMockTopMovers();
  }
}
