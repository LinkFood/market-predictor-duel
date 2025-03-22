
/**
 * Polygon.io Stocks API Service
 * Handles interactions with the Polygon.io API for stock data
 */

import { StockData } from "../types";
import { logError } from "../../error-handling";
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
    } catch (detailsError) {
      console.warn(`Could not fetch company details for ${symbol}:`, detailsError);
      // Continue with default name
    }

    // Process the data
    const result = data.results[0];
    
    // Calculate price change and percentage
    const change = result.c - result.o; // Close minus open
    const changePercent = ((result.c - result.o) / result.o) * 100;
    
    console.log(`Processed stock data for ${symbol}:`, {
      symbol,
      name,
      price: result.c,
      change,
      changePercent,
      open: result.o,
      high: result.h,
      low: result.l
    });

    return {
      symbol,
      name,
      price: result.c, // Close price
      change,
      changePercent,
      high52Week: null, // Need additional API call
      low52Week: null, // Need additional API call
      volume: result.v,
      datetime: new Date().toISOString()
    };
  } catch (error) {
    logError(error, `getPolygonStockData:${symbol}`);
    console.error(`Error fetching Polygon data for ${symbol}:`, error);
    throw error; // Rethrow to prevent silent fallback
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
        console.warn(`Failed to get price data for ${result.ticker}:`, error);
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
    logError(error, `searchPolygonStocks:${query}`);
    console.error(`Error searching Polygon stocks for ${query}:`, error);
    throw error; // Rethrow to prevent silent fallback
  }
}
