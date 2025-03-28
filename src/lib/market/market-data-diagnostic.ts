
/**
 * Market Data Diagnostic Utility
 * Tools to help diagnose market data connection issues
 */

import { supabase } from "@/integrations/supabase/client";
import { MARKET_CONFIG } from "../config";

export interface DiagnosticResult {
  success: boolean;
  configStatus: {
    polygonEnabled: boolean;
    apiKeyConfigured: boolean;
    refreshInterval: number;
  };
  apiStatus?: {
    connected: boolean;
    statusCode?: number;
    responseTime?: number;
    errorMessage?: string;
  };
  testDetails?: any;
  message: string;
  timestamp: string;
}

/**
 * Run a comprehensive diagnostic on the market data connection
 */
export async function runMarketDataDiagnostic(): Promise<DiagnosticResult> {
  console.log("Running market data diagnostic...");
  
  // Start with the basic result structure
  const result: DiagnosticResult = {
    success: false,
    configStatus: {
      polygonEnabled: MARKET_CONFIG.polygon.enabled,
      apiKeyConfigured: Boolean(MARKET_CONFIG.polygon.apiKey),
      refreshInterval: MARKET_CONFIG.refreshInterval
    },
    message: "",
    timestamp: new Date().toISOString()
  };
  
  try {
    // Test through the edge function (most reliable test)
    console.log("Testing Polygon API connection via edge function...");
    const startTime = Date.now();
    
    const { data, error } = await supabase.functions.invoke("polygon-market-data", {
      body: { test: true }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error("Edge function error:", error);
      result.apiStatus = {
        connected: false,
        errorMessage: error.message,
        responseTime
      };
      result.message = `Edge function error: ${error.message}`;
      return result;
    }
    
    if (!data || !data.success) {
      console.error("API connection failed:", data);
      result.apiStatus = {
        connected: false,
        errorMessage: data?.message || "Unknown error",
        responseTime
      };
      result.testDetails = data;
      result.message = data?.message || "API connection test failed";
      return result;
    }
    
    // Success!
    result.success = true;
    result.apiStatus = {
      connected: true,
      responseTime
    };
    result.testDetails = data;
    result.message = "Polygon API connection is working correctly";
    
    return result;
    
  } catch (error) {
    console.error("Error in diagnostic:", error);
    result.apiStatus = {
      connected: false,
      errorMessage: error.message
    };
    result.message = `Diagnostic error: ${error.message}`;
    return result;
  }
}

/**
 * Get a user-friendly error message for market data issues
 */
export function getMarketDataErrorMessage(error: any): string {
  if (!error) return "Unknown error";
  
  // Handle specific error types
  if (error.message?.includes("API_KEY_MISSING") || error.message?.includes("API key is not configured")) {
    return "Polygon API key is missing. Please configure it in the API settings.";
  }
  
  if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("Invalid or expired")) {
    return "The Polygon API key is invalid or expired. Please update it in the API settings.";
  }
  
  if (error.message?.includes("Network Error") || error.message?.includes("Failed to fetch")) {
    return "Network error. Unable to connect to the Polygon API. Please check your internet connection.";
  }
  
  // Default message
  return error.message || "Failed to fetch market data. Please try again.";
}
