/**
 * Bracket Service
 * Handles the creation, retrieval, and management of bracket tournaments
 */

import { supabase } from '@/integrations/supabase/client';
import { getStockData } from '../market';
import { logError } from '../error-handling';
import { AIPersonality, Bracket, BracketEntry, BracketMatch, BracketSize, BracketTimeframe, Direction } from './types';
import { getAIPersonality, getSuitableOpponent } from './ai-personalities';
import { getAiStockPicks } from './ai-stock-picker';

/**
 * Create a new bracket tournament
 */
export async function createBracket(
  timeframe: BracketTimeframe,
  size: BracketSize, 
  userEntries: { symbol: string, direction: Direction }[],
  aiPersonality?: AIPersonality
): Promise<Bracket> {
  try {
    console.log('Creating bracket with size:', size, 'timeframe:', timeframe);
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Validate the number of user entries matches the bracket size
    if (userEntries.length !== size) {
      throw new Error(`Expected ${size} entries but received ${userEntries.length}`);
    }
    
    // Determine the AI personality to use
    const personality = aiPersonality || getSuitableOpponent().id;
    
    // Calculate dates based on timeframe
    const startDate = new Date();
    const endDate = calculateEndDate(timeframe);
    
    // Process user entries to get full details
    const processedUserEntries: BracketEntry[] = await Promise.all(
      userEntries.map(async (entry, index) => {
        const { data: stockData } = await getStockData(entry.symbol);
        
        return {
          symbol: entry.symbol,
          name: stockData.name,
          entryType: "stock", // Assuming stock for now, can be enhanced to detect ETFs
          direction: entry.direction,
          startPrice: stockData.price,
          marketCap: determineMarketCap(stockData.marketCap || 0),
          sector: stockData.sector || "Unknown",
          order: index + 1
        };
      })
    );
    
    // Get AI entries based on the personality and user entries
    const aiEntries = await getAiStockPicks({
      personality,
      size,
      userEntries: processedUserEntries,
      timeframe
    });
    
    // Generate the initial bracket matches
    const matches = generateInitialMatches(size);
    
    // Create the bracket record in database
    const bracketData = {
      user_id: userData.user.id,
      name: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} ${size}-Stock Bracket`,
      timeframe,
      size,
      status: "pending",
      ai_personality: personality,
      user_entries: processedUserEntries,
      ai_entries: aiEntries,
      matches,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      created_at: new Date().toISOString(),
      user_points: 0,
      ai_points: 0
    };
    
    // Insert bracket into database
    const { data: bracketResult, error: bracketError } = await supabase
      .from('brackets')
      .insert(bracketData)
      .select('*')
      .single();
    
    if (bracketError) {
      console.error('Error creating bracket:', bracketError);
      throw new Error(`Failed to create bracket: ${bracketError.message}`);
    }
    
    // Convert database record to application model
    const bracket: Bracket = {
      id: bracketResult.id,
      userId: bracketResult.user_id,
      name: bracketResult.name,
      timeframe: bracketResult.timeframe,
      size: bracketResult.size,
      status: bracketResult.status,
      aiPersonality: bracketResult.ai_personality,
      userEntries: bracketResult.user_entries,
      aiEntries: bracketResult.ai_entries,
      matches: bracketResult.matches,
      startDate: bracketResult.start_date,
      endDate: bracketResult.end_date,
      createdAt: bracketResult.created_at,
      userPoints: 0,
      aiPoints: 0
    };
    
    return bracket;
  } catch (error) {
    logError(error, "createBracket");
    console.error("Error creating bracket:", error);
    throw error;
  }
}

/**
 * Get all brackets for the current user
 */
export async function getUserBrackets(): Promise<Bracket[]> {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Get user brackets
    const { data: bracketsData, error: bracketsError } = await supabase
      .from('brackets')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
    
    if (bracketsError) {
      throw bracketsError;
    }
    
    // Convert database records to application models
    const brackets: Bracket[] = bracketsData.map(bracket => ({
      id: bracket.id,
      userId: bracket.user_id,
      name: bracket.name,
      timeframe: bracket.timeframe,
      size: bracket.size,
      status: bracket.status,
      aiPersonality: bracket.ai_personality,
      userEntries: bracket.user_entries,
      aiEntries: bracket.ai_entries,
      matches: bracket.matches,
      winnerId: bracket.winner_id,
      startDate: bracket.start_date,
      endDate: bracket.end_date,
      createdAt: bracket.created_at,
      userPoints: bracket.user_points || 0,
      aiPoints: bracket.ai_points || 0
    }));
    
    return brackets;
  } catch (error) {
    logError(error, "getUserBrackets");
    console.error("Error getting user brackets:", error);
    throw error;
  }
}

/**
 * Get a single bracket by ID
 */
export async function getBracketById(bracketId: string): Promise<Bracket> {
  try {
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
    return {
      id: bracket.id,
      userId: bracket.user_id,
      name: bracket.name,
      timeframe: bracket.timeframe,
      size: bracket.size,
      status: bracket.status,
      aiPersonality: bracket.ai_personality,
      userEntries: bracket.user_entries,
      aiEntries: bracket.ai_entries,
      matches: bracket.matches,
      winnerId: bracket.winner_id,
      startDate: bracket.start_date,
      endDate: bracket.end_date,
      createdAt: bracket.created_at,
      userPoints: bracket.user_points || 0,
      aiPoints: bracket.ai_points || 0
    };
  } catch (error) {
    logError(error, "getBracketById");
    console.error(`Error getting bracket ${bracketId}:`, error);
    throw error;
  }
}

/**
 * Generate the initial matches for a bracket
 */
function generateInitialMatches(size: BracketSize): BracketMatch[] {
  const matches: BracketMatch[] = [];
  
  // For size 3, there's only one round with direct comparisons
  if (size === 3) {
    for (let i = 0; i < 3; i++) {
      matches.push({
        roundNumber: 1,
        matchNumber: i + 1,
        completed: false
      });
    }
    return matches;
  }
  
  // For size 6 and 9, we have multiple rounds
  if (size === 6) {
    // Round 1: 3 matches
    for (let i = 0; i < 3; i++) {
      matches.push({
        roundNumber: 1,
        matchNumber: i + 1,
        completed: false
      });
    }
    
    // Round 2: Final round with 1 winner from each match
    matches.push({
      roundNumber: 2,
      matchNumber: 1,
      completed: false
    });
  }
  
  if (size === 9) {
    // Round 1: 4 matches (8 entries compete, 1 gets a bye)
    for (let i = 0; i < 4; i++) {
      matches.push({
        roundNumber: 1,
        matchNumber: i + 1,
        completed: false
      });
    }
    
    // Round 2: 2 matches (4 winners + the bye entry)
    for (let i = 0; i < 2; i++) {
      matches.push({
        roundNumber: 2,
        matchNumber: i + 1,
        completed: false
      });
    }
    
    // Round 3: Final round
    matches.push({
      roundNumber: 3,
      matchNumber: 1,
      completed: false
    });
  }
  
  return matches;
}

/**
 * Calculate the end date based on the timeframe
 */
function calculateEndDate(timeframe: BracketTimeframe): Date {
  const endDate = new Date();
  
  switch(timeframe) {
    case 'daily':
      endDate.setDate(endDate.getDate() + 1);
      break;
    case 'weekly':
      endDate.setDate(endDate.getDate() + 7);
      break;
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
  }
  
  return endDate;
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
 * Update bracket with new market data
 */
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
      const { data: stockData } = await getStockData(entry.symbol);
      entry.endPrice = stockData.price;
      entry.percentChange = calculatePercentChange(entry.startPrice, entry.endPrice);
    }
    
    // Update AI entries with current prices
    for (const entry of bracket.aiEntries) {
      const { data: stockData } = await getStockData(entry.symbol);
      entry.endPrice = stockData.price;
      entry.percentChange = calculatePercentChange(entry.startPrice, entry.endPrice);
    }
    
    // Check if the bracket should be completed
    const now = new Date();
    const endDate = new Date(bracket.endDate);
    
    if (now >= endDate) {
      // Update all matches with current data before completing
      await updateBracketMatches(bracket);
      
      bracket.status = 'completed';
      
      // Calculate results and determine winner
      const userPoints = calculateTotalPoints(bracket.userEntries);
      const aiPoints = calculateTotalPoints(bracket.aiEntries);
      
      bracket.userPoints = userPoints;
      bracket.aiPoints = aiPoints;
      bracket.winnerId = userPoints > aiPoints ? 'user' : 'ai';
    } else if (bracket.status === 'pending') {
      // Activate the bracket if manually activated or it's past the start date
      const shouldActivate = now >= new Date(bracket.startDate);
      
      // Allow manual activation at any time
      bracket.status = 'active';
      
      // Initialize matches with user and AI entries
      await initializeBracketMatches(bracket);
      
      // Set current start date if manually activating early
      if (!shouldActivate) {
        bracket.startDate = now.toISOString();
      }
      
      // Initialize points
      bracket.userPoints = 0;
      bracket.aiPoints = 0;
    } else if (bracket.status === 'active') {
      // Just update the current statistics
      bracket.userPoints = calculateTotalPoints(bracket.userEntries);
      bracket.aiPoints = calculateTotalPoints(bracket.aiEntries);
      
      // Update ongoing matches
      await updateBracketMatches(bracket);
    }
    
    // Update the database
    const { error } = await supabase
      .from('brackets')
      .update({
        user_entries: bracket.userEntries,
        ai_entries: bracket.aiEntries,
        status: bracket.status,
        winner_id: bracket.winnerId,
        user_points: bracket.userPoints,
        ai_points: bracket.aiPoints,
        matches: bracket.matches
      })
      .eq('id', bracketId);
    
    if (error) {
      throw error;
    }
    
    return bracket;
  } catch (error) {
    logError(error, "updateBracketPrices");
    console.error(`Error updating bracket ${bracketId}:`, error);
    throw error;
  }
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
 * Initialize bracket matches with user and AI entries
 */
async function initializeBracketMatches(bracket: Bracket): Promise<void> {
  try {
    // Different initialization based on bracket size
    if (bracket.size === 3) {
      // For size 3, direct head-to-head matches
      for (let i = 0; i < 3; i++) {
        const userEntry = bracket.userEntries[i];
        const aiEntry = bracket.aiEntries[i];
        
        // Update the match with these entries
        if (bracket.matches[i]) {
          bracket.matches[i].entry1Id = userEntry.id || `user-${i}`;
          bracket.matches[i].entry2Id = aiEntry.id || `ai-${i}`;
          
          // Add IDs to entries if they don't have them
          if (!userEntry.id) userEntry.id = `user-${i}`;
          if (!aiEntry.id) aiEntry.id = `ai-${i}`;
        }
      }
    } else if (bracket.size === 6) {
      // First round: 3 matches
      for (let i = 0; i < 3; i++) {
        const userEntry = bracket.userEntries[i];
        const aiEntry = bracket.aiEntries[i];
        
        // Update match with these entries
        if (bracket.matches[i]) {
          bracket.matches[i].entry1Id = userEntry.id || `user-${i}`;
          bracket.matches[i].entry2Id = aiEntry.id || `ai-${i}`;
          
          // Add IDs to entries if they don't have them
          if (!userEntry.id) userEntry.id = `user-${i}`;
          if (!aiEntry.id) aiEntry.id = `ai-${i}`;
        }
      }
      // Second round match is populated later when first round completes
    } else if (bracket.size === 9) {
      // First round: 4 matches (8 entries compete, 1 gets a bye)
      for (let i = 0; i < 4; i++) {
        const userEntry = bracket.userEntries[i];
        const aiEntry = bracket.aiEntries[i];
        
        // Update match with these entries
        if (bracket.matches[i]) {
          bracket.matches[i].entry1Id = userEntry.id || `user-${i}`;
          bracket.matches[i].entry2Id = aiEntry.id || `ai-${i}`;
          
          // Add IDs to entries if they don't have them
          if (!userEntry.id) userEntry.id = `user-${i}`;
          if (!aiEntry.id) aiEntry.id = `ai-${i}`;
        }
      }
      // Reserve the 9th entry as a bye to the second round
      // This will be handled in updateBracketMatches
    }
  } catch (error) {
    logError(error, "initializeBracketMatches");
    console.error("Error initializing bracket matches:", error);
    throw error;
  }
}

/**
 * Update bracket matches with latest price data and determine winners
 */
async function updateBracketMatches(bracket: Bracket): Promise<void> {
  try {
    // Process matches round by round
    const maxRound = Math.max(...bracket.matches.map(m => m.roundNumber));
    
    for (let round = 1; round <= maxRound; round++) {
      const roundMatches = bracket.matches.filter(m => m.roundNumber === round);
      
      // First, update all matches in the current round
      for (const match of roundMatches) {
        // Skip if match is already completed
        if (match.completed) continue;
        
        // Get the entries for this match
        const entry1 = findEntryById(bracket, match.entry1Id);
        const entry2 = findEntryById(bracket, match.entry2Id);
        
        // Skip if entries aren't available yet
        if (!entry1 || !entry2) continue;
        
        // Calculate adjusted performance for each entry
        const entry1Performance = calculateAdjustedPerformance(entry1);
        const entry2Performance = calculateAdjustedPerformance(entry2);
        
        // Update match with performance data
        match.entry1PercentChange = entry1Performance;
        match.entry2PercentChange = entry2Performance;
        
        // Check if this match can be completed
        const now = new Date();
        const endDate = new Date(bracket.endDate);
        
        if (now >= endDate) {
          // Determine winner
          if (entry1Performance > entry2Performance) {
            match.winnerId = entry1.id;
          } else if (entry2Performance > entry1Performance) {
            match.winnerId = entry2.id;
          } else {
            // If tie, slightly favor the user for better experience
            match.winnerId = entry1.id; // assuming entry1 is user's
          }
          
          match.completed = true;
          
          // If this isn't the final round, advance winner to next round
          if (round < maxRound) {
            advanceWinnerToNextRound(bracket, round, match);
          }
        }
      }
      
      // Check if we can move to the next round
      // Only proceed to updating next round if all matches in current round are completed
      const allMatchesCompleted = roundMatches.every(m => m.completed);
      if (!allMatchesCompleted) break;
    }
  } catch (error) {
    logError(error, "updateBracketMatches");
    console.error("Error updating bracket matches:", error);
    throw error;
  }
}

/**
 * Calculate adjusted performance for an entry based on direction
 */
function calculateAdjustedPerformance(entry: BracketEntry): number {
  if (entry.percentChange === undefined) return 0;
  
  // For bearish predictions, invert the percent change
  return entry.direction === 'bearish' 
    ? -entry.percentChange 
    : entry.percentChange;
}

/**
 * Find an entry by ID across both user and AI entries
 */
function findEntryById(bracket: Bracket, entryId?: string): BracketEntry | undefined {
  if (!entryId) return undefined;
  
  // Check in user entries
  const userEntry = bracket.userEntries.find(entry => entry.id === entryId);
  if (userEntry) return userEntry;
  
  // Check in AI entries
  const aiEntry = bracket.aiEntries.find(entry => entry.id === entryId);
  if (aiEntry) return aiEntry;
  
  return undefined;
}

/**
 * Advance a match winner to the next round
 */
function advanceWinnerToNextRound(bracket: Bracket, currentRound: number, match: BracketMatch): void {
  const nextRound = currentRound + 1;
  const matchIndex = match.matchNumber - 1;
  
  // Get matches in the next round
  const nextRoundMatches = bracket.matches.filter(m => m.roundNumber === nextRound);
  
  if (nextRoundMatches.length === 0) return; // No next round
  
  // For simple bracket sizes, we can use a straightforward approach
  if (bracket.size === 3) {
    // Size 3 only has one round, so no advancement
    return;
  } else if (bracket.size === 6) {
    // Size 6 has one finalist from each of the 3 first-round matches
    // For simplicity, assign them in order to the final
    const finalMatch = nextRoundMatches[0];
    
    if (matchIndex === 0) {
      finalMatch.entry1Id = match.winnerId;
    } else if (matchIndex === 1) {
      finalMatch.entry2Id = match.winnerId;
    } else if (matchIndex === 2) {
      // For the third winner, we need to decide whether to replace entry1 or entry2
      // Let's replace the one that's not set yet, or entry1 if both are set
      if (!finalMatch.entry1Id) {
        finalMatch.entry1Id = match.winnerId;
      } else {
        finalMatch.entry2Id = match.winnerId;
      }
    }
  } else if (bracket.size === 9) {
    // Size 9 is more complex with 4 first-round matches, 2 second-round matches, and 1 final
    if (currentRound === 1) {
      // First round to semi-finals
      const semifinalIndex = Math.floor(matchIndex / 2);
      const semifinal = nextRoundMatches[semifinalIndex];
      
      if (matchIndex % 2 === 0) {
        semifinal.entry1Id = match.winnerId;
      } else {
        semifinal.entry2Id = match.winnerId;
      }
      
      // Handle the bye entry for 9th stock
      if (bracket.userEntries.length === 9 && bracket.aiEntries.length === 9 && matchIndex === 3) {
        // Get the 9th entries (0-indexed, so index 8)
        const userBye = bracket.userEntries[8];
        const aiBye = bracket.aiEntries[8];
        
        // Decide which semifinal gets the bye entry based on which has an empty slot
        for (const semifinal of nextRoundMatches) {
          if (!semifinal.entry1Id) {
            semifinal.entry1Id = userBye.id || `user-8`;
            if (!userBye.id) userBye.id = `user-8`;
            break;
          } else if (!semifinal.entry2Id) {
            semifinal.entry2Id = aiBye.id || `ai-8`;
            if (!aiBye.id) aiBye.id = `ai-8`;
            break;
          }
        }
      }
    } else if (currentRound === 2) {
      // Semi-finals to final
      const final = nextRoundMatches[0];
      
      if (matchIndex === 0) {
        final.entry1Id = match.winnerId;
      } else {
        final.entry2Id = match.winnerId;
      }
    }
  }
}

/**
 * Delete a bracket by ID
 */
export async function deleteBracket(bracketId: string): Promise<boolean> {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Delete the bracket
    const { error } = await supabase
      .from('brackets')
      .delete()
      .eq('id', bracketId)
      .eq('user_id', userData.user.id); // Ensure the bracket belongs to the user
    
    if (error) {
      console.error("Error deleting bracket:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    logError(error, "deleteBracket");
    console.error(`Error deleting bracket ${bracketId}:`, error);
    throw error;
  }
}

/**
 * Reset a bracket to its initial state
 * This is useful for testing or if a user wants to restart a bracket
 */
export async function resetBracket(bracketId: string): Promise<Bracket> {
  try {
    // Get the bracket
    const bracket = await getBracketById(bracketId);
    
    // Reset entries
    for (const entry of [...bracket.userEntries, ...bracket.aiEntries]) {
      entry.endPrice = undefined;
      entry.percentChange = undefined;
    }
    
    // Reset matches
    for (const match of bracket.matches) {
      match.winnerId = undefined;
      match.entry1PercentChange = undefined;
      match.entry2PercentChange = undefined;
      match.completed = false;
      
      // For non-first round matches, clear entries
      if (match.roundNumber > 1) {
        match.entry1Id = undefined;
        match.entry2Id = undefined;
      }
    }
    
    // Reset bracket status
    bracket.status = 'pending';
    bracket.winnerId = undefined;
    bracket.userPoints = 0;
    bracket.aiPoints = 0;
    
    // Update start and end dates
    const startDate = new Date();
    bracket.startDate = startDate.toISOString();
    bracket.endDate = calculateEndDate(bracket.timeframe).toISOString();
    
    // Update the database
    const { error } = await supabase
      .from('brackets')
      .update({
        user_entries: bracket.userEntries,
        ai_entries: bracket.aiEntries,
        matches: bracket.matches,
        status: bracket.status,
        winner_id: bracket.winnerId,
        user_points: bracket.userPoints,
        ai_points: bracket.aiPoints,
        start_date: bracket.startDate,
        end_date: bracket.endDate
      })
      .eq('id', bracketId);
    
    if (error) {
      throw error;
    }
    
    return bracket;
  } catch (error) {
    logError(error, "resetBracket");
    console.error(`Error resetting bracket ${bracketId}:`, error);
    throw error;
  }
}