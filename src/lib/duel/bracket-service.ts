
/**
 * Bracket Service
 * Functions for managing stock bracket tournaments
 */
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/auth-context';
import { Bracket, BracketTimeframe, BracketSize, Direction, AIPersonality, BracketEntry, BracketStatus } from './types';
import { createMockBracket } from '@/data/mockData';
import { generateAIStockPicks } from './ai-stock-picker';
import { toast } from 'sonner';

// Create a new bracket
export async function createBracket(
  timeframe: BracketTimeframe,
  size: BracketSize,
  userEntries: { symbol: string; direction: Direction }[],
  aiPersonality: AIPersonality = "ValueHunter"
): Promise<Bracket> {
  try {
    // In a real implementation, this would call an API or Supabase
    // For now, we'll create a mock bracket
    const bracketId = `bracket-${uuidv4()}`;
    
    console.log(`Creating bracket with timeframe: ${timeframe}, size: ${size}, aiPersonality: ${aiPersonality}`);
    console.log('User entries:', userEntries);
    
    // Generate AI entries based on the user's selections and AI personality
    const aiEntries = await generateAIStockPicks(userEntries, size, aiPersonality);
    console.log('AI entries:', aiEntries);
    
    // Format user entries
    const formattedUserEntries: BracketEntry[] = userEntries.map((entry, index) => ({
      id: `user-entry-${index + 1}`,
      symbol: entry.symbol,
      name: getStockName(entry.symbol),
      entryType: 'stock',
      direction: entry.direction,
      startPrice: getRandomPrice(50, 500),
      marketCap: getRandomMarketCap(),
      sector: getStockSector(entry.symbol),
      order: index + 1
    }));
    
    // Create initial matches
    const matches = generateInitialMatches(size);
    
    // Create the bracket object
    const bracket: Bracket = {
      id: bracketId,
      userId: 'current-user', // In a real app, get from auth context
      name: generateBracketName(timeframe, aiPersonality),
      timeframe: timeframe,
      size: size,
      status: 'pending',
      aiPersonality: aiPersonality,
      userEntries: formattedUserEntries,
      aiEntries,
      matches,
      startDate: new Date().toISOString(),
      endDate: getEndDate(timeframe),
      createdAt: new Date().toISOString(),
      userPoints: 0,
      aiPoints: 0
    };
    
    // In a real implementation, save to database
    console.log('Created bracket:', bracket);
    
    return bracket;
  } catch (error) {
    console.error('Error creating bracket:', error);
    throw new Error('Failed to create bracket');
  }
}

// Get all brackets for the current user
export async function getUserBrackets(): Promise<Bracket[]> {
  try {
    // In a real implementation, this would call an API or Supabase
    // For now, we'll return mock data
    return [
      createMockBracket('bracket-1'),
      createMockBracket('bracket-2'),
      createMockBracket('bracket-3')
    ];
  } catch (error) {
    console.error('Error getting user brackets:', error);
    throw new Error('Failed to get user brackets');
  }
}

// Get a bracket by ID
export async function getBracketById(id: string): Promise<Bracket> {
  try {
    // In a real implementation, this would call an API or Supabase
    // For now, we'll return mock data
    return createMockBracket(id);
  } catch (error) {
    console.error(`Error getting bracket ${id}:`, error);
    throw new Error('Failed to get bracket');
  }
}

// Complete a bracket (simulate the bracket completion process)
export async function completeBracket(id: string): Promise<Bracket> {
  try {
    // Get the current bracket
    const bracket = await getBracketById(id);
    
    // Update match results
    const updatedMatches = bracket.matches.map(match => {
      if (!match.completed) {
        // Randomly determine a winner
        const winner = Math.random() > 0.5 ? match.entry1Id : match.entry2Id;
        return {
          ...match,
          completed: true,
          winnerId: winner
        };
      }
      return match;
    });
    
    // Randomly calculate final percentages
    const userPoints = Math.random() * 10;
    const aiPoints = Math.random() * 10;
    
    // Determine overall winner
    const winnerId = userPoints > aiPoints ? 'user' : 'ai';
    
    // Create updated bracket
    const updatedBracket: Bracket = {
      ...bracket,
      status: 'completed',
      matches: updatedMatches,
      userPoints,
      aiPoints,
      winnerId
    };
    
    // In a real implementation, save to database
    console.log('Completed bracket:', updatedBracket);
    
    return updatedBracket;
  } catch (error) {
    console.error(`Error completing bracket ${id}:`, error);
    throw new Error('Failed to complete bracket');
  }
}

// Helper functions
function generateBracketName(timeframe: BracketTimeframe, aiPersonality: AIPersonality): string {
  const timeframeNames = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
  };
  
  const themes = [
    'Tech Showdown',
    'Market Battle',
    'Stock Duel',
    'Sector Clash',
    'Bull vs Bear',
    'Trading Faceoff'
  ];
  
  return `${timeframeNames[timeframe]} ${themes[Math.floor(Math.random() * themes.length)]}`;
}

function getEndDate(timeframe: BracketTimeframe): string {
  const now = new Date();
  switch (timeframe) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function generateInitialMatches(size: BracketSize) {
  if (size === 3) {
    return [
      { roundNumber: 1, matchNumber: 1, completed: false },
      { roundNumber: 1, matchNumber: 2, completed: false },
      { roundNumber: 1, matchNumber: 3, completed: false }
    ];
  }
  
  if (size === 6) {
    return [
      { roundNumber: 1, matchNumber: 1, completed: false },
      { roundNumber: 1, matchNumber: 2, completed: false },
      { roundNumber: 1, matchNumber: 3, completed: false },
      { roundNumber: 2, matchNumber: 1, completed: false }
    ];
  }
  
  if (size === 9) {
    return [
      { roundNumber: 1, matchNumber: 1, completed: false },
      { roundNumber: 1, matchNumber: 2, completed: false },
      { roundNumber: 1, matchNumber: 3, completed: false },
      { roundNumber: 1, matchNumber: 4, completed: false },
      { roundNumber: 2, matchNumber: 1, completed: false },
      { roundNumber: 2, matchNumber: 2, completed: false },
      { roundNumber: 3, matchNumber: 1, completed: false }
    ];
  }
  
  return [];
}

function getRandomPrice(min: number, max: number): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(2));
}

function getRandomMarketCap(): "large" | "mid" | "small" {
  const options: ["large", "mid", "small"] = ["large", "mid", "small"];
  return options[Math.floor(Math.random() * options.length)];
}

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
    V: "Visa Inc.",
    JPM: "JPMorgan Chase & Co.",
    JNJ: "Johnson & Johnson",
    UNH: "UnitedHealth Group Inc.",
    PG: "Procter & Gamble Co.",
    MA: "Mastercard Inc.",
    HD: "Home Depot Inc.",
    BAC: "Bank of America Corp.",
    XOM: "Exxon Mobil Corporation",
    AVGO: "Broadcom Inc.",
    PFE: "Pfizer Inc.",
    CSCO: "Cisco Systems Inc."
  };
  
  return stockNames[symbol] || `${symbol} Inc.`;
}

function getStockSector(symbol: string): string {
  const stockSectors: Record<string, string> = {
    AAPL: "Technology",
    MSFT: "Technology",
    AMZN: "Consumer Cyclical",
    GOOGL: "Technology",
    GOOG: "Technology",
    META: "Technology",
    TSLA: "Automotive",
    NVDA: "Technology",
    V: "Financial Services",
    JPM: "Financial Services",
    JNJ: "Healthcare",
    UNH: "Healthcare",
    PG: "Consumer Defensive",
    MA: "Financial Services",
    HD: "Consumer Cyclical",
    BAC: "Financial Services",
    XOM: "Energy",
    AVGO: "Technology",
    PFE: "Healthcare",
    CSCO: "Technology"
  };
  
  return stockSectors[symbol] || "Technology";
}
