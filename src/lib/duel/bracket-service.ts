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
      bracket.status = 'completed';
      
      // Calculate results and determine winner
      const userPoints = calculateTotalPoints(bracket.userEntries);
      const aiPoints = calculateTotalPoints(bracket.aiEntries);
      
      bracket.userPoints = userPoints;
      bracket.aiPoints = aiPoints;
      bracket.winnerId = userPoints > aiPoints ? 'user' : 'ai';
    } else {
      bracket.status = 'active';
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