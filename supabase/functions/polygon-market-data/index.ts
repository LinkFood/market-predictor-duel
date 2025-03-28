import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const POLYGON_BASE_URL = "https://api.polygon.io";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    
    // Handle test mode
    if (requestData.test === true) {
      console.log("Test mode activated");
      return await handleTestMode(requestData.apiKey);
    }
    
    const { endpoint, params } = requestData;
    
    if (!endpoint) {
      console.error("Missing required parameter: endpoint");
      throw new Error("Missing required parameter: endpoint");
    }

    console.log(`Processing Polygon market data request for endpoint: ${endpoint}`);
    console.log(`Request params:`, params);
    
    // Get the API key
    let apiKey;
    
    // If a key is provided in the request (for testing), use it
    if (requestData.apiKey) {
      apiKey = requestData.apiKey;
    } else {
      // Otherwise, get it from environment or storage
      apiKey = await getPolygonApiKey();
    }
    
    if (!apiKey) {
      console.error("Polygon API key is not configured");
      return new Response(
        JSON.stringify({ 
          error: "API_KEY_MISSING",
          message: "Polygon API key is not configured",
          details: "Please set up your Polygon API key in the settings"
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    console.log(`Polygon API key found. Length: ${apiKey.length}`);
    
    // Build the URL with parameters
    let url = `${POLYGON_BASE_URL}${endpoint}`;
    
    // Add API key to all requests
    const queryParams = new URLSearchParams(params || {});
    queryParams.append('apiKey', apiKey);
    
    // Append query parameters to URL
    url = `${url}?${queryParams.toString()}`;
    
    console.log(`Calling Polygon API: ${url.replace(apiKey, '[REDACTED]')}`);
    
    // Call Polygon API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      const status = response.status;
      
      // Handle API key errors specifically
      if (status === 401 || status === 403) {
        console.error(`Polygon API authentication error (${status}): Invalid or expired API key`);
        return new Response(
          JSON.stringify({ 
            error: "API_KEY_INVALID",
            message: "Invalid or expired Polygon API key",
            status: status,
            endpoint
          }),
          { 
            status: status,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Polygon API error (${status}): ${errorData}`);
        
        return new Response(
          JSON.stringify({ 
            error: `Polygon API error: ${status}`,
            message: errorData,
            endpoint
          }),
          { 
            status: status,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const data = await response.json();
      
      // Basic validation of the response data
      if (!data) {
        throw new Error("Empty response from Polygon API");
      }
      
      // Validate response based on the endpoint
      // For tickers endpoint (used by our popular tickers approach)
      if (endpoint.includes('/tickers') && params && params.tickers) {
        if (!data.tickers || !Array.isArray(data.tickers)) {
          console.error("Invalid response format for tickers snapshot:", endpoint, data);
          throw new Error("Invalid response format for tickers data");
        }
        console.log(`Received tickers snapshot data with ${data.tickers.length} results`);
      }
      // For market movers endpoints, validate the tickers array
      else if (endpoint.includes('/gainers') || endpoint.includes('/losers')) {
        if (!data.tickers || !Array.isArray(data.tickers)) {
          console.error("Invalid response format for market movers:", data);
          throw new Error("Invalid response format for market movers");
        }
        console.log(`Received ${data.tickers.length} tickers from ${endpoint}`);
      }
      // For indices endpoint
      else if (endpoint.includes('/markets/indices')) {
        if (!data.tickers || !Array.isArray(data.tickers)) {
          console.error("Invalid response format for indices snapshot:", endpoint, data);
          throw new Error("Invalid response format for indices data");
        }
        console.log(`Received indices snapshot data with ${data.tickers.length} results`);
      }
      
      console.log(`Successfully received data from Polygon API for ${endpoint}`);
      
      // Add metadata to help with debugging
      const enhancedData = {
        ...data,
        _meta: {
          source: 'polygon',
          timestamp: new Date().toISOString(),
          endpoint,
          requestParams: params
        }
      };
      
      // Return the data
      return new Response(
        JSON.stringify(enhancedData),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Error in polygon-market-data function:", error.message);
    
    // Return specific error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing your request",
        timestamp: new Date().toISOString(),
        isPolygonError: true
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper function to get the Polygon API key
async function getPolygonApiKey(): Promise<string> {
  // Try to get from environment variable first (Supabase secret)
  const envKey = Deno.env.get('POLYGON_API_KEY');
  if (envKey) {
    console.log("Using API key from environment variable");
    return envKey;
  }
  
  // Try to get from Deno KV
  try {
    const kv = await Deno.openKv();
    const keyEntry = await kv.get(["polygon_api_key"]);
    if (keyEntry && keyEntry.value) {
      console.log("Found API key in Deno KV storage");
      return keyEntry.value as string;
    }
  } catch (error) {
    console.error("Error accessing Deno KV:", error);
  }
  
  // No key found
  return "";
}

// Handler for test mode
async function handleTestMode(testApiKey?: string): Promise<Response> {
  try {
    // If a test API key is provided, use it, otherwise get the stored key
    const apiKey = testApiKey || await getPolygonApiKey();
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "No API key provided or stored",
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Test the API key with a simple request
    const testUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`;
    console.log(`Testing Polygon API connection: ${testUrl.replace(apiKey, '[REDACTED]')}`);
    
    const response = await fetch(testUrl);
    const status = response.status;
    
    if (status === 401 || status === 403) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "API key is invalid or unauthorized",
          status,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ 
          success: false,
          message: `API returned error: ${status} - ${errorText}`,
          status,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "API connection successful",
        testData: {
          status: "success",
          ticker: "AAPL",
          responseStatus: status,
          hasResults: Boolean(data.results && data.results.length > 0)
        },
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in test mode:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        message: `Test failed: ${error.message || "Unknown error"}`,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}
