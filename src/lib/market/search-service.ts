
/**
 * Search Service
 * Handles searching for stocks by name or symbol
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { searchMockStocks } from "./mock-data-utils";
import { searchPolygonStocks } from "./polygon-api-service";

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
      return await searchPolygonStocks(query);
    } else {
      console.log(`🧪 Searching mock stocks for "${query}"`);
      return searchMockStocks(query);
    }
  } catch (error) {
    console.error("Error searching stocks:", error);
    console.log("Falling back to mock data");
    // Fall back to mock data on error
    return searchMockStocks(query);
  }
}
