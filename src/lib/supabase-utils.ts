
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Safely parse JSON from Supabase
export const safelyParseJson = <T>(json: Json | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  try {
    if (typeof json === 'string') {
      return JSON.parse(json) as T;
    }
    return json as unknown as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
};

// Get all public tables
export const getPublicTables = async (): Promise<string[]> => {
  try {
    // Use supabase edge function to get tables
    const response = await supabase.functions.invoke('get-tables');
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data?.tables || [];
  } catch (error) {
    console.error('Error getting public tables:', error);
    return [];
  }
};

// Type utilities for database tables
export const typeSafeTables = {
  brackets: 'brackets',
  predictions: 'predictions',
  profiles: 'profiles',
  user_stats: 'user_stats',
  user_subscriptions: 'user_subscriptions',
  usage_events: 'usage_events',
  subscriptions: 'subscriptions',
  prediction_patterns: 'prediction_patterns'
} as const;

export type SupabaseTable = keyof typeof typeSafeTables;

// Helper to ensure we're using valid table names
export const getTable = (table: SupabaseTable) => {
  return typeSafeTables[table];
};
