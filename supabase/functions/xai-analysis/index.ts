
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const XAI_API_KEY = Deno.env.get('XAI_API_KEY');
const XAI_BASE_URL = "https://api.x.ai/v1";

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
    const { ticker } = await req.json();
    
    if (!ticker) {
      throw new Error("Missing required parameter: ticker");
    }

    console.log(`Processing market analysis request for ticker: ${ticker}`);

    // Build the prompt for the analysis
    const analysisPrompt = `
      Provide a comprehensive market analysis for ${ticker} stock.
      Include:
      1. Technical analysis of recent price movements
      2. Key fundamental metrics and how they compare to industry averages
      3. Recent news or events that might impact the stock
      4. Potential catalysts for future price movements
      5. Key risks and challenges
      
      Format your response with clear sections and bullet points where appropriate.
    `;

    // Call X.ai API
    console.log("Calling X.ai API for analysis");
    const response = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "x1",
        messages: [
          {
            role: "system",
            content: "You are a financial analyst specialized in stock market analysis. Provide detailed, data-driven insights."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`X.ai API error (${response.status}): ${errorData}`);
      throw new Error(`X.ai API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully received analysis from X.ai");
    
    // Extract the analysis from the response
    const analysis = data.choices[0]?.message?.content || "Analysis unavailable";

    // Return the analysis
    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in xai-analysis function:", error.message);
    
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
