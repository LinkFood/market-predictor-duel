
/**
 * Search Service
 * Handles searching for stocks by name or symbol
 */

import { StockData } from "./types";
import { FEATURES, config } from "../config";
import { searchMockStocks } from "./mock-data-utils";
import { searchPolygonStocks } from "./api/polygon-stocks";
import { logError } from "../error-handling";

/**
 * Search for stocks by keyword
 */
export async function searchStocks(query: string): Promise<{ results: StockData[]; usingMockData: boolean }> {
  let usingMockData = false;
  
  try {
    // Check if query is empty
    if (!query.trim()) {
      return { results: [], usingMockData: false };
    }
    
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Searching for stocks matching "${query}" via Polygon.io`);
      try {
        const results = await searchPolygonStocks(query);
        return { results, usingMockData: false };
      } catch (error) {
        logError(error, `searchStocks:${query}`);
        console.error("Error searching stocks via Polygon API:", error);
        throw error; // Rethrow to prevent silent fallback
      }
    } else {
      console.log(`🧪 Searching mock stocks for "${query}"`);
      usingMockData = true;
      return { results: searchMockStocks(query), usingMockData };
    }
  } catch (error) {
    logError(error, `searchStocks:${query}`);
    console.error("Error searching stocks:", error);
    
    // Only fall back to mock data if real data is not supposed to be used
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      throw error; // Propagate error when real data is expected
    }
    
    console.log("Using mock data as real data was not requested");
    usingMockData = true;
    return { results: searchMockStocks(query), usingMockData };
  }
}
