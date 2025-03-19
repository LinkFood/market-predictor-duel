
/**
 * Stock Data Service
 * Handles fetching current stock data
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { getMockStockData } from "./mock-data-utils";
import { getPolygonStockData } from "./polygon-api-service";
import { showErrorToast } from "../error-handling";

/**
 * Get current stock data for a ticker
 */
export async function getStockData(symbol: string): Promise<StockData> {
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Fetching real market data for ${symbol} from Polygon.io`);
      try {
        return await getPolygonStockData(symbol);
      } catch (error) {
        console.error("Error fetching real stock data:", error);
        showErrorToast(error, "Market Data Error");
        throw error; // Rethrow so we don't silently fall back
      }
    } else {
      console.log(`🧪 Using mock data for ${symbol}`);
      return getMockStockData(symbol);
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    // Only fall back to mock data if real data is not supposed to be used
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      throw error; // Propagate error when real data is expected
    }
    console.log("Using mock data as real data was not requested");
    return getMockStockData(symbol);
  }
}
