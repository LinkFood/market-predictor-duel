
import { supabase } from "@/integrations/supabase/client";

interface ApiTestResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Test connection to the Polygon API
 */
export async function testPolygonApiConnection(apiKey?: string): Promise<ApiTestResult> {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { 
        test: true,
        apiKey
      }
    });

    if (error) {
      console.error('Error testing Polygon API connection:', error);
      return {
        success: false,
        message: `Connection test failed: ${error.message}`
      };
    }

    // Check the response from the edge function
    if (data && data.success === true) {
      return {
        success: true,
        message: "Successfully connected to Polygon API",
        data: data.testData
      };
    } else {
      return {
        success: false,
        message: data?.message || "Connection test failed with unknown error",
        data
      };
    }
  } catch (error) {
    console.error('Exception testing Polygon API connection:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Test connection to the X.ai API
 */
export async function testXaiApiConnection(): Promise<ApiTestResult> {
  try {
    const { data, error } = await supabase.functions.invoke('xai-prediction', {
      body: { test: true }
    });

    if (error) {
      console.error('Error testing X.ai API connection:', error);
      return {
        success: false,
        message: `Connection test failed: ${error.message}`
      };
    }

    // Check the response from the edge function
    if (data && data.success === true) {
      return {
        success: true,
        message: "Successfully connected to X.ai API",
        data: data.testData
      };
    } else {
      return {
        success: false,
        message: data?.message || "Connection test failed with unknown error",
        data
      };
    }
  } catch (error) {
    console.error('Exception testing X.ai API connection:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
