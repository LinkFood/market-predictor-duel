/**
 * Mock Data Utilities
 * Helper functions for generating and managing mock market data
 */

import { mockStockData } from "@/data/mockData";
import { StockData, HistoricalData } from "./types";
import { POPULAR_TICKERS } from "./data/popular-tickers";

/**
 * Generate a mock stock data object based on symbol or name search
 */
export function getMockStockData(symbol: string): StockData {
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
}

/**
 * Generate mock historical data for a symbol
 */
export function getMockHistoricalData(
  symbol: string, 
  interval: 'daily' | 'weekly' | 'monthly' = 'daily',
  outputSize: 'compact' | 'full' = 'compact'
): HistoricalData {
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
}

/**
 * Filter mock stocks by search query
 */
export function searchMockStocks(query: string): StockData[] {
  return mockStockData
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
}

/**
 * Get mock top movers using the popular tickers list
 */
export function getMockTopMovers(): { gainers: StockData[]; losers: StockData[] } {
  const popularStocks = POPULAR_TICKERS.map(symbol => {
    // Try to find the stock in mockStockData first
    const mockStock = mockStockData.find(stock => 
      stock.symbol === symbol || 
      (stock.symbol && stock.symbol.toLowerCase() === symbol.toLowerCase())
    );
    
    if (mockStock) {
      return {
        symbol,
        name: mockStock.name,
        price: mockStock.value,
        change: mockStock.value * (mockStock.changePercent / 100),
        changePercent: mockStock.changePercent,
        volume: Math.floor(Math.random() * 10000000),
        datetime: new Date().toISOString()
      };
    }
    
    // Generate random data for this ticker if not found in mock data
    const basePrice = 50 + Math.random() * 150; // Random price between 50 and 200
    const changePercent = (Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1); // Random change -10% to +10%
    const change = basePrice * (changePercent / 100);
    
    return {
      symbol,
      name: `${symbol} Inc.`, // Simple name based on symbol
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000),
      datetime: new Date().toISOString()
    };
  });
  
  // Sort by percent change to find gainers and losers
  const sortedStocks = [...popularStocks].sort((a, b) => b.changePercent - a.changePercent);
  
  return {
    gainers: sortedStocks.slice(0, 5),
    losers: sortedStocks.slice(-5).reverse()
  };
}
