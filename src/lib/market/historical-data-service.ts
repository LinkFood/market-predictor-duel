
/**
 * Historical Data Service
 * Handles fetching historical stock data
 */

import { HistoricalData } from "./types";
import { API_ENDPOINT, API_KEY } from "./config";
import { getMockHistoricalData } from "./mock-data-utils";

/**
 * Get historical data for a ticker
 */
export async function getHistoricalData(
  symbol: string, 
  interval: 'daily' | 'weekly' | 'monthly' = 'daily',
  outputSize: 'compact' | 'full' = 'compact'
): Promise<HistoricalData> {
  try {
    // In a real implementation, we would make an API call
    // For now, generate mock historical data
    return getMockHistoricalData(symbol, interval, outputSize);
    
    /* Uncomment this for actual API integration
    const functionName = 
      interval === 'daily' ? 'TIME_SERIES_DAILY' : 
      interval === 'weekly' ? 'TIME_SERIES_WEEKLY' : 'TIME_SERIES_MONTHLY';
      
    const response = await fetch(
      `${API_ENDPOINT}?function=${functionName}&symbol=${symbol}&outputsize=${outputSize}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Process the API response
    const timeSeries = data[`Time Series (${interval.charAt(0).toUpperCase() + interval.slice(1)})`];
    
    const parsedData = Object.entries(timeSeries).map(([date, values]) => {
      const entry = values as Record<string, string>;
      return {
        date,
        open: parseFloat(entry['1. open']),
        high: parseFloat(entry['2. high']),
        low: parseFloat(entry['3. low']),
        close: parseFloat(entry['4. close']),
        volume: parseInt(entry['5. volume'], 10)
      };
    });
    
    return {
      symbol,
      data: parsedData
    };
    */
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
}
