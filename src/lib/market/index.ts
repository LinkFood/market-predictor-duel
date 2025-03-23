
/**
 * Market data utilities and API access
 */
import { StockData } from './types';
import { getMockStockData, searchMockStocks, getMockHistoricalData, getMockTopMovers } from './mock-data-utils';
import { FEATURES } from '@/lib/config';

/**
 * Search for stocks by name or symbol
 */
export async function searchStocks(query: string, limit: number = 5): Promise<{ results: StockData[], usingMockData: boolean }> {
  try {
    if (!FEATURES.enableRealMarketData) {
      // When real market data is disabled, always use mock data
      console.log('Using mock data for stock search');
      const mockResults = searchMockStocks(query).slice(0, limit);
      return { results: mockResults, usingMockData: true };
    }

    // Try to get real market data
    try {
      // This would be a real API call in the fully implemented version
      // For now, we'll fall back to mock data 
      console.log('Real market data API not implemented yet, using mock data');
      const mockResults = searchMockStocks(query).slice(0, limit);
      return { results: mockResults, usingMockData: true };
    } catch (error) {
      console.error('Error fetching real market data:', error);
      // Fall back to mock data on error
      const mockResults = searchMockStocks(query).slice(0, limit);
      return { results: mockResults, usingMockData: true };
    }
  } catch (error) {
    console.error('Error in searchStocks:', error);
    // Return empty results on error
    return { results: [], usingMockData: true };
  }
}

/**
 * Get stock data for a specific symbol
 */
export async function getStockData(symbol: string): Promise<{ data: StockData, usingMockData: boolean }> {
  try {
    if (!FEATURES.enableRealMarketData) {
      const mockData = getMockStockData(symbol);
      return { data: mockData, usingMockData: true };
    }

    try {
      // Real API call would go here
      const mockData = getMockStockData(symbol);
      return { data: mockData, usingMockData: true };
    } catch (error) {
      console.error('Error fetching real stock data:', error);
      const mockData = getMockStockData(symbol);
      return { data: mockData, usingMockData: true };
    }
  } catch (error) {
    console.error('Error in getStockData:', error);
    const mockData = getMockStockData(symbol);
    return { data: mockData, usingMockData: true };
  }
}

/**
 * Get historical data for a stock
 */
export async function getHistoricalData(symbol: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily') {
  try {
    if (!FEATURES.enableRealMarketData) {
      return { data: getMockHistoricalData(symbol, interval), usingMockData: true };
    }

    try {
      // Real API call would go here
      return { data: getMockHistoricalData(symbol, interval), usingMockData: true };
    } catch (error) {
      console.error('Error fetching real historical data:', error);
      return { data: getMockHistoricalData(symbol, interval), usingMockData: true };
    }
  } catch (error) {
    console.error('Error in getHistoricalData:', error);
    return { data: getMockHistoricalData(symbol, interval), usingMockData: true };
  }
}

/**
 * Get top market movers (gainers and losers)
 */
export async function getTopMovers() {
  try {
    if (!FEATURES.enableRealMarketData) {
      return { data: getMockTopMovers(), usingMockData: true };
    }

    try {
      // Real API call would go here
      return { data: getMockTopMovers(), usingMockData: true };
    } catch (error) {
      console.error('Error fetching real top movers:', error);
      return { data: getMockTopMovers(), usingMockData: true };
    }
  } catch (error) {
    console.error('Error in getTopMovers:', error);
    return { data: getMockTopMovers(), usingMockData: true };
  }
}

/**
 * Export all market utilities
 */
export * from './types';
