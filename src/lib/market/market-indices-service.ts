
/**
 * Market Indices Service
 * Handles fetching market indices data
 */

import { MarketData } from "@/types";
import { FEATURES, config } from "../config";
import { getPolygonMarketIndices } from "./api/polygon-indices";
import { logError } from "../error-handling";

// Default mock indices data
export const DEFAULT_INDICES: MarketData[] = [
  { 
    name: "S&P 500", 
    value: 5234.32, 
    change: 12.45, 
    changePercent: 0.24,
    symbol: "SPX"
  },
  { 
    name: "Dow Jones", 
    value: 38721.78, 
    change: -82.12, 
    changePercent: -0.21,
    symbol: "DJI"
  },
  { 
    name: "NASDAQ", 
    value: 16432.67, 
    change: 87.34, 
    changePercent: 0.53,
    symbol: "COMP"
  },
  { 
    name: "Russell 2000", 
    value: 2146.89, 
    change: -5.23, 
    changePercent: -0.24,
    symbol: "RUT"
  }
];

/**
 * Get current market indices data
 */
export async function getMarketIndices(): Promise<{ data: MarketData[]; usingMockData: boolean }> {
  let usingMockData = false;
  
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Fetching real market indices data from Polygon.io`);
      try {
        const data = await getPolygonMarketIndices();
        if (data && data.length > 0) {
          return { data, usingMockData: false };
        } else {
          console.warn("Empty or invalid market indices data received, falling back to mock data");
          usingMockData = true;
          return { data: DEFAULT_INDICES, usingMockData };
        }
      } catch (error) {
        console.error("Error fetching real market indices data:", error);
        throw error; // Rethrow so we don't silently fall back
      }
    } else {
      console.log(`🧪 Using mock market indices data`);
      usingMockData = true;
      return { data: DEFAULT_INDICES, usingMockData };
    }
  } catch (error) {
    logError(error, 'getMarketIndices');
    console.error("❌ Error fetching market indices:", error);
    
    // Only fall back to mock data if real data is not supposed to be used
    if (!FEATURES.enableRealMarketData || !config.polygon.enabled) {
      console.log("Using mock data as real data was not requested");
      usingMockData = true;
      return { data: DEFAULT_INDICES, usingMockData };
    }
    
    throw error; // Propagate error when real data is expected
  }
}
