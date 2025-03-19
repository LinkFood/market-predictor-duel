
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
      throw new Error("Missing required parameter: endpoint");
    }

    console.log(`Processing Polygon market data request for endpoint: ${endpoint}`);
    
    // Check if API key exists
    if (!POLYGON_API_KEY) {
      console.error("Polygon API key is not configured");
      throw new Error("Polygon API key is not configured");
    }

    // Build the URL with parameters
    let url = `${POLYGON_BASE_URL}${endpoint}`;
    
    // Add API key to all requests
    const queryParams = new URLSearchParams(params || {});
    queryParams.append('apiKey', POLYGON_API_KEY);
    
    // Append query parameters to URL
    url = `${url}?${queryParams.toString()}`;
    
    console.log(`Calling Polygon API: ${url}`);
    
    // Call Polygon API
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Polygon API error (${response.status}): ${errorData}`);
      throw new Error(`Polygon API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully received data from Polygon API");
    
    // Return the data
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in polygon-market-data function:", error.message);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing your request" 
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
