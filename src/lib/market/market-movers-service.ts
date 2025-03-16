
/**
 * Market Movers Service
 * Handles fetching top gainers and losers
 */

import { StockData } from "./types";
import { getMockTopMovers } from "./mock-data-utils";

/**
 * Get top gainers and losers for the day
 */
export async function getTopMovers(): Promise<{ gainers: StockData[]; losers: StockData[] }> {
  // In a real implementation, we would fetch this data from an API
  // For now, sort mock data by change percent
  return getMockTopMovers();
}
