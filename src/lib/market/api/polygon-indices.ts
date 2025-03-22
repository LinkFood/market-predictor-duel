
/**
 * Polygon.io Market Indices API Service
 * Handles fetching market indices data from Polygon API
 */

import { MarketData } from "@/types";
import { logError } from "../../error-handling";
import { callPolygonApi } from "./polygon-base";

// Map of index tickers to their display names - using proper ticker format for indices (I:)
const INDEX_TICKERS = {
  "I:SPX": "S&P 500",
  "I:DJI": "Dow Jones",
  "I:COMP": "NASDAQ",
  "I:RUT": "Russell 2000"
};

/**
 * Get market indices data from Polygon API using the snapshot endpoint
 */
export async function getPolygonMarketIndices(): Promise<MarketData[]> {
  try {
    console.log(`🌐 Fetching market indices data from Polygon.io using snapshots endpoint`);
    
    // Use the snapshot endpoint which is more reliable for indices
    const endpoint = `/v2/snapshot/locale/us/markets/indices/tickers`;
    console.log(`Calling endpoint: ${endpoint}`);
    
    const data = await callPolygonApi(endpoint);
    
    if (!data || !data.tickers || !Array.isArray(data.tickers)) {
      console.warn(`Invalid or empty market indices snapshot data received`);
      return [];
    }
    
    console.log(`Received ${data.tickers.length} indices from snapshot endpoint`);
    
    // Map the tickers to our internal format
    const indices = Object.entries(INDEX_TICKERS).map(([tickerId, name]) => {
      // Find the corresponding ticker in the response
      const ticker = data.tickers.find(t => t.ticker === tickerId);
      
      if (!ticker) {
        console.warn(`Index data not found for ${name} (${tickerId})`);
        return null;
      }
      
      try {
        // Extract data from the response format
        const value = ticker.day?.c || ticker.prevDay?.c || 0;
        const prevClose = ticker.prevDay?.c || value;
        const change = value - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
        
        return {
          name,
          value,
          change,
          changePercent,
          symbol: tickerId.replace('I:', '') // Remove the 'I:' prefix for display
        };
      } catch (err) {
        console.error(`Error processing data for ${name}:`, err);
        return null;
      }
    }).filter(Boolean) as MarketData[];
    
    console.log(`✅ Successfully processed ${indices.length} market indices`);
    return indices;
    
  } catch (error) {
    logError(error, 'getPolygonMarketIndices');
    console.error(`❌ Error fetching market indices:`, error);
    throw error;
  }
}
