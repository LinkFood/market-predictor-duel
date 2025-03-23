
/**
 * Bracket Service
 * Handles creation and management of bracket tournaments
 */
import { supabase } from "@/integrations/supabase/client";
import { createMockBracket, mockBrackets } from "@/data/mockData";
import { BracketSize, BracketTimeframe, Direction, AIPersonality, Bracket } from "./types";
import { FEATURES } from "@/lib/config";

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
export async function updateBracketStatus(bracketId: string, status: 'pending' | 'active' | 'completed'): Promise<boolean> {
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
