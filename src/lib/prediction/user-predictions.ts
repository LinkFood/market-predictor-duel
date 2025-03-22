
/**
 * Handles fetching and managing user predictions
 */

import { supabase } from '@/integrations/supabase/client';
import { Prediction } from './types';
import { dbToPrediction } from './adapters';

/**
 * Get user predictions
 */
export async function getUserPredictions(status?: 'pending' | 'complete' | 'completed'): Promise<Prediction[]> {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("User auth error:", userError);
      throw userError;
    }
    
    if (!userData.user) {
      console.log("No authenticated user found, returning empty predictions array");
      return [];
    }

    console.log(`Fetching predictions for user: ${userData.user.id}`);
    
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
    
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No predictions found for user");
      return [];
    }
    
    console.log(`Found ${data.length} predictions for user`);
    
    // Convert database records to application model
    return data.map(dbToPrediction);
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
    
    if (error) {
      console.error("Error fetching prediction by ID:", error);
      throw error;
    }
    
    if (!data) {
      console.log(`No prediction found with ID: ${id}`);
      return null;
    }
    
    return dbToPrediction(data);
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
}
