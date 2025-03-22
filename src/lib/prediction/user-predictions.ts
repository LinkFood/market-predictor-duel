
/**
 * Handles fetching and managing user predictions
 */

import { supabase } from '@/integrations/supabase/client';
import { Prediction } from './types';
import { dbToPrediction } from './adapters';
import { toast } from "sonner";

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
      if (status === 'complete') {
        // Handle both 'complete' and 'completed' statuses for backward compatibility
        query = query.or('status.eq.complete,status.eq.completed');
      } else {
        query = query.eq('status', status);
      }
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

/**
 * Manually trigger resolution of a pending prediction
 */
export async function resolvePredictionManually(id: string): Promise<Prediction | null> {
  try {
    console.log(`Manually triggering resolution for prediction: ${id}`);
    
    // Call the resolve-predictions edge function for this specific prediction
    const { data, error } = await supabase.functions.invoke('resolve-predictions', {
      body: { predictionId: id }
    });
    
    if (error) {
      console.error("Error resolving prediction:", error);
      toast.error("Failed to resolve prediction", {
        description: error.message
      });
      throw error;
    }
    
    toast.success("Prediction resolved", {
      description: "The prediction has been successfully resolved"
    });
    
    // Fetch the updated prediction
    return await getPredictionById(id);
  } catch (error) {
    console.error("Error in manual prediction resolution:", error);
    throw error;
  }
}

/**
 * Check if there are any pending predictions that need resolution
 * This can be called periodically to keep the UI updated
 */
export async function checkForPendingResolutions(): Promise<void> {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    // Get current time
    const now = new Date();
    
    // Fetch pending predictions that have passed their resolve date
    const { data, error } = await supabase
      .from('predictions')
      .select('id, resolves_at')
      .eq('user_id', userData.user.id)
      .eq('status', 'pending')
      .lt('resolves_at', now.toISOString());
    
    if (error) {
      console.error("Error checking for pending resolutions:", error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`Found ${data.length} predictions that need resolution`);
      
      // Notify user that predictions are ready to be resolved
      toast.info(`${data.length} prediction${data.length > 1 ? 's' : ''} ready to be resolved`, {
        description: "Tap to view your prediction results",
        action: {
          label: "View",
          onClick: () => {
            window.location.href = "/app/predictions/history";
          }
        }
      });
      
      // Optionally, trigger resolution automatically
      try {
        await supabase.functions.invoke('resolve-predictions');
      } catch (e) {
        console.error("Failed to automatically resolve predictions:", e);
      }
    }
  } catch (error) {
    console.error("Error in checkForPendingResolutions:", error);
  }
}
