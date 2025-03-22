
/**
 * Polygon.io Market Movers API Service
 * Handles interactions with the Polygon.io API for market movers data
 * Uses a curated list of popular tickers instead of general gainers/losers
 */

import { StockData } from "../types";
import { logError } from "../../error-handling";
import { callPolygonApi } from "./polygon-base";
import { TICKER_BATCHES } from "../data/popular-tickers";

/**
 * Get market movers (gainers and losers) from Polygon.io
 * Uses a predefined list of popular tickers instead of the built-in gainers/losers endpoints
 */
export async function getPolygonMarketMovers(): Promise<{gainers: StockData[], losers: StockData[]}> {
  try {
    console.log(`🔍 Fetching popular tickers data for market movers from Polygon.io`);
    
    // Get the batches of tickers to request (Polygon limits the number of tickers per request)
    const tickerBatches = TICKER_BATCHES();
    console.log(`Fetching data for ${tickerBatches.length} batches of popular tickers`);
    
    // Array to hold all ticker data
    let allTickersData: any[] = [];
    
    // Fetch data for each batch of tickers
    for (let i = 0; i < tickerBatches.length; i++) {
      const batchTickers = tickerBatches[i];
      console.log(`Fetching batch ${i+1}/${tickerBatches.length} with ${batchTickers.split(',').length} tickers`);
      
      // Use the snapshot endpoint for our custom list of tickers
      const endpoint = `/v2/snapshot/locale/us/markets/stocks/tickers`;
      const params = { tickers: batchTickers };
      
      try {
        const batchData = await callPolygonApi(endpoint, params);
        
        if (!batchData || !batchData.tickers || !Array.isArray(batchData.tickers)) {
          console.warn(`Invalid response format for batch ${i+1}:`, batchData);
          continue;
        }
        
        console.log(`Received ${batchData.tickers.length} tickers in batch ${i+1}`);
        
        // Add tickers from this batch to our collection
        allTickersData = [...allTickersData, ...batchData.tickers];
      } catch (batchError) {
        console.error(`Error fetching batch ${i+1}:`, batchError);
        // Continue with other batches even if one fails
      }
    }
    
    console.log(`Successfully fetched data for ${allTickersData.length} tickers in total`);
    
    if (allTickersData.length === 0) {
      throw new Error('No ticker data received from Polygon API');
    }
    
    // Process all tickers
    const processedTickers = allTickersData
      .filter(ticker => ticker && ticker.day) // Filter out any invalid ticker data
      .map(ticker => mapSnapshotToStockData(ticker));
    
    // Sort by percent change to identify gainers and losers
    processedTickers.sort((a, b) => b.changePercent - a.changePercent);
    
    // Get top 5 gainers and bottom 5 losers
    const gainers = processedTickers.slice(0, 5);
    const losers = processedTickers.slice(-5).reverse();
    
    console.log(`Successfully processed market movers from popular tickers: ${gainers.length} gainers, ${losers.length} losers`);
    console.log('Sample gainer:', gainers.length > 0 ? gainers[0].symbol : 'none');
    console.log('Sample loser:', losers.length > 0 ? losers[0].symbol : 'none');
    
    return { gainers, losers };
  } catch (error) {
    logError(error, "getPolygonMarketMovers");
    console.error('Error fetching Polygon market movers:', error);
    throw error; // Rethrow to prevent silent fallback
  }
}

/**
 * Helper function to map Polygon snapshot data to our StockData format
 */
function mapSnapshotToStockData(ticker: any): StockData {
  // Ensure we have the necessary data
  if (!ticker || !ticker.day) {
    console.warn('Incomplete ticker data:', ticker);
    throw new Error('Incomplete ticker data from Polygon API');
  }
  
  const todayClose = ticker.day.c;
  const todayOpen = ticker.day.o;
  
  // Handle different field names in the API response
  let change: number;
  let changePercent: number;
  
  if (ticker.todaysChange !== undefined) {
    change = ticker.todaysChange;
    changePercent = ticker.todaysChangePerc;
  } else {
    change = todayClose - todayOpen;
    changePercent = ((todayClose - todayOpen) / todayOpen) * 100;
  }
  
  return {
    symbol: ticker.ticker,
    name: ticker.name || ticker.ticker,
    price: todayClose,
    change,
    changePercent,
    volume: ticker.day.v,
    datetime: new Date().toISOString()
  };
}
