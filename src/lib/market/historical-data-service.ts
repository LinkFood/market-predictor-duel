
/**
 * Historical Data Service
 * Handles fetching historical stock data
 */

import { HistoricalData } from "./types";
import { FEATURES, config } from "../config";
import { getMockHistoricalData } from "./mock-data-utils";
import { getPolygonHistoricalData } from "./polygon-api-service";

/**
 * Get historical data for a ticker
 */
export async function getHistoricalData(
  symbol: string, 
  interval: 'daily' | 'weekly' | 'monthly' = 'daily',
  outputSize: 'compact' | 'full' = 'compact'
): Promise<HistoricalData> {
  try {
    // Map our interval to Polygon's timespan
    const timespan = interval === 'daily' ? 'day' : 
                     interval === 'weekly' ? 'week' : 'month';
    
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Fetching real historical data for ${symbol} from Polygon.io`);
      return await getPolygonHistoricalData(symbol, timespan);
    } else {
      console.log(`🧪 Using mock historical data for ${symbol}`);
      return getMockHistoricalData(symbol, interval, outputSize);
    }
  } catch (error) {
    console.error("Error fetching historical data:", error);
    console.log("Falling back to mock data");
    // Fall back to mock data on error
    return getMockHistoricalData(symbol, interval, outputSize);
  }
}
