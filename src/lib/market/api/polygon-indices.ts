
/**
 * Polygon.io Market Indices API Service
 * Handles fetching market indices data from Polygon API
 */

import { MarketData } from "@/types";
import { logError } from "../../error-handling";
import { callPolygonApi } from "./polygon-base";

// Map of index tickers to their display names
const INDEX_TICKERS = {
  "SPX": "S&P 500",
  "DJI": "Dow Jones",
  "COMP": "NASDAQ",
  "RUT": "Russell 2000"
};

/**
 * Get market indices data from Polygon API
 */
export async function getPolygonMarketIndices(): Promise<MarketData[]> {
  try {
    console.log(`🌐 Fetching market indices data from Polygon.io`);
    
    // Create an array of promises, one for each index
    const promises = Object.entries(INDEX_TICKERS).map(async ([ticker, name]) => {
      try {
        // The correct endpoint format for index snapshots
        const endpoint = `/v2/snapshot/indices/${ticker}`;
        console.log(`Fetching index data for ${name} (${ticker})`);
        
        const data = await callPolygonApi(endpoint);
        
        if (!data || !data.ticker || !data.value) {
          console.warn(`Invalid or empty data received for index ${ticker}`);
          return null;
        }
        
        // Calculate the percent change
        const changePercent = data.todaysChange / (data.value - data.todaysChange) * 100;
        
        return {
          name: name,
          value: data.value,
          change: data.todaysChange,
          changePercent: changePercent,
          symbol: ticker
        };
      } catch (error) {
        console.error(`Error fetching index ${ticker}:`, error);
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const results = await Promise.all(promises);
    
    // Filter out null results
    const indices = results.filter(result => result !== null) as MarketData[];
    
    console.log(`✅ Successfully fetched ${indices.length} market indices`);
    return indices;
    
  } catch (error) {
    logError(error, 'getPolygonMarketIndices');
    console.error(`❌ Error fetching market indices:`, error);
    throw error;
  }
}
