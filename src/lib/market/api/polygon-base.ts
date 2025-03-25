
/**
 * Polygon.io Base API Service
 * Handles core API interactions with retry logic 
 */

import { supabase } from "@/integrations/supabase/client";
import { recordApiSuccess, recordApiFailure } from "../../api-health-monitor";
import { MARKET_CONFIG, API_ERRORS } from "../../config";

/**
 * Call the Polygon API through our Supabase edge function with retries
 */
export async function callPolygonApi(endpoint: string, params = {}, maxRetries = 3) {
  let attempts = 0;
  let lastError = null;

  while (attempts < maxRetries) {
    try {
      console.log(`Calling Polygon API endpoint ${endpoint} via edge function (attempt ${attempts + 1}/${maxRetries})`);
      
      const { data, error } = await supabase.functions.invoke('polygon-market-data', {
        body: { 
          endpoint,
          params
        }
      });

      if (error) {
        console.error('Error calling polygon-market-data function:', error);
        recordApiFailure('polygon', error);
        throw error;
      }
      
      // Check if the response contains an error message from the edge function
      if (data && data.error) {
        console.error('Polygon API returned an error:', data.error, data.message);
        recordApiFailure('polygon', new Error(data.error));
        
        throw new Error(`Polygon API error: ${data.error} - ${data.message || ''}`);
      }
      
      // Record successful API call
      recordApiSuccess('polygon');
      
      console.log(`Successfully received data for ${endpoint}`);
      return data;
    } catch (error) {
      lastError = error;
      attempts++;
      
      if (attempts >= maxRetries) {
        console.error(`Final attempt ${attempts} failed for ${endpoint}:`, error);
        throw error;
      }
      
      // Exponential backoff with a fixed delay
      const delayMs = 1000 * Math.pow(2, attempts - 1);
      console.log(`Retrying in ${delayMs}ms... (attempt ${attempts + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

/**
 * Helper function to get a date X days ago in YYYY-MM-DD format
 */
export function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
