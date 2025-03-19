
/**
 * Search Service
 * Handles searching for stocks by name or symbol
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { searchMockStocks } from "./mock-data-utils";
import { searchPolygonStocks } from "./polygon-api-service";
import { logError } from "../error-handling";

/**
 * Search for stocks by keyword
 */
export async function searchStocks(query: string): Promise<StockData[]> {
  try {
    // Check if query is empty
    if (!query.trim()) {
      return [];
    }
    
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Searching for stocks matching "${query}" via Polygon.io`);
      try {
        return await searchPolygonStocks(query);
      } catch (error) {
        logError(error, `searchStocks:${query}`);
        console.error("Error searching stocks via Polygon API:", error);
        throw error; // Rethrow to prevent silent fallback
      }
    } else {
      console.log(`🧪 Searching mock stocks for "${query}"`);
      return searchMockStocks(query);
    }
  } catch (error) {
    logError(error, `searchStocks:${query}`);
    console.error("Error searching stocks:", error);
    
    // Only fall back to mock data if real data is not supposed to be used
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      throw error; // Propagate error when real data is expected
    }
    
    console.log("Using mock data as real data was not requested");
    return searchMockStocks(query);
  }
}
