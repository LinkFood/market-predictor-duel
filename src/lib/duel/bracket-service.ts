
/**
 * Bracket Service
 * Functions for managing stock bracket tournaments
 */
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/auth-context';
import { Bracket, BracketTimeframe, BracketSize, Direction, AIPersonality, BracketEntry, BracketStatus, BracketMatch } from './types';
import { createMockBracket } from '@/data/mockData';
import { generateAIStockPicks } from './ai-stock-picker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logError } from '../error-handling';
import { dbBracketToModel, modelBracketToDb } from './bracket-adapter';

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
    
    // Attempt to get current user from Supabase
    let userId = "user-123"; // Default user ID for mock mode
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userError && userData.user) {
        userId = userData.user.id;
      } else {
        console.warn("Using mock user authentication");
      }
    } catch (e) {
      console.warn("Using mock user authentication, Supabase error:", e);
    }
    
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
    
    // Calculate dates based on timeframe
    const startDate = new Date();
    const endDate = calculateEndDate(timeframe);
    
    // Create the bracket object
    const bracket: Bracket = {
      id: bracketId,
      userId: userId, // In a real app, get from auth context
      name: generateBracketName(timeframe, aiPersonality),
      timeframe,
      size,
      status: 'pending' as BracketStatus,
      aiPersonality,
      userEntries: formattedUserEntries,
      aiEntries,
      matches,
      startDate: startDate.toISOString(),
      endDate: getEndDate(timeframe),
      createdAt: new Date().toISOString(),
      userPoints: 0,
      aiPoints: 0
    };
    
    try {
      // Try to insert into Supabase - convert to DB format first
      const dbBracket = modelBracketToDb(bracket);
      
      // Fixed: Create a flat object instead of using Record<string, any>
      const { data: bracketResult, error: bracketError } = await supabase
        .from('brackets')
        .insert({
          user_id: dbBracket.user_id,
          name: dbBracket.name,
          timeframe: dbBracket.timeframe,
          size: dbBracket.size,
          status: dbBracket.status,
          ai_personality: dbBracket.ai_personality,
          user_entries: dbBracket.user_entries,
          ai_entries: dbBracket.ai_entries,
          matches: dbBracket.matches,
          winner_id: dbBracket.winner_id,
          start_date: dbBracket.start_date,
          end_date: dbBracket.end_date,
          created_at: dbBracket.created_at,
          user_points: dbBracket.user_points,
          ai_points: dbBracket.ai_points
        })
        .select('*')
        .single();
      
      if (bracketError) {
        throw bracketError;
      }
      
      // Convert database record to application model
      return dbBracketToModel(bracketResult);
    } catch (dbError) {
      console.warn("Using mock bracket storage due to Supabase error:", dbError);
      
      // Store in localStorage for persistence between page refreshes
      try {
        const existingBrackets = JSON.parse(localStorage.getItem('mockBrackets') || '[]');
        existingBrackets.push(bracket);
        localStorage.setItem('mockBrackets', JSON.stringify(existingBrackets));
      } catch (localStorageError) {
        console.error("Error storing mock bracket in localStorage:", localStorageError);
      }
      
      // In a real implementation, save to database
      console.log('Created bracket:', bracket);
      
      return bracket;
    }
  } catch (error) {
    console.error('Error creating bracket:', error);
    throw new Error('Failed to create bracket');
  }
}

// Get all brackets for the current user
export async function getUserBrackets(): Promise<Bracket[]> {
  try {
    // Attempt to get current user from Supabase
    let userId = "user-123"; // Default user ID for mock mode
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userError && userData.user) {
        userId = userData.user.id;
      } else {
        console.warn("Using mock user authentication");
      }
    } catch (e) {
      console.warn("Using mock user authentication, Supabase error:", e);
    }
    
    try {
      // Try to get brackets from Supabase
      const { data: bracketsData, error: bracketsError } = await supabase
        .from('brackets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (bracketsError) {
        throw bracketsError;
      }
      
      // Convert database records to application models
      const brackets: Bracket[] = bracketsData.map(dbBracketToModel);
      
      return brackets;
    } catch (dbError) {
      console.warn("Using mock bracket storage due to Supabase error:", dbError);
      
      // Use localStorage for mock brackets
      try {
        const mockBrackets = JSON.parse(localStorage.getItem('mockBrackets') || '[]');
        return mockBrackets.filter((bracket: Bracket) => bracket.userId === userId);
      } catch (e) {
        console.error("Error reading mock brackets from localStorage:", e);
        
        // Return demo brackets if localStorage fails
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.dev')) {
          return generateDemoBrackets(userId);
        }
        
        return [];
      }
    }
    
  } catch (error) {
    logError(error, "getUserBrackets");
    console.error("Error getting user brackets:", error);
    
    // Return demo brackets in development environments
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.dev')) {
      return generateDemoBrackets("user-123");
    }
    
    throw error;
  }
}

// Get a single bracket by ID
export async function getBracketById(bracketId: string): Promise<Bracket> {
  try {
    try {
      // Try to get bracket from Supabase
      const { data: bracket, error } = await supabase
        .from('brackets')
        .select('*')
        .eq('id', bracketId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!bracket) {
        throw new Error(`Bracket with ID ${bracketId} not found`);
      }
      
      // Convert database record to application model
      return dbBracketToModel(bracket);
    } catch (dbError) {
      console.warn("Using mock bracket storage due to Supabase error:", dbError);
      
      // Check localStorage for mock brackets
      try {
        const mockBrackets = JSON.parse(localStorage.getItem('mockBrackets') || '[]');
        const bracket = mockBrackets.find((b: Bracket) => b.id === bracketId);
        
        if (bracket) {
          return bracket;
        }
      } catch (e) {
        console.error("Error reading mock brackets from localStorage:", e);
      }
      
      // For demo/development, check if this is a demo bracket ID
      if (bracketId === 'bracket-demo1' || bracketId === 'bracket-demo2') {
        const demoUserId = "user-123";
        const demoBrackets = generateDemoBrackets(demoUserId);
        const demoBracket = demoBrackets.find(b => b.id === bracketId);
        
        if (demoBracket) {
          return demoBracket;
        }
      }
      
      // Fallback to mock bracket for development
      return createMockBracket(bracketId);
    }
  } catch (error) {
    console.error(`Error getting bracket ${bracketId}:`, error);
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
      status: 'completed' as BracketStatus,
      matches: updatedMatches,
      userPoints,
      aiPoints,
      winnerId
    };
    
    try {
      // Try to update in Supabase
      const dbBracket = modelBracketToDb(updatedBracket);
      
      const { error } = await supabase
        .from('brackets')
        .update({
          status: dbBracket.status,
          winner_id: dbBracket.winner_id,
          user_points: dbBracket.user_points,
          ai_points: dbBracket.ai_points,
          matches: dbBracket.matches,
          user_entries: dbBracket.user_entries,
          ai_entries: dbBracket.ai_entries
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    } catch (dbError) {
      console.warn("Using mock bracket storage due to Supabase error:", dbError);
      
      // Update in localStorage if using mock storage
      try {
        const mockBrackets = JSON.parse(localStorage.getItem('mockBrackets') || '[]');
        const updatedMockBrackets = mockBrackets.map((b: Bracket) => 
          b.id === id ? updatedBracket : b
        );
        localStorage.setItem('mockBrackets', JSON.stringify(updatedMockBrackets));
      } catch (localStorageError) {
        console.error("Error updating mock bracket in localStorage:", localStorageError);
      }
    }
    
    // In a real implementation, save to database
    console.log('Completed bracket:', updatedBracket);
    
    return updatedBracket;
  } catch (error) {
    console.error(`Error completing bracket ${id}:`, error);
    throw new Error('Failed to complete bracket');
  }
}

// Update bracket with new market data
export async function updateBracketPrices(bracketId: string): Promise<Bracket> {
  try {
    // Get the bracket
    const bracket = await getBracketById(bracketId);
    
    // Skip if bracket is already completed
    if (bracket.status === 'completed') {
      return bracket;
    }
    
    // Update user entries with current prices
    for (const entry of bracket.userEntries) {
      // In a real implementation, we would fetch the latest stock prices
      // but for now, simulate by generating random prices
      entry.endPrice = getRandomPrice(entry.startPrice * 0.9, entry.startPrice * 1.1);
      entry.percentChange = calculatePercentChange(entry.startPrice, entry.endPrice);
    }
    
    // Update AI entries with current prices
    for (const entry of bracket.aiEntries) {
      // In a real implementation, we would fetch the latest stock prices
      // but for now, simulate by generating random prices
      entry.endPrice = getRandomPrice(entry.startPrice * 0.9, entry.startPrice * 1.1);
      entry.percentChange = calculatePercentChange(entry.startPrice, entry.endPrice);
    }
    
    // Check if the bracket should be completed
    const now = new Date();
    const endDate = new Date(bracket.endDate);
    
    if (now >= endDate) {
      bracket.status = 'completed';
      
      // Calculate results and determine winner
      const userPoints = calculateTotalPoints(bracket.userEntries);
      const aiPoints = calculateTotalPoints(bracket.aiEntries);
      
      bracket.userPoints = userPoints;
      bracket.aiPoints = aiPoints;
      bracket.winnerId = userPoints > aiPoints ? 'user' : 'ai';
    } else if (bracket.status === 'pending') {
      // Activate the bracket if it's past the start date
      const startDate = new Date(bracket.startDate);
      if (now >= startDate) {
        bracket.status = 'active';
      }
    }
    
    try {
      // Try to update in Supabase - convert to DB format first
      const dbBracket = modelBracketToDb(bracket);
      
      const { error } = await supabase
        .from('brackets')
        .update({
          status: dbBracket.status,
          winner_id: dbBracket.winner_id,
          user_points: dbBracket.user_points,
          ai_points: dbBracket.ai_points,
          matches: dbBracket.matches,
          user_entries: dbBracket.user_entries,
          ai_entries: dbBracket.ai_entries
        })
        .eq('id', bracketId);
      
      if (error) {
        throw error;
      }
    } catch (dbError) {
      console.warn("Using mock bracket storage due to Supabase error:", dbError);
      
      // Update in localStorage if using mock storage
      try {
        const mockBrackets = JSON.parse(localStorage.getItem('mockBrackets') || '[]');
        const updatedMockBrackets = mockBrackets.map((b: Bracket) => 
          b.id === bracketId ? bracket : b
        );
        localStorage.setItem('mockBrackets', JSON.stringify(updatedMockBrackets));
      } catch (localStorageError) {
        console.error("Error updating mock bracket in localStorage:", localStorageError);
      }
    }
    
    return bracket;
  } catch (error) {
    console.error(`Error updating bracket ${bracketId}:`, error);
    throw error;
  }
}

// Delete a bracket by ID
export async function deleteBracket(bracketId: string): Promise<boolean> {
  try {
    // Attempt to get current user from Supabase
    let userId = "user-123"; // Default user ID for mock mode
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userError && userData.user) {
        userId = userData.user.id;
      } else {
        console.warn("Using mock user authentication");
      }
    } catch (e) {
      console.warn("Using mock user authentication, Supabase error:", e);
    }
    
    try {
      // Try to delete from Supabase
      const { error } = await supabase
        .from('brackets')
        .delete()
        .eq('id', bracketId)
        .eq('user_id', userId); // Ensure the bracket belongs to the user
      
      if (error) {
        throw error;
      }
    } catch (dbError) {
      console.warn("Using mock bracket storage due to Supabase error:", dbError);
      
      // Delete from localStorage if using mock storage
      try {
        const mockBrackets = JSON.parse(localStorage.getItem('mockBrackets') || '[]');
        const filteredBrackets = mockBrackets.filter((b: Bracket) => 
          !(b.id === bracketId && b.userId === userId)
        );
        localStorage.setItem('mockBrackets', JSON.stringify(filteredBrackets));
      } catch (localStorageError) {
        console.error("Error deleting mock bracket from localStorage:", localStorageError);
        throw localStorageError;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting bracket ${bracketId}:`, error);
    throw error;
  }
}

/**
 * Determine market cap category
 */
function determineMarketCap(marketCap: number): "large" | "mid" | "small" {
  if (marketCap >= 10000000000) { // $10B+
    return "large";
  } else if (marketCap >= 2000000000) { // $2B+
    return "mid";
  } else {
    return "small";
  }
}

/**
 * Helper functions
 */
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

function calculateEndDate(timeframe: BracketTimeframe): Date {
  const now = new Date();
  switch (timeframe) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
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

/**
 * Calculate percent change between two prices
 */
function calculatePercentChange(startPrice: number, endPrice: number): number {
  return ((endPrice - startPrice) / startPrice) * 100;
}

/**
 * Calculate total points for a set of entries
 */
function calculateTotalPoints(entries: BracketEntry[]): number {
  return entries.reduce((total, entry) => {
    if (entry.percentChange === undefined) return total;
    
    // For bearish predictions, invert the percent change
    const adjustedChange = entry.direction === 'bearish' 
      ? -entry.percentChange 
      : entry.percentChange;
    
    return total + adjustedChange;
  }, 0);
}

/**
 * Generate demo brackets for development testing
 */
function generateDemoBrackets(userId: string): Bracket[] {
  const now = new Date();
  
  const demoUserEntries: BracketEntry[] = [
    {
      id: "user-1",
      symbol: "AAPL",
      name: "Apple Inc.",
      entryType: "stock",
      direction: "bullish",
      startPrice: 182.56,
      endPrice: 189.75,
      percentChange: 3.94,
      marketCap: "large",
      sector: "Technology",
      order: 1
    },
    {
      id: "user-2",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      entryType: "stock",
      direction: "bullish",
      startPrice: 334.78,
      endPrice: 344.32,
      percentChange: 2.85,
      marketCap: "large",
      sector: "Technology",
      order: 2
    },
    {
      id: "user-3",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      entryType: "stock",
      direction: "bearish",
      startPrice: 138.92,
      endPrice: 135.60,
      percentChange: -2.39,
      marketCap: "large",
      sector: "Technology",
      order: 3
    }
  ];
  
  const demoAIEntries: BracketEntry[] = [
    {
      id: "ai-1",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      entryType: "stock",
      direction: "bullish",
      startPrice: 145.24,
      endPrice: 152.10,
      percentChange: 4.72,
      marketCap: "large",
      sector: "Consumer Discretionary",
      order: 1
    },
    {
      id: "ai-2",
      symbol: "META",
      name: "Meta Platforms Inc.",
      entryType: "stock",
      direction: "bullish",
      startPrice: 318.45,
      endPrice: 330.12,
      percentChange: 3.66,
      marketCap: "large",
      sector: "Communication Services",
      order: 2
    },
    {
      id: "ai-3",
      symbol: "TSLA",
      name: "Tesla Inc.",
      entryType: "stock",
      direction: "bearish",
      startPrice: 246.83,
      endPrice: 220.45,
      percentChange: -10.69,
      marketCap: "large",
      sector: "Consumer Discretionary",
      order: 3
    }
  ];
  
  const demoMatches: BracketMatch[] = [
    {
      id: "match-1",
      roundNumber: 1,
      matchNumber: 1,
      entry1Id: "user-1",
      entry2Id: "ai-1",
      entry1PercentChange: 3.94,
      entry2PercentChange: 4.72,
      winnerId: "ai-1",
      completed: true
    },
    {
      id: "match-2",
      roundNumber: 1,
      matchNumber: 2,
      entry1Id: "user-2",
      entry2Id: "ai-2",
      entry1PercentChange: 2.85,
      entry2PercentChange: 3.66,
      winnerId: "ai-2",
      completed: true
    },
    {
      id: "match-3",
      roundNumber: 1,
      matchNumber: 3,
      entry1Id: "user-3",
      entry2Id: "ai-3",
      entry1PercentChange: 2.39,
      entry2PercentChange: 10.69,
      winnerId: "ai-3",
      completed: true
    }
  ];
  
  // Create demo brackets
  return [
    {
      id: "bracket-demo1",
      userId,
      name: "Weekly 3-Stock Bracket",
      timeframe: "weekly",
      size: 3,
      status: "completed",
      aiPersonality: "ValueHunter",
      userEntries: demoUserEntries,
      aiEntries: demoAIEntries,
      matches: demoMatches,
      winnerId: "ai",
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: now.toISOString(),
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      userPoints: 4.40,
      aiPoints: 19.07
    },
    {
      id: "bracket-demo2",
      userId,
      name: "Daily 3-Stock Bracket",
      timeframe: "daily",
      size: 3,
      status: "active",
      aiPersonality: "MomentumTrader",
      userEntries: [
        {
          id: "user-4",
          symbol: "NVDA",
          name: "NVIDIA Corporation",
          entryType: "stock",
          direction: "bullish",
          startPrice: 437.53,
          endPrice: 442.80,
          percentChange: 1.20,
          marketCap: "large",
          sector: "Technology",
          order: 1
        },
        {
          id: "user-5",
          symbol: "JPM",
          name: "JPMorgan Chase & Co.",
          entryType: "stock",
          direction: "bullish",
          startPrice: 179.96,
          endPrice: 181.25,
          percentChange: 0.72,
          marketCap: "large",
          sector: "Financial",
          order: 2
        },
        {
          id: "user-6",
          symbol: "JNJ",
          name: "Johnson & Johnson",
          entryType: "stock",
          direction: "bearish",
          startPrice: 156.32,
          endPrice: 154.75,
          percentChange: -1.00,
          marketCap: "large",
          sector: "Healthcare",
          order: 3
        }
      ],
      aiEntries: [
        {
          id: "ai-4",
          symbol: "V",
          name: "Visa Inc.",
          entryType: "stock",
          direction: "bullish",
          startPrice: 270.37,
          endPrice: 273.15,
          percentChange: 1.03,
          marketCap: "large",
          sector: "Financial",
          order: 1
        },
        {
          id: "ai-5",
          symbol: "XOM",
          name: "Exxon Mobil Corporation",
          entryType: "stock",
          direction: "bullish",
          startPrice: 112.46,
          endPrice: 113.28,
          percentChange: 0.73,
          marketCap: "large",
          sector: "Energy",
          order: 2
        },
        {
          id: "ai-6",
          symbol: "PG",
          name: "Procter & Gamble Co.",
          entryType: "stock",
          direction: "bearish",
          startPrice: 160.34,
          endPrice: 159.73,
          percentChange: -0.38,
          marketCap: "large",
          sector: "Consumer Staples",
          order: 3
        }
      ],
      matches: [
        {
          id: "match-4",
          roundNumber: 1,
          matchNumber: 1,
          entry1Id: "user-4",
          entry2Id: "ai-4",
          entry1PercentChange: 1.20,
          entry2PercentChange: 1.03,
          completed: false
        },
        {
          id: "match-5",
          roundNumber: 1,
          matchNumber: 2,
          entry1Id: "user-5",
          entry2Id: "ai-5",
          entry1PercentChange: 0.72,
          entry2PercentChange: 0.73,
          completed: false
        },
        {
          id: "match-6",
          roundNumber: 1,
          matchNumber: 3,
          entry1Id: "user-6",
          entry2Id: "ai-6",
          entry1PercentChange: 1.00,
          entry2PercentChange: 0.38,
          completed: false
        }
      ],
      startDate: now.toISOString(),
      endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now.toISOString(),
      userPoints: 2.92,
      aiPoints: 2.14
    }
  ];
}
