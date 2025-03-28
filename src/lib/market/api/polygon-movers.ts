
/**
 * Polygon.io Market Movers API Service
 * Handles interactions with the Polygon.io API for market movers data
 */

import { StockData } from "../types";
import { callPolygonApi } from "./polygon-base";

/**
 * Get market movers (gainers and losers) from Polygon.io
 */
export async function getPolygonMarketMovers(): Promise<{gainers: StockData[], losers: StockData[]}> {
  try {
    // For simplicity, we'll get snapshot data for major indices and sort them
    // In a real implementation, you'd want to use a dedicated endpoint for market movers
    const data = await callPolygonApi(`/v2/snapshot/locale/us/markets/stocks/tickers`);
    
    // Check if API returned tickers
    if (!data.tickers || data.tickers.length === 0) {
      throw new Error('No snapshot data available');
    }
    
    // Process tickers with price data
    const stocksWithData = data.tickers
      .filter(ticker => ticker.day && ticker.prevDay) // Ensure we have data
      .map(ticker => {
        const dayClose = ticker.day.c;
        const prevDayClose = ticker.prevDay.c;
        const change = dayClose - prevDayClose;
        const changePercent = (change / prevDayClose) * 100;
        
        return {
          symbol: ticker.ticker,
          name: ticker.ticker,
          price: dayClose,
          change,
          changePercent,
          volume: ticker.day.v,
          datetime: new Date().toISOString()
        };
      });
    
    // Sort by percent change
    const sortedStocks = [...stocksWithData].sort((a, b) => b.changePercent - a.changePercent);
    
    // Get top 5 gainers and losers
    return {
      gainers: sortedStocks.slice(0, 5),
      losers: sortedStocks.slice(-5).reverse()
    };
  } catch (error) {
    console.error('Error fetching Polygon market movers:', error);
    throw error;
  }
}
