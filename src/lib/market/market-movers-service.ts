
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
      console.log(`🌐 Fetching market movers from Polygon.io`);
      
      try {
        const realData = await getPolygonMarketMovers();
        
        // Validate that we have data before returning
        if (realData.gainers.length > 0 || realData.losers.length > 0) {
          console.log(`Successfully fetched market movers: ${realData.gainers.length} gainers, ${realData.losers.length} losers`);
          return realData;
        } else {
          console.warn('Empty data received from Polygon API, falling back to mock data');
          return getMockTopMovers();
        }
      } catch (apiError) {
        logError(apiError, 'getTopMovers:polygon');
        console.error("Error fetching Polygon market movers:", apiError);
        console.log("Falling back to mock data due to API error");
        return getMockTopMovers();
      }
    } else {
      console.log(`🧪 Using mock market movers data`);
      return getMockTopMovers();
    }
  } catch (error) {
    logError(error, 'getTopMovers');
    console.error("Error fetching market movers:", error);
    console.log("Falling back to mock data due to general error");
    // Fall back to mock data on error
    return getMockTopMovers();
  }
}
