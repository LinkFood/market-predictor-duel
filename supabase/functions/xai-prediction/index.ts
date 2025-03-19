
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
    const { ticker, timeframe, predictionType, currentPrice } = await req.json();
    
    if (!ticker) {
      throw new Error("Missing required parameter: ticker");
    }

    console.log(`Processing prediction request for ticker: ${ticker}, type: ${predictionType}, timeframe: ${timeframe}`);
    
    // Check if API key exists
    if (!XAI_API_KEY) {
      console.error("X.ai API key is not configured");
      throw new Error("X.ai API key is not configured");
    }

    // Build the prompt for the prediction
    const predictionPrompt = `
      Please provide a ${predictionType} prediction for ${ticker} stock over the ${timeframe} timeframe.
      ${currentPrice ? `The current price is $${currentPrice}.` : ''}
      
      If the prediction type is 'trend', respond ONLY with 'uptrend' or 'downtrend'.
      If the prediction type is 'price', predict a specific price point.
      
      Also provide:
      1. A confidence score from 0 to 100
      2. A brief rationale for your prediction
      3. Three supporting points that favor this prediction
      4. Three counter points that could challenge this prediction
      
      Format your response as a structured JSON with keys:
      - prediction (string, either 'uptrend'/'downtrend' OR a price value with $ prefix)
      - confidence (number between 0-100)
      - rationale (string explaining your prediction)
      - supportingPoints (array of 3 strings)
      - counterPoints (array of 3 strings)
    `;

    // Call X.ai API
    console.log("Calling X.ai API for prediction");
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
            content: "You are a financial analyst specialized in stock market predictions. Provide concise, accurate predictions based on market data. Always respond in the exact JSON format requested by the user."
          },
          {
            role: "user",
            content: predictionPrompt
          }
        ],
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`X.ai API error (${response.status}): ${errorData}`);
      throw new Error(`X.ai API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully received response from X.ai");
    
    // Extract the content from the response
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in X.ai response");
    }
    
    // Try to parse the JSON response
    let predictionData;
    try {
      // First, try to extract JSON if wrapped in code blocks or text
      const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                        content.match(/{[\s\S]*?}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      predictionData = JSON.parse(jsonStr);
      
      // Validate the prediction structure
      if (!predictionData.prediction) {
        throw new Error("Missing prediction in parsed data");
      }
      
      console.log("Successfully parsed prediction:", predictionData);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.log("Raw content:", content);
      
      // If JSON parsing fails, attempt to extract information with regex
      const prediction = predictionType === 'trend' ? 
        (content.match(/prediction[:\s]+(uptrend|downtrend)/i)?.[1] || 
         (content.toLowerCase().includes('uptrend') || content.toLowerCase().includes('bullish')) ? 'uptrend' : 'downtrend') :
        content.match(/prediction[:\s]+\$?(\d+(\.\d+)?)/i)?.[1] || "$0.00";
        
      const confidence = parseInt(content.match(/confidence[:\s]+(\d+)/i)?.[1] || "80");
      const rationale = content.match(/rationale[:\s]+(.*?)(\n|$)/i)?.[1] || "Based on market analysis.";
      
      // Create a structured prediction if parsing failed
      predictionData = {
        prediction: predictionType === 'trend' ? prediction : `$${prediction}`,
        confidence: isNaN(confidence) ? 80 : confidence,
        rationale,
        supportingPoints: [
          "Technical indicators suggest this direction",
          "Recent price action supports this view",
          "Market sentiment aligns with this prediction"
        ],
        counterPoints: [
          "Market volatility is a risk factor",
          "External economic events could impact this prediction",
          "Sector-specific challenges may arise"
        ]
      };
      
      console.log("Created fallback prediction:", predictionData);
    }
    
    // Ensure prediction format is correct
    if (predictionType === 'trend') {
      // Normalize trend predictions to be either 'uptrend' or 'downtrend'
      if (!['uptrend', 'downtrend'].includes(predictionData.prediction.toLowerCase())) {
        predictionData.prediction = predictionData.prediction.toLowerCase().includes('up') || 
                                    predictionData.prediction.toLowerCase().includes('bull') ? 
                                    'uptrend' : 'downtrend';
      }
    }
    
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
    console.error("Error in xai-prediction function:", error.message);
    
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
