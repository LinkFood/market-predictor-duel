
/**
 * Polygon.io Market Indices API Service
 * Handles fetching market indices data from Polygon API using ETFs as proxies
 */

import { MarketData } from "@/types";
import { logError } from "../../error-handling";
import { callPolygonApi } from "./polygon-base";

// Map ETF tickers to their actual ETF names
const ETF_TO_INDEX_MAP = {
  "SPY": "SPDR S&P 500 ETF",
  "DIA": "SPDR Dow Jones Industrial Average ETF",
  "QQQ": "Invesco QQQ Trust",
  "IWM": "iShares Russell 2000 ETF"
};

/**
 * Get market indices data from Polygon API using popular ETFs as proxies
 */
export async function getPolygonMarketIndices(): Promise<MarketData[]> {
  try {
    console.log(`🌐 Fetching market indices data via ETF proxies from Polygon.io`);
    
    // Use the stocks/snapshot endpoint which is more reliable for ETFs
    const endpoint = `/v2/snapshot/locale/us/markets/stocks/tickers`;
    const params = {
      tickers: Object.keys(ETF_TO_INDEX_MAP).join(',') // Format: SPY,DIA,QQQ,IWM
    };
    
    console.log(`Calling endpoint: ${endpoint} with tickers: ${params.tickers}`);
    
    const data = await callPolygonApi(endpoint, params);
    
    if (!data || !data.tickers || !Array.isArray(data.tickers)) {
      console.warn(`Invalid or empty ETF snapshot data received`);
      return [];
    }
    
    console.log(`Received ${data.tickers.length} ETFs from snapshot endpoint`);
    
    // Map the ETF data to our internal index format
    const indices = Object.entries(ETF_TO_INDEX_MAP).map(([symbol, etfName]) => {
      // Find the corresponding ETF in the response
      const ticker = data.tickers.find(t => t.ticker === symbol);
      
      if (!ticker) {
        console.warn(`ETF data not found for ${etfName} (${symbol})`);
        return null;
      }
      
      try {
        // Extract data from the ETF response format
        const value = ticker.day?.c || ticker.prevDay?.c || 0;
        const prevClose = ticker.prevDay?.c || value;
        const change = value - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
        
        return {
          name: etfName,
          value,
          change,
          changePercent,
          symbol // Keep the ETF symbol
        };
      } catch (err) {
        console.error(`Error processing data for ${etfName}:`, err);
        return null;
      }
    }).filter(Boolean) as MarketData[];
    
    console.log(`✅ Successfully processed ${indices.length} market indices via ETFs`);
    return indices;
    
  } catch (error) {
    logError(error, 'getPolygonMarketIndices');
    console.error(`❌ Error fetching market indices via ETFs:`, error);
    throw error;
  }
}
