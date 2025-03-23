
import { Json } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bracket, 
  BracketEntry, 
  BracketMatch, 
  BracketTimeframe, 
  BracketStatus,
  BracketSize, 
  AIPersonality 
} from './types';

// Type guard to check if a value is a valid BracketTimeframe
export function isValidTimeframe(value: string): value is BracketTimeframe {
  return ['daily', 'weekly', 'monthly'].includes(value);
}

// Type guard to check if a value is a valid BracketSize
export function isValidBracketSize(value: number): value is BracketSize {
  return [3, 6, 9].includes(value);
}

// Type guard to check if a value is a valid BracketStatus
export function isValidBracketStatus(value: string): value is BracketStatus {
  return ['pending', 'active', 'completed'].includes(value);
}

// Type guard to check if a value is a valid AIPersonality
export function isValidAIPersonality(value: string): value is AIPersonality {
  return [
    'ValueHunter', 
    'MomentumTrader', 
    'TrendFollower', 
    'ContraThinker', 
    'GrowthSeeker', 
    'DividendCollector'
  ].includes(value);
}

// Convert database bracket to app model
export function dbBracketToModel(dbBracket: any): Bracket {
  // Safely convert timeframe
  const timeframe: BracketTimeframe = isValidTimeframe(dbBracket.timeframe) 
    ? dbBracket.timeframe 
    : 'weekly'; // Default fallback
  
  // Safely convert size
  const size: BracketSize = isValidBracketSize(dbBracket.size) 
    ? dbBracket.size 
    : 3; // Default fallback
  
  // Safely convert status
  const status: BracketStatus = isValidBracketStatus(dbBracket.status) 
    ? dbBracket.status 
    : 'pending'; // Default fallback
  
  // Safely convert AI personality
  const aiPersonality: AIPersonality = isValidAIPersonality(dbBracket.ai_personality) 
    ? dbBracket.ai_personality 
    : 'ValueHunter'; // Default fallback
  
  // Safely convert JSON fields
  const userEntries: BracketEntry[] = Array.isArray(dbBracket.user_entries) 
    ? dbBracket.user_entries 
    : [];
  
  const aiEntries: BracketEntry[] = Array.isArray(dbBracket.ai_entries) 
    ? dbBracket.ai_entries 
    : [];
  
  const matches: BracketMatch[] = Array.isArray(dbBracket.matches) 
    ? dbBracket.matches 
    : [];
  
  return {
    id: dbBracket.id,
    userId: dbBracket.user_id,
    name: dbBracket.name,
    timeframe,
    size,
    status,
    aiPersonality,
    userEntries,
    aiEntries,
    matches,
    winnerId: dbBracket.winner_id,
    startDate: dbBracket.start_date,
    endDate: dbBracket.end_date,
    createdAt: dbBracket.created_at,
    userPoints: dbBracket.user_points || 0,
    aiPoints: dbBracket.ai_points || 0
  };
}

// Convert app model to database format
export function modelBracketToDb(bracket: Bracket): Record<string, any> {
  return {
    user_id: bracket.userId,
    name: bracket.name,
    timeframe: bracket.timeframe,
    size: bracket.size,
    status: bracket.status,
    ai_personality: bracket.aiPersonality,
    user_entries: bracket.userEntries as unknown as Json,
    ai_entries: bracket.aiEntries as unknown as Json,
    matches: bracket.matches as unknown as Json,
    winner_id: bracket.winnerId,
    start_date: bracket.startDate,
    end_date: bracket.endDate,
    created_at: bracket.createdAt,
    user_points: bracket.userPoints,
    ai_points: bracket.aiPoints
  };
}
