
/**
 * Polygon.io Market Movers API Service
 * Handles interactions with the Polygon.io API for market movers data
 */

import { StockData } from "../types";
import { logError } from "../../error-handling";
import { callPolygonApi } from "./polygon-base";

/**
 * Get market movers (gainers and losers) from Polygon.io
 */
export async function getPolygonMarketMovers(): Promise<{gainers: StockData[], losers: StockData[]}> {
  try {
    // Using the snapshot endpoint to get data for major tickers
    const snapshotUrl = `/v2/snapshot/locale/us/markets/stocks/gainers`;
    console.log(`Fetching market movers using endpoint: ${snapshotUrl}`);
    
    // Get gainers first
    const gainersData = await callPolygonApi(snapshotUrl);
    
    // Now get losers
    const losersData = await callPolygonApi(`/v2/snapshot/locale/us/markets/stocks/losers`);
    
    if (!gainersData.tickers || !losersData.tickers) {
      console.error('Invalid response format from Polygon API:', { 
        gainersDataKeys: Object.keys(gainersData || {}),
        losersDataKeys: Object.keys(losersData || {})
      });
      throw new Error('Invalid response format from Polygon API');
    }

    console.log('Received gainers tickers count:', gainersData.tickers.length);
    console.log('Received losers tickers count:', losersData.tickers.length);
    console.log('Sample gainer data:', gainersData.tickers[0]);
    
    // Process gainers
    const gainers = gainersData.tickers
      .slice(0, 5)
      .map(ticker => mapSnapshotToStockData(ticker));
      
    // Process losers
    const losers = losersData.tickers
      .slice(0, 5)
      .map(ticker => mapSnapshotToStockData(ticker));
    
    console.log(`Successfully processed market movers: ${gainers.length} gainers, ${losers.length} losers`);
    console.log('Sample processed gainer:', gainers[0]);
    
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
  
  console.log(`Processed ticker ${ticker.ticker}:`, {
    price: todayClose,
    change,
    changePercent
  });
  
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
