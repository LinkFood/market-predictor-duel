/**
 * Test module for Polygon.io API integration
 * This file contains test functions for the Polygon API service
 */

import { getPolygonStockData, getPolygonHistoricalData, searchPolygonStocks, getPolygonMarketMovers } from './polygon-api-service';

// Test stock data retrieval function
export async function testGetStockData(symbol: string = 'AAPL') {
  try {
    console.log(`Fetching Polygon.io data for ${symbol}...`);
    const result = await getPolygonStockData(symbol);
    console.log('Polygon API result:', result);
    return result;
  } catch (error) {
    console.error('Polygon API test failed:', error);
    throw error;
  }
}

// Test historical data retrieval function
export async function testGetHistoricalData(symbol: string = 'AAPL', timespan: 'day' | 'week' | 'month' = 'day') {
  try {
    console.log(`Fetching Polygon.io historical data for ${symbol}...`);
    const result = await getPolygonHistoricalData(symbol, timespan);
    console.log(`Polygon API historical data (${result.data.length} points):`, result.data.slice(0, 3));
    return result;
  } catch (error) {
    console.error('Polygon API historical data test failed:', error);
    throw error;
  }
}

// Test stock search function
export async function testSearchStocks(query: string = 'Apple') {
  try {
    console.log(`Searching Polygon.io for "${query}"...`);
    const result = await searchPolygonStocks(query);
    console.log(`Polygon API search results (${result.length} items):`, result);
    return result;
  } catch (error) {
    console.error('Polygon API search test failed:', error);
    throw error;
  }
}

// Test market movers function
export async function testGetMarketMovers() {
  try {
    console.log('Fetching Polygon.io market movers...');
    const result = await getPolygonMarketMovers();
    console.log('Polygon API market movers:');
    console.log('- Gainers:', result.gainers.slice(0, 3));
    console.log('- Losers:', result.losers.slice(0, 3));
    return result;
  } catch (error) {
    console.error('Polygon API market movers test failed:', error);
    throw error;
  }
}

// Run all tests
export async function runAllPolygonTests() {
  try {
    // Test basic stock data
    await testGetStockData('AAPL');
    await testGetStockData('MSFT');
    
    // Test historical data
    await testGetHistoricalData('AAPL', 'day');
    
    // Test search
    await testSearchStocks('tech');
    
    // Test market movers
    await testGetMarketMovers();
    
    console.log('✅ All Polygon API tests completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Polygon API tests failed:', error);
    return false;
  }
}