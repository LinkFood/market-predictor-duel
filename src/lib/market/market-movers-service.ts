
/**
 * Market Movers Service
 * Handles fetching top gainers and losers
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { getMockTopMovers } from "./mock-data-utils";
import { getPolygonMarketMovers } from "./polygon-api-service";

/**
 * Get top gainers and losers for the day
 */
export async function getTopMovers(): Promise<{ gainers: StockData[]; losers: StockData[] }> {
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Fetching market movers from Polygon.io`);
      return await getPolygonMarketMovers();
    } else {
      console.log(`🧪 Using mock market movers data`);
      return getMockTopMovers();
    }
  } catch (error) {
    console.error("Error fetching market movers:", error);
    console.log("Falling back to mock data");
    // Fall back to mock data on error
    return getMockTopMovers();
  }
}
