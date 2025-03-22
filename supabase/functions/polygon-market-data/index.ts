
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY');
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
    const { endpoint, params } = await req.json();
    
    if (!endpoint) {
      console.error("Missing required parameter: endpoint");
      throw new Error("Missing required parameter: endpoint");
    }

    console.log(`Processing Polygon market data request for endpoint: ${endpoint}`);
    console.log(`Request params:`, params);
    
    // Check if API key exists and log detailed information about it
    if (!POLYGON_API_KEY) {
      console.error("Polygon API key is not configured in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "API_KEY_MISSING",
          message: "Polygon API key is not configured in environment variables",
          details: "Please check Supabase secrets configuration"
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
    
    console.log(`Polygon API key found. Length: ${POLYGON_API_KEY.length}`);

    // Build the URL with parameters
    let url = `${POLYGON_BASE_URL}${endpoint}`;
    
    // Add API key to all requests
    const queryParams = new URLSearchParams(params || {});
    queryParams.append('apiKey', POLYGON_API_KEY);
    
    // Append query parameters to URL
    url = `${url}?${queryParams.toString()}`;
    
    console.log(`Calling Polygon API: ${url.replace(POLYGON_API_KEY, '[REDACTED]')}`);
    
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
      
      // Special validation for indices endpoint
      if (endpoint.includes('/markets/indices')) {
        if (!data.tickers || !Array.isArray(data.tickers)) {
          console.error("Invalid response format for indices snapshot:", endpoint, data);
          throw new Error("Invalid response format for indices data");
        }
        console.log(`Received indices snapshot data with ${data.tickers.length} results`);
      }
      // For market movers endpoints, validate the tickers array
      else if (endpoint.includes('/gainers') || endpoint.includes('/losers')) {
        if (!data.tickers || !Array.isArray(data.tickers)) {
          console.error("Invalid response format for market movers:", data);
          throw new Error("Invalid response format for market movers");
        }
        console.log(`Received ${data.tickers.length} tickers from ${endpoint}`);
      }
      
      console.log(`Successfully received data from Polygon API for ${endpoint}`);
      
      // Add metadata to help with debugging
      const enhancedData = {
        ...data,
        _meta: {
          source: 'polygon',
          timestamp: new Date().toISOString(),
          endpoint
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
