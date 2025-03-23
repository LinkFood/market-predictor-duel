/**
 * AI Stock Picker
 * Handles AI selection of stocks for brackets
 */

import { searchStocks } from "@/lib/market";
import { StockData } from "@/lib/market/types";
import { Direction, AIPersonality, BracketEntry } from "./types";
import { getAllAIPersonalities } from "./ai-personalities";

/**
 * Get stocks for a specific sector
 */
export async function getSectorStocks(sector: string, count: number = 10): Promise<StockData[]> {
  try {
    const result = await searchStocks(sector, count * 2);
    if (!result || !result.results) {
      console.error('No search results found for sector:', sector);
      return [];
    }
    
    // Filter stocks by sector
    const sectorStocks = result.results.filter(stock => 
      stock.sector && stock.sector.toLowerCase().includes(sector.toLowerCase())
    );
    
    // If we don't have enough sector-specific stocks, return what we have
    if (sectorStocks.length < count) {
      return sectorStocks;
    }
    
    // Otherwise, return the requested number
    return sectorStocks.slice(0, count);
  } catch (error) {
    console.error('Error getting sector stocks:', error);
    return [];
  }
}

/**
 * Get stocks for a specific market cap range
 */
export async function getMarketCapStocks(marketCap: 'large' | 'mid' | 'small', count: number = 10): Promise<StockData[]> {
  try {
    const searchTerm = marketCap === 'large' ? 'large cap' : 
                      marketCap === 'mid' ? 'mid cap' : 'small cap';
    
    const result = await searchStocks(searchTerm, count * 2);
    if (!result || !result.results) {
      console.error('No search results found for market cap:', marketCap);
      return [];
    }
    
    // Just return the first N results, as the search should already filter by market cap
    return result.results.slice(0, count);
  } catch (error) {
    console.error('Error getting market cap stocks:', error);
    return [];
  }
}

/**
 * Get stocks that match an AI personality's preferences
 */
export async function getAIPersonalityStocks(
  personality: AIPersonality, 
  count: number = 10
): Promise<StockData[]> {
  try {
    // Get the AI personality profile
    const aiProfiles = getAllAIPersonalities();
    const profile = aiProfiles.find(p => p.id === personality);
    
    if (!profile) {
      console.error('AI personality not found:', personality);
      return [];
    }
    
    // Use the AI's favored sectors to find stocks
    const favoredSector = profile.favoredSectors[0]; // Just use the first favored sector
    const stocks = await getSectorStocks(favoredSector, count);
    
    return stocks;
  } catch (error) {
    console.error('Error getting AI personality stocks:', error);
    return [];
  }
}

/**
 * Determine if a stock should be bullish or bearish based on AI personality
 */
export function determineDirection(
  stock: StockData, 
  personality: AIPersonality
): Direction {
  // Get the AI personality profile
  const aiProfiles = getAllAIPersonalities();
  const profile = aiProfiles.find(p => p.id === personality);
  
  if (!profile) {
    // Default to random if profile not found
    return Math.random() > 0.5 ? 'bullish' : 'bearish';
  }
  
  // Different personalities have different strategies
  switch (personality) {
    case 'ValueHunter':
      // Value hunters like stocks with low P/E ratios
      return (stock.pe && stock.pe < 15) ? 'bullish' : 'bearish';
      
    case 'MomentumTrader':
      // Momentum traders follow recent trends
      return stock.change > 0 ? 'bullish' : 'bearish';
      
    case 'TrendFollower':
      // Trend followers are more likely to be bullish in general
      return stock.change > -1 ? 'bullish' : 'bearish';
      
    case 'ContraThinker':
      // Contrarians go against recent trends
      return stock.change < 0 ? 'bullish' : 'bearish';
      
    case 'GrowthSeeker':
      // Growth seekers like tech and high-growth sectors
      return (stock.sector === 'Technology' || stock.sector === 'Healthcare') ? 'bullish' : 'bearish';
      
    case 'DividendCollector':
      // Dividend collectors like stocks with good yields
      return (stock.yield && stock.yield > 2) ? 'bullish' : 'bearish';
      
    default:
      // Default to random
      return Math.random() > 0.5 ? 'bullish' : 'bearish';
  }
}

/**
 * Generate AI bracket entries based on personality
 */
export async function generateAIEntries(
  personality: AIPersonality,
  count: number
): Promise<BracketEntry[]> {
  try {
    // Get stocks that match the AI's personality
    const stocks = await getAIPersonalityStocks(personality, count);
    
    // If we don't have enough stocks, fill with some general ones
    if (stocks.length < count) {
      const additionalStocks = await searchStocks('popular stocks', count - stocks.length);
      if (additionalStocks && additionalStocks.results) {
        stocks.push(...additionalStocks.results.slice(0, count - stocks.length));
      }
    }
    
    // Convert stocks to bracket entries
    const entries: BracketEntry[] = stocks.map((stock, index) => {
      const direction = determineDirection(stock, personality);
      
      return {
        id: `ai-entry-${index + 1}`,
        symbol: stock.symbol,
        name: stock.name,
        entryType: 'stock',
        direction,
        startPrice: stock.price,
        marketCap: stock.marketCap && stock.marketCap > 10000000000 ? 'large' : 
                  stock.marketCap && stock.marketCap > 2000000000 ? 'mid' : 'small',
        sector: stock.sector || 'Unknown',
        order: index + 1
      };
    });
    
    return entries;
  } catch (error) {
    console.error('Error generating AI entries:', error);
    
    // Return mock entries if we can't get real ones
    return Array.from({ length: count }).map((_, index) => ({
      id: `ai-entry-${index + 1}`,
      symbol: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC', 'NFLX'][index % 10],
      name: ['Apple', 'Microsoft', 'Google', 'Amazon', 'Meta', 'Tesla', 'NVIDIA', 'AMD', 'Intel', 'Netflix'][index % 10],
      entryType: 'stock',
      direction: Math.random() > 0.5 ? 'bullish' : 'bearish',
      startPrice: 100 + Math.random() * 200,
      marketCap: 'large',
      sector: 'Technology',
      order: index + 1
    }));
  }
}
