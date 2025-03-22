
/**
 * Market Indices Service
 * Handles fetching market indices data
 */

import { MarketData } from "@/types";
import { FEATURES, config } from "../config";
import { getPolygonMarketIndices } from "./api/polygon-indices";
import { logError } from "../error-handling";

// Default mock indices data with ETF names
export const DEFAULT_INDICES: MarketData[] = [
  { 
    name: "SPDR S&P 500 ETF", 
    value: 523.43, 
    change: 1.25, 
    changePercent: 0.24,
    symbol: "SPY"
  },
  { 
    name: "SPDR Dow Jones Industrial Average ETF", 
    value: 387.22, 
    change: -0.82, 
    changePercent: -0.21,
    symbol: "DIA"
  },
  { 
    name: "Invesco QQQ Trust", 
    value: 428.67, 
    change: 2.34, 
    changePercent: 0.53,
    symbol: "QQQ"
  },
  { 
    name: "iShares Russell 2000 ETF", 
    value: 214.69, 
    change: -0.52, 
    changePercent: -0.24,
    symbol: "IWM"
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
      console.log(`🌐 Fetching real market indices data via ETF proxies from Polygon.io`);
      try {
        const data = await getPolygonMarketIndices();
        console.log("Received market indices data:", data);
        if (data && data.length > 0) {
          return { data, usingMockData: false };
        } else {
          console.warn("Empty or invalid market indices data received, falling back to mock data");
          usingMockData = true;
          return { data: DEFAULT_INDICES, usingMockData };
        }
      } catch (error) {
        console.error("Error fetching real market indices data:", error);
        // Fall back to mock data on error
        usingMockData = true;
        return { data: DEFAULT_INDICES, usingMockData };
      }
    } else {
      console.log(`🧪 Using mock market indices data`);
      usingMockData = true;
      return { data: DEFAULT_INDICES, usingMockData };
    }
  } catch (error) {
    logError(error, 'getMarketIndices');
    console.error("❌ Error fetching market indices:", error);
    
    // Fall back to mock data
    usingMockData = true;
    return { data: DEFAULT_INDICES, usingMockData };
  }
}
