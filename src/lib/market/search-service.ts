
/**
 * Search Service
 * Handles searching for stocks by name or symbol
 */

import { StockData } from "./types";
import { API_ENDPOINT, API_KEY } from "./config";
import { searchMockStocks } from "./mock-data-utils";

/**
 * Search for stocks by keyword
 */
export async function searchStocks(query: string): Promise<StockData[]> {
  try {
    // In a real implementation, we would make an API call
    // For now, filter mock data
    return searchMockStocks(query);
    
    /* Uncomment this for actual API integration
    const response = await fetch(
      `${API_ENDPOINT}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Process the API response
    return data.bestMatches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency'],
      price: 0, // We'd need to make another API call to get the price
      change: 0,
      changePercent: 0,
      datetime: new Date().toISOString()
    }));
    */
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw error;
  }
}
