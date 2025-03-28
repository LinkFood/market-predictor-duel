
/**
 * Polygon.io Stocks API Service
 * Handles interactions with the Polygon.io API for stock data
 */

import { StockData } from "../types";
import { callPolygonApi } from "./polygon-base";

/**
 * Get current stock data for a ticker from Polygon.io
 */
export async function getPolygonStockData(symbol: string): Promise<StockData> {
  try {
    // Fetch previous close data
    const data = await callPolygonApi(`/v2/aggs/ticker/${symbol}/prev`);

    // Check if API returned results
    if (!data.results || data.results.length === 0) {
      throw new Error(`No data found for symbol ${symbol}`);
    }
    
    // Get ticker details for the company name
    let name = `${symbol} Stock`;
    
    try {
      const detailsData = await callPolygonApi(`/v3/reference/tickers/${symbol}`);
      if (detailsData.results) {
        name = detailsData.results.name || name;
      }
    } catch (error) {
      console.error(`Error fetching Polygon ticker details for ${symbol}:`, error);
      // Continue with default name
    }
    
    // Process the data
    const result = data.results[0];
    return {
      symbol,
      name,
      price: result.c, // Close price
      change: result.c - result.o, // Close minus open
      changePercent: ((result.c - result.o) / result.o) * 100,
      high52Week: null, // Need additional API call
      low52Week: null, // Need additional API call
      volume: result.v,
      datetime: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching Polygon data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Search for stocks by name or symbol using Polygon.io
 */
export async function searchPolygonStocks(query: string): Promise<StockData[]> {
  try {
    // Search for tickers
    const data = await callPolygonApi(
      `/v3/reference/tickers`,
      {
        search: query,
        active: true,
        sort: 'ticker',
        order: 'asc',
        limit: 10
      }
    );

    // Check if API returned results
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    // Process and return the results
    const promises = data.results.map(async (result) => {
      try {
        // Get latest price data for each result
        return await getPolygonStockData(result.ticker);
      } catch (error) {
        // Return basic stock data if price fetch fails
        return {
          symbol: result.ticker,
          name: result.name || `${result.ticker} Stock`,
          price: 0,
          change: 0,
          changePercent: 0,
          datetime: new Date().toISOString()
        };
      }
    });
    
    return await Promise.all(promises);
  } catch (error) {
    console.error(`Error searching Polygon stocks for ${query}:`, error);
    throw error;
  }
}
