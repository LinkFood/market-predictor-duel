
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      console.error("Missing required parameter: apiKey");
      throw new Error("API key is required");
    }

    console.log("Storing Polygon API key (length:", apiKey.length, ")");
    
    // Store the API key as an env variable
    Deno.env.set("POLYGON_API_KEY", apiKey);
    console.log("Set POLYGON_API_KEY environment variable");
    
    // Validate the API key with a simple call to Polygon API
    const testUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`;
    console.log(`Testing Polygon API connection`);
    
    const response = await fetch(testUrl);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API key validation failed (${response.status}):`, errorData);
      throw new Error(`API key validation failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.results) {
      throw new Error("API key validation failed: Invalid response format");
    }
    
    console.log("API key validation successful");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Polygon API key stored and validated successfully",
        validationResults: {
          status: response.status,
          hasResults: data.results.length > 0
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error("Error in set-polygon-api-key function:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while setting the API key" 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
