
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
    // Try to get polygon API key
    let apiKey = Deno.env.get("POLYGON_API_KEY");
    
    // Try from KV store if not in env
    if (!apiKey) {
      try {
        const kv = await Deno.openKv();
        const keyResult = await kv.get(["polygon_api_key"]);
        apiKey = keyResult.value as string;
      } catch (kvError) {
        console.error("Error accessing KV store:", kvError);
      }
    }
    
    // Check if this is a test request
    const { test } = await req.json();
    
    if (test) {
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Polygon API key not configured"
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Try a simple API call to validate the key
      const testUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`;
      const response = await fetch(testUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({
            success: false,
            message: `API validation failed: Status ${response.status}`,
            details: errorText
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
          message: "Polygon API connection is valid",
          sample: data.results ? data.results[0] : null
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // This would be where actual market data functions would go
    // For now, just return a message that this function is under development
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Polygon market data function is available",
        implemented: false
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error("Error in polygon-market-data function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred"
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
