
/**
 * Polygon.io Historical Data API Service
 * Handles interactions with the Polygon.io API for historical market data
 */

import { HistoricalData } from "../types";
import { callPolygonApi, getDateXDaysAgo } from "./polygon-base";

/**
 * Get historical data for a ticker from Polygon.io
 */
export async function getPolygonHistoricalData(
  symbol: string,
  timespan: 'day' | 'week' | 'month' = 'day',
  fromDate: string = getDateXDaysAgo(30),
  toDate: string = new Date().toISOString().split('T')[0]
): Promise<HistoricalData> {
  try {
    const data = await callPolygonApi(
      `/v2/aggs/ticker/${symbol}/range/1/${timespan}/${fromDate}/${toDate}`
    );
    
    // Check if API returned results
    if (!data.results || data.results.length === 0) {
      throw new Error(`No historical data found for symbol ${symbol}`);
    }
    
    // Process the data
    return {
      symbol,
      data: data.results.map(result => {
        // Convert timestamp to date string (YYYY-MM-DD)
        const date = new Date(result.t);
        const dateStr = date.toISOString().split('T')[0];
        
        return {
          date: dateStr,
          open: result.o,
          high: result.h,
          low: result.l,
          close: result.c,
          volume: result.v
        };
      })
    };
  } catch (error) {
    console.error(`Error fetching Polygon historical data for ${symbol}:`, error);
    throw error;
  }
}
