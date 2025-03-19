
/**
 * Handles fetching and managing user predictions
 */

import { supabase } from '@/integrations/supabase/client';
import { Prediction } from './types';

/**
 * Get user predictions
 */
export async function getUserPredictions(status?: 'pending' | 'complete' | 'completed'): Promise<Prediction[]> {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) {
      throw new Error("User not authenticated");
    }

    // Build query to fetch predictions
    let query = supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
    
    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as Prediction[];
  } catch (error) {
    console.error("Error fetching user predictions:", error);
    throw error;
  }
}

/**
 * Get a single prediction by ID
 */
export async function getPredictionById(id: string): Promise<Prediction | null> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Prediction;
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
}
