
/**
 * Stock Data Service
 * Handles fetching current stock data
 */

import { StockData } from "./types";
import { API_ENDPOINT, API_KEY } from "./config";
import { getMockStockData } from "./mock-data-utils";

/**
 * Get current stock data for a ticker
 */
export async function getStockData(symbol: string): Promise<StockData> {
  try {
    // In a real implementation, we would make an API call
    // For now, return mock data
    return getMockStockData(symbol);
    
    /* Uncomment this for actual API integration
    const response = await fetch(
      `${API_ENDPOINT}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Process the API response
    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      datetime: new Date().toISOString()
    };
    */
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}
