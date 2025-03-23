
/**
 * Market Movers Service
 * Fetches top gaining and losing stocks
 */

import { StockData } from './types';
import { callPolygonApi, getDateXDaysAgo } from './api/polygon-api-service';
import { getMockTopMovers } from './mock-data-utils';
import { FEATURES, API_ERRORS } from '../config';

/**
 * Fetches the top gaining and losing stocks for the current day
 */
export async function getTopMovers(): Promise<{ 
  gainers: StockData[], 
  losers: StockData[], 
  usingMockData: boolean 
}> {
  if (FEATURES.enableMockData) {
    console.log('Using mock data for top movers');
    const { gainers, losers } = getMockTopMovers();
    return {
      gainers,
      losers,
      usingMockData: true
    };
  }
  
  try {
    // Get the date for today's movers
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    
    // Fetch gainers
    const gainers = await getMovers('gainers', formattedToday);
    
    // Fetch losers
    const losers = await getMovers('losers', formattedToday);
    
    return {
      gainers,
      losers,
      usingMockData: false
    };
  } catch (error: any) {
    if (error.name === 'PolygonApiKeyError') {
      console.error('Polygon API key error:', error);
      const { gainers, losers } = getMockTopMovers();
      return {
        gainers,
        losers,
        usingMockData: true
      };
    }
    
    console.error('Error fetching top movers:', error);
    throw error;
  }
}

/**
 * Fetches the top movers (gainers or losers) for a specific date
 */
async function getMovers(direction: 'gainers' | 'losers', date: string): Promise<StockData[]> {
  try {
    const endpoint = `/v2/snapshot/locale/us/markets/stocks/direction/${direction}`;
    const params = {
      date: date
    };
    
    const data = await callPolygonApi(endpoint, params);
    
    if (!data || !data.tickers) {
      console.warn(`No ${direction} found for date: ${date}`);
      return [];
    }
    
    // Map the Polygon API response to the StockData interface
    const movers: StockData[] = data.tickers.map((ticker: any) => ({
      symbol: ticker.ticker,
      name: ticker.ticker, // The ticker name is not available in the response
      price: ticker.lastTrade.price,
      change: ticker.todaysChange,
      changePercent: ticker.todaysChangePerc,
      marketCap: ticker.marketCap,
      volume: ticker.volume,
      datetime: new Date(ticker.lastTrade.timestamp).toISOString(),
      usingMockData: false
    }));
    
    return movers;
  } catch (error) {
    console.error(`Error fetching ${direction} for date ${date}:`, error);
    throw error;
  }
}
