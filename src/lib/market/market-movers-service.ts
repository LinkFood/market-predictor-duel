
/**
 * Market Movers Service
 * Handles fetching top gainers and losers
 */

import { StockData } from "./types";
import { FEATURES, config, API_ERRORS } from "../config";
import { getMockTopMovers } from "./mock-data-utils";
import { getPolygonMarketMovers } from "./polygon-api-service";
import { logError, showErrorToast } from "../error-handling";
import { toast } from "@/hooks/use-toast";

/**
 * Get top gainers and losers for the day
 */
export async function getTopMovers(): Promise<{ gainers: StockData[]; losers: StockData[]; usingMockData: boolean }> {
  let usingMockData = false;
  
  try {
    // Use real market data if enabled, otherwise use mock data
    if (FEATURES.enableRealMarketData && config.polygon.enabled) {
      console.log(`🌐 Attempting to fetch market movers from Polygon.io`);
      
      try {
        const realData = await getPolygonMarketMovers();
        
        // Validate that we have data before returning
        if (realData && realData.gainers && realData.losers && 
            (realData.gainers.length > 0 || realData.losers.length > 0)) {
          console.log(`✅ Successfully fetched market movers: ${realData.gainers.length} gainers, ${realData.losers.length} losers`);
          return { ...realData, usingMockData: false };
        } else {
          const error = new Error('Empty or invalid data received from Polygon API');
          console.warn('⚠️ Empty or invalid data received from Polygon API:', realData);
          showErrorToast(error, "Market Data Error");
          
          // If we want to force an error rather than fall back
          if (FEATURES.devMode) {
            console.error("Using mock data because of empty response from Polygon API");
            usingMockData = true;
            
            // Show a specific toast for API issues when in dev mode
            toast({
              title: "API Configuration Issue",
              description: "Check that your Polygon API key is correctly set in Supabase secrets and that the key is valid.",
              variant: "destructive"
            });
            
            return { ...getMockTopMovers(), usingMockData };
          }
          
          throw error;
        }
      } catch (apiError: any) {
        logError(apiError, 'getTopMovers:polygon');
        console.error("❌ Error fetching Polygon market movers:", apiError);
        
        // Check for specific API key errors
        const errorMessage = apiError?.message || '';
        const data = apiError?.data || {};
        
        if (errorMessage.includes('API_KEY_MISSING') || 
            errorMessage.includes('API_KEY_INVALID') ||
            data?.error === 'API_KEY_MISSING' || 
            data?.error === 'API_KEY_INVALID') {
          
          console.error("API Key configuration issue detected");
          
          toast({
            title: "API Key Configuration Issue",
            description: API_ERRORS.POLYGON_ERROR,
            variant: "destructive"
          });
        } else {
          showErrorToast(apiError, "Market Data Error");
        }
        
        // In dev mode, show more detailed error and use mock data
        if (FEATURES.devMode) {
          console.error("Using mock data due to API error:", apiError);
          usingMockData = true;
          return { ...getMockTopMovers(), usingMockData };
        }
        
        throw apiError; // Propagate error rather than silently falling back
      }
    } else {
      console.log(`🧪 Using mock market movers data (real data disabled in config)`);
      usingMockData = true;
      return { ...getMockTopMovers(), usingMockData };
    }
  } catch (error) {
    logError(error, 'getTopMovers');
    console.error("❌ Error in getTopMovers:", error);
    
    // Show a clear error indicator in UI
    toast({
      title: "Using Simulated Market Data",
      description: "Failed to fetch real market data. Please check your API configuration.",
      variant: "destructive"
    });
    
    // Only fall back to mock data if real data is not supposed to be used
    // or we're in dev mode
    if (!FEATURES.enableRealMarketData || !config.polygon.enabled || FEATURES.devMode) {
      console.log("Using mock data as real data was not requested or in dev mode");
      usingMockData = true;
      return { ...getMockTopMovers(), usingMockData };
    }
    
    throw error; // Propagate error when real data is expected and not in dev mode
  }
}
