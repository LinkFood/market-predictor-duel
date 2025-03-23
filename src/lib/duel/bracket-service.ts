
/**
 * Bracket Service
 * Handles creation and management of bracket tournaments
 */
import { supabase } from "@/integrations/supabase/client";
import { createMockBracket } from "@/data/mockData";
import { BracketSize, BracketTimeframe, Direction, AIPersonality, Bracket, BracketStatus } from "./types";
import { FEATURES } from "@/lib/config";

// Mock brackets for testing
const mockBrackets: Bracket[] = [
  {
    id: "bracket-001",
    userId: "user-123",
    name: "Tech Giants Battle",
    timeframe: "weekly",
    size: 3,
    status: "completed" as BracketStatus,
    aiPersonality: "MomentumTrader",
    userEntries: [
      {
        id: "entry-1",
        symbol: "AAPL",
        name: "Apple Inc.",
        entryType: "stock",
        direction: "bullish",
        startPrice: 185.92,
        marketCap: "large",
        sector: "Technology",
        order: 1
      },
      {
        id: "entry-2",
        symbol: "MSFT",
        name: "Microsoft Corp",
        entryType: "stock",
        direction: "bullish",
        startPrice: 338.11,
        marketCap: "large",
        sector: "Technology",
        order: 2
      },
      {
        id: "entry-3",
        symbol: "AMZN",
        name: "Amazon.com",
        entryType: "stock",
        direction: "bearish",
        startPrice: 131.94,
        marketCap: "large",
        sector: "Consumer Cyclical",
        order: 3
      }
    ],
    aiEntries: [
      {
        id: "ai-entry-1",
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        entryType: "stock",
        direction: "bullish",
        startPrice: 131.86,
        marketCap: "large",
        sector: "Technology",
        order: 1
      },
      {
        id: "ai-entry-2",
        symbol: "META",
        name: "Meta Platforms",
        entryType: "stock",
        direction: "bullish",
        startPrice: 325.11,
        marketCap: "large",
        sector: "Technology",
        order: 2
      },
      {
        id: "ai-entry-3",
        symbol: "NFLX",
        name: "Netflix Inc.",
        entryType: "stock",
        direction: "bullish",
        startPrice: 484.21,
        marketCap: "large",
        sector: "Technology",
        order: 3
      }
    ],
    matches: [
      {
        id: "match-1",
        roundNumber: 1,
        matchNumber: 1,
        entry1Id: "entry-1",
        entry2Id: "ai-entry-1",
        entry1PercentChange: 2.54,
        entry2PercentChange: 1.89,
        winnerId: "entry-1",
        completed: true
      },
      {
        id: "match-2",
        roundNumber: 1,
        matchNumber: 2,
        entry1Id: "entry-2",
        entry2Id: "ai-entry-2",
        entry1PercentChange: 1.12,
        entry2PercentChange: 3.45,
        winnerId: "ai-entry-2",
        completed: true
      },
      {
        id: "match-3",
        roundNumber: 1,
        matchNumber: 3,
        entry1Id: "entry-3",
        entry2Id: "ai-entry-3",
        entry1PercentChange: -1.25,
        entry2PercentChange: 0.87,
        winnerId: "ai-entry-3",
        completed: true
      }
    ],
    winnerId: "ai",
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    userPoints: 2.54,
    aiPoints: 5.21
  }
];

/**
 * Get all brackets for the current user
 */
export async function getUserBrackets(): Promise<Bracket[]> {
  try {
    if (FEATURES.enableMockData) {
      // Return mock brackets when real data is not available
      console.log('Using mock data for brackets');
      return mockBrackets;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Real implementation would fetch from Supabase
    // For now, return mock data
    return mockBrackets;
  } catch (error) {
    console.error("Error fetching user brackets:", error);
    return [];
  }
}

/**
 * Get a bracket by ID
 */
export async function getBracketById(bracketId: string): Promise<Bracket | null> {
  try {
    if (FEATURES.enableMockData) {
      const bracket = mockBrackets.find(b => b.id === bracketId);
      return bracket || null;
    }

    // Real implementation would fetch from Supabase
    // For now, return mock data
    return mockBrackets.find(b => b.id === bracketId) || null;
  } catch (error) {
    console.error("Error fetching bracket:", error);
    return null;
  }
}

/**
 * Create a new bracket competition
 */
export async function createBracket(
  timeframe: BracketTimeframe,
  size: BracketSize,
  entries: { symbol: string; direction: Direction }[],
  aiPersonality?: AIPersonality
): Promise<Bracket> {
  try {
    if (FEATURES.enableMockData) {
      // Create and return a mock bracket
      console.log('Creating mock bracket');
      return createMockBracket(timeframe, size, entries, aiPersonality);
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Real implementation would create a bracket in Supabase
    // For now, return mock data
    return createMockBracket(timeframe, size, entries, aiPersonality);
  } catch (error) {
    console.error("Error creating bracket:", error);
    throw new Error("Failed to create bracket: " + (error as Error).message);
  }
}

/**
 * Delete a bracket
 */
export async function deleteBracket(bracketId: string): Promise<boolean> {
  try {
    if (FEATURES.enableMockData) {
      console.log('Deleting mock bracket:', bracketId);
      return true;
    }

    // Real implementation would delete from Supabase
    // For now, return success
    return true;
  } catch (error) {
    console.error("Error deleting bracket:", error);
    return false;
  }
}

/**
 * Update bracket status
 */
export async function updateBracketStatus(bracketId: string, status: BracketStatus): Promise<boolean> {
  try {
    if (FEATURES.enableMockData) {
      console.log('Updating mock bracket status:', bracketId, status);
      return true;
    }

    // Real implementation would update in Supabase
    // For now, return success
    return true;
  } catch (error) {
    console.error("Error updating bracket status:", error);
    return false;
  }
}

/**
 * Update bracket prices 
 */
export async function updateBracketPrices(bracketId: string): Promise<boolean> {
  try {
    console.log('Updating mock bracket prices:', bracketId);
    return true;
  } catch (error) {
    console.error("Error updating bracket prices:", error);
    return false;
  }
}

/**
 * Reset bracket
 */
export async function resetBracket(bracketId: string): Promise<boolean> {
  try {
    console.log('Resetting mock bracket:', bracketId);
    return true;
  } catch (error) {
    console.error("Error resetting bracket:", error);
    return false;
  }
}
