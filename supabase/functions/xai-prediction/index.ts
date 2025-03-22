
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

import { corsHeaders, validateInput } from "./utils.ts";
import { testApiConnection } from "./api-test.ts";
import { generatePrediction } from "./prediction-service.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request start
    console.log("Processing prediction request");
    
    // Run API test if requested
    if (req.url.includes('test=true')) {
      console.log("Running API connectivity test");
      const testResult = await testApiConnection();
      console.log("Test result:", JSON.stringify(testResult));
      
      return new Response(
        JSON.stringify(testResult),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Parse request body
    const requestData = await req.json();
    const { ticker, timeframe, predictionType, currentPrice } = requestData;
    
    // Log request details
    console.log(`Request details: ticker=${ticker}, type=${predictionType}, timeframe=${timeframe}, price=${currentPrice}`);
    
    // Validate input parameters
    validateInput(ticker, timeframe, predictionType);
    
    // Generate the prediction
    const predictionData = await generatePrediction(ticker, timeframe, predictionType, currentPrice);
    
    // Return the prediction data
    return new Response(
      JSON.stringify(predictionData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in prediction function:", error.message, error.stack);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing your request",
        timestamp: new Date().toISOString(),
        stack: error.stack
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
