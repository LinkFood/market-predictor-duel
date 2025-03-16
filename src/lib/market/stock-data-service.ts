
/**
 * Stock Data Service
 * Handles fetching current stock data
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { getMockStockData } from "./mock-data-utils";
import { getPolygonStockData } from "./polygon-api-service";

/**
 * Get current stock data for a ticker
 */
export async function getStockData(symbol: string): Promise<StockData> {
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Fetching real market data for ${symbol} from Polygon.io`);
      return await getPolygonStockData(symbol);
    } else {
      console.log(`🧪 Using mock data for ${symbol}`);
      return getMockStockData(symbol);
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    console.log("Falling back to mock data");
    // Fall back to mock data on error
    return getMockStockData(symbol);
  }
}
