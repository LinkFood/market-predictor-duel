/**
 * Market Data Service
 * Handles all interactions with stock market data APIs
 */

import { mockStockData } from "@/data/mockData";

// Types
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
  avgVolume?: number;
  yield?: number;
  beta?: number;
  datetime: string;
}

export interface HistoricalData {
  symbol: string;
  data: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

// You can use a free API like Alpha Vantage or Yahoo Finance API
// For now, we'll use mock data to demonstrate the functionality
const API_ENDPOINT = "https://www.alphavantage.co/query";
const API_KEY = "demo"; // Replace with your actual API key

/**
 * Get current stock data for a ticker
 */
export async function getStockData(symbol: string): Promise<StockData> {
  try {
    // In a real implementation, we would make an API call
    // For now, return mock data
    const mockStock = mockStockData.find(stock => 
      stock.name.toLowerCase().includes(symbol.toLowerCase()) ||
      stock.symbol?.toLowerCase() === symbol.toLowerCase()
    );
    
    if (mockStock) {
      return {
        symbol: symbol.toUpperCase(),
        name: mockStock.name,
        price: mockStock.value,
        change: mockStock.value * (mockStock.changePercent / 100),
        changePercent: mockStock.changePercent,
        marketCap: Math.random() * 1000000000,
        volume: Math.floor(Math.random() * 10000000),
        pe: 15 + Math.random() * 10,
        high52Week: mockStock.value * 1.2,
        low52Week: mockStock.value * 0.8,
        avgVolume: Math.floor(Math.random() * 8000000),
        yield: Math.random() * 3,
        beta: 0.8 + Math.random() * 0.7,
        datetime: new Date().toISOString()
      };
    }
    
    // Return default mock data if no match
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Inc.`,
      price: 150 + Math.random() * 100,
      change: 2.5,
      changePercent: 1.5,
      marketCap: 200000000000,
      volume: 5000000,
      pe: 20,
      high52Week: 250,
      low52Week: 120,
      avgVolume: 6000000,
      yield: 1.2,
      beta: 1.1,
      datetime: new Date().toISOString()
    };
    
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
    const days = outputSize === 'compact' ? 30 : 100;
    const mockStock = mockStockData.find(stock => 
      stock.name.toLowerCase().includes(symbol.toLowerCase()) ||
      stock.symbol?.toLowerCase() === symbol.toLowerCase()
    );
    
    let basePrice = mockStock ? mockStock.value : 150;
    const volatility = 0.02; // 2% daily volatility
    
    // Generate random price series with a slight upward trend
    const historicalData = Array.from({ length: days }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - index));
      
      // Add some randomness to the price
      const dailyChange = (Math.random() - 0.45) * volatility * basePrice;
      basePrice += dailyChange;
      
      const open = basePrice - (Math.random() * 2);
      const close = basePrice;
      const high = Math.max(open, close) + (Math.random() * 3);
      const low = Math.min(open, close) - (Math.random() * 3);
      
      return {
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 10000000)
      };
    });
    
    return {
      symbol: symbol.toUpperCase(),
      data: historicalData
    };
    
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

/**
 * Search for stocks by keyword
 */
export async function searchStocks(query: string): Promise<StockData[]> {
  try {
    // In a real implementation, we would make an API call
    // For now, filter mock data
    const results = mockStockData
      .filter(stock => 
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(stock => ({
        symbol: stock.symbol || stock.name.substring(0, 4).toUpperCase(),
        name: stock.name,
        price: stock.value,
        change: stock.value * (stock.changePercent / 100),
        changePercent: stock.changePercent,
        datetime: new Date().toISOString()
      }));
    
    return results;
    
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

/**
 * Get top gainers and losers for the day
 */
export async function getTopMovers(): Promise<{ gainers: StockData[]; losers: StockData[] }> {
  // In a real implementation, we would fetch this data from an API
  // For now, sort mock data by change percent
  const sortedStocks = [...mockStockData]
    .map(stock => ({
      symbol: stock.symbol || stock.name.substring(0, 4).toUpperCase(),
      name: stock.name,
      price: stock.value,
      change: stock.value * (stock.changePercent / 100),
      changePercent: stock.changePercent,
      datetime: new Date().toISOString()
    }))
    .sort((a, b) => b.changePercent - a.changePercent);
  
  return {
    gainers: sortedStocks.slice(0, 5),
    losers: sortedStocks.slice(-5).reverse()
  };
}