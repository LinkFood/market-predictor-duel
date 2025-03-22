
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
        // The correct endpoint format for market indices - this is the real endpoint that Polygon supports
        const endpoint = `/v3/reference/indices?ticker=${ticker}`;
        console.log(`Fetching index data for ${name} (${ticker})`);
        
        const data = await callPolygonApi(endpoint);
        
        if (!data || !data.results || !data.results.length) {
          console.warn(`Invalid or empty data received for index ${ticker}`);
          return null;
        }
        
        const indexData = data.results[0];
        
        // If we don't have value or price, log and return null
        if (!indexData.value && !indexData.price) {
          console.warn(`Missing value or price data for index ${ticker}`);
          return null;
        }
        
        // Use value or price depending on what's available
        const currentValue = indexData.value || indexData.price;
        
        // For change, check if we have change data, otherwise default to 0
        const change = indexData.change || 0;
        const changePercent = indexData.change_percent || 0;
        
        return {
          name: name,
          value: currentValue,
          change: change,
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
