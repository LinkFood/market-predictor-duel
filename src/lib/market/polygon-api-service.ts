
/**
 * Polygon.io API Service
 * Handles interactions with the Polygon.io API for market data through Supabase edge function
 */

import { StockData, HistoricalData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "../error-handling";
import { recordApiSuccess, recordApiFailure } from "../api-health-monitor";

/**
 * Call the Polygon API through our Supabase edge function
 */
async function callPolygonApi(endpoint: string, params = {}) {
  try {
    console.log(`Calling Polygon API endpoint ${endpoint} via edge function`);
    
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { 
        endpoint,
        params
      }
    });

    if (error) {
      console.error('Error calling polygon-market-data function:', error);
      recordApiFailure('polygon', error);
      throw error;
    }
    
    // Check if the response contains an error message from the edge function
    if (data && data.error) {
      console.error('Polygon API returned an error:', data.error, data.message);
      recordApiFailure('polygon', new Error(data.error));
      throw new Error(`Polygon API error: ${data.error} - ${data.message || ''}`);
    }
    
    // Record successful API call
    recordApiSuccess('polygon');
    
    console.log(`Successfully received data for ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`Error in callPolygonApi for ${endpoint}:`, error);
    recordApiFailure('polygon', error);
    throw error;
  }
}

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
    throw error;
  }
}

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
    logError(error, `getPolygonHistoricalData:${symbol}`);
    console.error(`Error fetching Polygon historical data for ${symbol}:`, error);
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
    logError(error, `searchPolygonStocks:${query}`);
    console.error(`Error searching Polygon stocks for ${query}:`, error);
    throw error;
  }
}

/**
 * Get market movers (gainers and losers) from Polygon.io
 */
export async function getPolygonMarketMovers(): Promise<{gainers: StockData[], losers: StockData[]}> {
  try {
    // Using the snapshot endpoint to get data for major tickers
    const snapshotUrl = `/v2/snapshot/locale/us/markets/stocks/gainers`;
    console.log(`Fetching market movers using endpoint: ${snapshotUrl}`);
    
    // Get gainers first
    const gainersData = await callPolygonApi(snapshotUrl);
    
    // Now get losers
    const losersData = await callPolygonApi(`/v2/snapshot/locale/us/markets/stocks/losers`);
    
    if (!gainersData.tickers || !losersData.tickers) {
      console.error('Invalid response format from Polygon API:', { 
        gainersDataKeys: Object.keys(gainersData || {}),
        losersDataKeys: Object.keys(losersData || {})
      });
      throw new Error('Invalid response format from Polygon API');
    }

    console.log('Received gainers tickers count:', gainersData.tickers.length);
    console.log('Received losers tickers count:', losersData.tickers.length);
    console.log('Sample gainer data:', gainersData.tickers[0]);
    
    // Process gainers
    const gainers = gainersData.tickers
      .slice(0, 5)
      .map(ticker => mapSnapshotToStockData(ticker));
      
    // Process losers
    const losers = losersData.tickers
      .slice(0, 5)
      .map(ticker => mapSnapshotToStockData(ticker));
    
    console.log(`Successfully processed market movers: ${gainers.length} gainers, ${losers.length} losers`);
    console.log('Sample processed gainer:', gainers[0]);
    
    return { gainers, losers };
  } catch (error) {
    logError(error, "getPolygonMarketMovers");
    console.error('Error fetching Polygon market movers:', error);
    throw error;
  }
}

/**
 * Helper function to map Polygon snapshot data to our StockData format
 */
function mapSnapshotToStockData(ticker: any): StockData {
  // Ensure we have the necessary data
  if (!ticker || !ticker.day) {
    console.warn('Incomplete ticker data:', ticker);
    throw new Error('Incomplete ticker data from Polygon API');
  }
  
  const todayClose = ticker.day.c;
  const todayOpen = ticker.day.o;
  
  // Handle different field names in the API response
  let change: number;
  let changePercent: number;
  
  if (ticker.todaysChange !== undefined) {
    change = ticker.todaysChange;
    changePercent = ticker.todaysChangePerc;
  } else {
    change = todayClose - todayOpen;
    changePercent = ((todayClose - todayOpen) / todayOpen) * 100;
  }
  
  console.log(`Processed ticker ${ticker.ticker}:`, {
    price: todayClose,
    change,
    changePercent
  });
  
  return {
    symbol: ticker.ticker,
    name: ticker.name || ticker.ticker,
    price: todayClose,
    change,
    changePercent,
    volume: ticker.day.v,
    datetime: new Date().toISOString()
  };
}

/**
 * Helper function to get a date X days ago in YYYY-MM-DD format
 */
function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
