/**
 * AI Stock Picker
 * 
 * This module generates AI stock picks for tournaments based on AI personality
 */
import { BracketEntry, BracketSize, Direction, AIPersonality, EntryType } from './types';

/**
 * Generate AI stock picks based on user entries and AI personality
 */
export async function generateAIStockPicks(
  userEntries: { symbol: string; direction: Direction }[],
  size: BracketSize,
  aiPersonality: AIPersonality
): Promise<BracketEntry[]> {
  // In a real implementation, this would use an API or algorithm based on the AI personality
  // For now, we'll create mock entries
  
  // Define some stocks the AI might pick based on personality
  const stocksByPersonality: Record<AIPersonality, string[]> = {
    ValueHunter: ['JPM', 'PG', 'JNJ', 'CSCO', 'KO', 'VZ', 'PFE', 'IBM', 'CVX', 'MRK'],
    MomentumTrader: ['NVDA', 'TSLA', 'AMD', 'PYPL', 'SQ', 'SHOP', 'COIN', 'ETSY', 'SNAP', 'UBER'],
    TrendFollower: ['AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'V', 'MA', 'CRM', 'ADBE', 'NFLX'],
    ContraThinker: ['GE', 'T', 'F', 'BAC', 'C', 'WFC', 'DIS', 'INTC', 'MU', 'XOM'],
    GrowthSeeker: ['PLTR', 'NET', 'DDOG', 'ZS', 'CRWD', 'SNOW', 'OKTA', 'TTD', 'TWLO', 'ROKU'],
    DividendCollector: ['JNJ', 'PG', 'KO', 'XOM', 'VZ', 'T', 'PFE', 'MRK', 'CVX', 'IBM']
  };
  
  // Shuffle and select stocks
  const potentialStocks = shuffleArray([...stocksByPersonality[aiPersonality]]);
  
  // Get sectors for differentiation
  const sectors = ['Technology', 'Financial', 'Healthcare', 'Energy', 'Consumer', 'Telecom', 'Industrial'];
  
  // Create entries based on size
  const entries: BracketEntry[] = [];
  for (let i = 0; i < size; i++) {
    // Get a stock that is different from user picks if possible
    let stockSymbol = potentialStocks[i % potentialStocks.length];
    if (userEntries.some(e => e.symbol === stockSymbol)) {
      stockSymbol = potentialStocks[(i + potentialStocks.length / 2) % potentialStocks.length];
    }
    
    // Determine direction based on AI personality and user choice
    let direction: Direction;
    const userPick = userEntries[i];
    
    if (aiPersonality === 'ContraThinker') {
      // ContraThinker tends to go against the user
      direction = userPick?.direction === 'bullish' ? 'bearish' : 'bullish';
    } else if (aiPersonality === 'TrendFollower') {
      // TrendFollower tends to follow market sentiment
      direction = Math.random() > 0.3 ? 'bullish' : 'bearish'; // Biased towards bullish
    } else {
      // Others have their own strategy
      direction = Math.random() > 0.5 ? 'bullish' : 'bearish';
    }
    
    // Create the entry
    entries.push({
      id: `ai-entry-${i + 1}`,
      symbol: stockSymbol,
      name: getStockName(stockSymbol),
      entryType: 'stock',
      direction,
      startPrice: getRandomPrice(50, 500),
      marketCap: getRandomMarketCap(),
      sector: getStockSector(stockSymbol),
      order: i + 1
    });
  }
  
  return entries;
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to get a random price
function getRandomPrice(min: number, max: number): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(2));
}

// Helper function to get a random market cap
function getRandomMarketCap(): "large" | "mid" | "small" {
  const options: ["large", "mid", "small"] = ["large", "mid", "small"];
  return options[Math.floor(Math.random() * options.length)];
}

// Helper function to get stock name
function getStockName(symbol: string): string {
  const stockNames: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    AMZN: "Amazon.com Inc.",
    GOOGL: "Alphabet Inc.",
    GOOG: "Alphabet Inc.",
    META: "Meta Platforms Inc.",
    TSLA: "Tesla Inc.",
    NVDA: "NVIDIA Corporation",
    AMD: "Advanced Micro Devices, Inc.",
    PYPL: "PayPal Holdings, Inc.",
    SQ: "Block, Inc.",
    SHOP: "Shopify Inc.",
    COIN: "Coinbase Global, Inc.",
    ETSY: "Etsy, Inc.",
    SNAP: "Snap Inc.",
    UBER: "Uber Technologies, Inc.",
    V: "Visa Inc.",
    JPM: "JPMorgan Chase & Co.",
    JNJ: "Johnson & Johnson",
    UNH: "UnitedHealth Group Inc.",
    PG: "Procter & Gamble Co.",
    MA: "Mastercard Inc.",
    HD: "Home Depot Inc.",
    BAC: "Bank of America Corp.",
    XOM: "Exxon Mobil Corporation",
    // ...more stocks
  };
  
  return stockNames[symbol] || `${symbol} Inc.`;
}

// Helper function to get stock sector
function getStockSector(symbol: string): string {
  const stockSectors: Record<string, string> = {
    AAPL: "Technology",
    MSFT: "Technology",
    AMZN: "Consumer Cyclical",
    GOOGL: "Technology",
    META: "Technology",
    TSLA: "Automotive",
    NVDA: "Technology",
    AMD: "Technology",
    PYPL: "Financial Technology",
    V: "Financial Services",
    JPM: "Financial Services",
    JNJ: "Healthcare",
    PG: "Consumer Defensive",
    MA: "Financial Services",
    // ...more sectors
  };
  
  return stockSectors[symbol] || "Technology";
}
