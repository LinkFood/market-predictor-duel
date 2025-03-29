
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
    // Get polygon API key from environment variable
    const apiKey = Deno.env.get("POLYGON_API_KEY");
    console.log("Polygon API key found:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Polygon API key not configured"
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
    
    // Parse request body
    const body = await req.json();
    
    // Check if this is a test request
    if (body.test) {
      // Try a simple API call to validate the key
      const testUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`;
      console.log(`Testing Polygon API connection`);
      
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
            status: response.status,
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
    
    // Handle specific endpoint requests
    if (body.endpoint === 'snapshot') {
      const tickers = body.tickers || 'SPY,DIA,QQQ,IWM';
      console.log("Request params:", { tickers });
      
      const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickers}&apiKey=${apiKey}`;
      console.log(`Calling Polygon API: ${url.replace(apiKey, '[REDACTED]')}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Polygon API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received tickers snapshot data with ${data.tickers?.length || 0} results`);
      
      return new Response(
        JSON.stringify({
          success: true,
          data
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Polygon market data function is available",
        implemented: true,
        availableEndpoints: ["snapshot"]
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
