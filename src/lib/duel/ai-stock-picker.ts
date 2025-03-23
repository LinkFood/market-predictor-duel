/**
 * AI Stock Picker
 * Functions for generating AI stock picks for bracket tournaments
 */
import { v4 as uuidv4 } from 'uuid';
import { BracketEntry, Direction, AIPersonality, EntryType } from './types';

// Stock data interface
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
}

// Mock stock data for different sectors
const techStocks: StockData[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.35, changePercent: 1.33, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 403.78, change: 3.45, changePercent: 0.86, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.34, change: 1.87, changePercent: 1.09, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 885.64, change: 15.23, changePercent: 1.75, sector: 'Technology' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1323.85, change: 18.54, changePercent: 1.42, sector: 'Technology' }
];

const financialStocks: StockData[] = [
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 197.45, change: 0.68, changePercent: 0.35, sector: 'Financial Services' },
  { symbol: 'BAC', name: 'Bank of America Corp.', price: 37.92, change: -0.28, changePercent: -0.73, sector: 'Financial Services' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.', price: 57.43, change: 0.32, changePercent: 0.56, sector: 'Financial Services' },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', price: 456.98, change: 3.21, changePercent: 0.71, sector: 'Financial Services' },
  { symbol: 'MS', name: 'Morgan Stanley', price: 97.23, change: 0.56, changePercent: 0.58, sector: 'Financial Services' }
];

const healthcareStocks: StockData[] = [
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.67, change: -1.23, changePercent: -0.80, sector: 'Healthcare' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.12, change: 0.34, changePercent: 1.22, sector: 'Healthcare' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 527.89, change: 4.32, changePercent: 0.83, sector: 'Healthcare' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', price: 167.94, change: 1.05, changePercent: 0.63, sector: 'Healthcare' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', price: 889.17, change: 12.45, changePercent: 1.42, sector: 'Healthcare' }
];

const energyStocks: StockData[] = [
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 114.98, change: -0.87, changePercent: -0.75, sector: 'Energy' },
  { symbol: 'CVX', name: 'Chevron Corporation', price: 154.63, change: -1.23, changePercent: -0.79, sector: 'Energy' },
  { symbol: 'COP', name: 'ConocoPhillips', price: 114.43, change: 0.56, changePercent: 0.49, sector: 'Energy' },
  { symbol: 'SLB', name: 'Schlumberger Limited', price: 48.23, change: 0.34, changePercent: 0.71, sector: 'Energy' },
  { symbol: 'EOG', name: 'EOG Resources Inc.', price: 124.56, change: 1.23, changePercent: 1.00, sector: 'Energy' }
];

const consumerStocks: StockData[] = [
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75, change: 1.87, changePercent: 1.06, sector: 'Consumer Cyclical' },
  { symbol: 'HD', name: 'Home Depot Inc.', price: 342.78, change: 2.34, changePercent: 0.69, sector: 'Consumer Cyclical' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 163.57, change: 0.45, changePercent: 0.28, sector: 'Consumer Defensive' },
  { symbol: 'KO', name: 'Coca-Cola Company', price: 60.87, change: 0.23, changePercent: 0.38, sector: 'Consumer Defensive' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', price: 173.32, change: 0.67, changePercent: 0.39, sector: 'Consumer Defensive' }
];

// AI Personality preferences map
const aiPreferences: Record<AIPersonality, {
  preferredSectors: string[],
  riskTolerance: 'low' | 'medium' | 'high',
  favorsBullish: boolean
}> = {
  'ValueHunter': {
    preferredSectors: ['Financial Services', 'Consumer Defensive'],
    riskTolerance: 'low',
    favorsBullish: false
  },
  'MomentumTrader': {
    preferredSectors: ['Technology', 'Energy'],
    riskTolerance: 'high',
    favorsBullish: true
  },
  'TrendFollower': {
    preferredSectors: ['Technology', 'Consumer Cyclical'],
    riskTolerance: 'medium',
    favorsBullish: true
  },
  'ContraThinker': {
    preferredSectors: ['Energy', 'Healthcare'],
    riskTolerance: 'high',
    favorsBullish: false
  },
  'GrowthSeeker': {
    preferredSectors: ['Technology', 'Healthcare'],
    riskTolerance: 'medium',
    favorsBullish: true
  },
  'DividendCollector': {
    preferredSectors: ['Consumer Defensive', 'Financial Services'],
    riskTolerance: 'low',
    favorsBullish: false
  }
};

// Combine all stocks
const allStocks = [
  ...techStocks,
  ...financialStocks,
  ...healthcareStocks,
  ...energyStocks,
  ...consumerStocks
];

/**
 * Generate AI stock picks based on the user's selections and AI personality
 */
export async function generateAIStockPicks(
  userSelections: { symbol: string; direction: Direction }[],
  size: number,
  aiPersonality: AIPersonality
): Promise<BracketEntry[]> {
  console.log('Generating AI picks for', aiPersonality, 'with size', size);
  
  // Get AI preferences
  const preferences = aiPreferences[aiPersonality];
  
  // Avoid picking the same stocks as the user
  const userSymbols = userSelections.map(s => s.symbol);
  const availableStocks = allStocks.filter(stock => !userSymbols.includes(stock.symbol));
  
  // Prioritize stocks from preferred sectors
  const preferredStocks = availableStocks.filter(stock => 
    preferences.preferredSectors.includes(stock.sector || 'Other')
  );
  
  // Select stocks based on AI personality
  let selectedStocks: StockData[] = [];
  
  // Start with preferred sector stocks
  if (preferredStocks.length >= size) {
    // If we have enough preferred stocks, randomly select from them
    selectedStocks = getRandomElements(preferredStocks, size);
  } else {
    // Otherwise, take all preferred stocks and add others until we reach the size
    selectedStocks = [
      ...preferredStocks,
      ...getRandomElements(
        availableStocks.filter(stock => !preferredStocks.includes(stock)), 
        size - preferredStocks.length
      )
    ];
  }
  
  // Convert stocks to bracket entries
  return selectedStocks.map((stock, index): BracketEntry => {
    // Determine direction based on AI personality and recent performance
    // Higher risk tolerance AIs are more likely to go against the trend
    let direction: Direction;
    
    if (preferences.riskTolerance === 'high') {
      // High risk tolerance - more likely to make contrarian bets
      direction = preferences.favorsBullish ? 'bullish' : 'bearish';
    } else if (preferences.riskTolerance === 'medium') {
      // Medium risk tolerance - mix of following trends and contrarian bets
      direction = stock.changePercent > 0 ? 'bullish' : 'bearish';
      // 30% chance to flip direction for medium risk
      if (Math.random() < 0.3) {
        direction = direction === 'bullish' ? 'bearish' : 'bullish';
      }
    } else {
      // Low risk tolerance - more likely to follow trends
      direction = stock.changePercent > 0 ? 'bullish' : 'bearish';
    }
    
    return {
      id: `ai-entry-${index + 1}`,
      symbol: stock.symbol,
      name: stock.name,
      entryType: 'stock',
      direction,
      startPrice: stock.price,
      marketCap: getMarketCapCategory(stock.symbol),
      sector: stock.sector || 'Other',
      order: index + 1
    };
  });
}

// Helper function to get random elements from an array
function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to determine market cap category
function getMarketCapCategory(symbol: string): 'large' | 'mid' | 'small' {
  const largeCapSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'JPM', 'JNJ', 'PG', 'XOM', 'UNH', 'LLY'];
  const midCapSymbols = ['GS', 'MS', 'SLB', 'EOG', 'ABBV', 'COP', 'HD', 'PEP', 'KO'];
  
  if (largeCapSymbols.includes(symbol)) return 'large';
  if (midCapSymbols.includes(symbol)) return 'mid';
  return 'small';
}
