
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const API_KEY = Deno.env.get('XAI_API_KEY');
const XAI_BASE_URL = "https://api.x.ai/v1";
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const API_PROVIDER = "openai"; // Use "openai" instead of "xai" because X.ai model might not be available

// Set the base URL and model based on the provider
const BASE_URL = API_PROVIDER === "xai" ? XAI_BASE_URL : OPENAI_BASE_URL;
const MODEL_NAME = API_PROVIDER === "xai" ? "x1" : "gpt-4o-mini"; // Use OpenAI's gpt-4o-mini model

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Sleep function for retry delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API request with retry logic
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      
      if (retries > 0 && (response.status === 429 || response.status >= 500)) {
        console.log(`Retrying... (${retries} attempts left)`);
        await sleep(RETRY_DELAY);
        return fetchWithRetry(url, options, retries - 1);
      }
      
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0 && error.message.includes('network')) {
      console.log(`Network error, retrying... (${retries} attempts left)`);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Validate the input parameters
function validateInput(ticker: string, timeframe: string, predictionType: string) {
  if (!ticker) {
    throw new Error("Missing required parameter: ticker");
  }
  
  if (!timeframe || !['1d', '1w', '1m', '3m'].includes(timeframe)) {
    throw new Error(`Invalid timeframe: ${timeframe}`);
  }
  
  if (!predictionType || !['trend', 'price'].includes(predictionType)) {
    throw new Error(`Invalid prediction type: ${predictionType}`);
  }
}

// Parse and validate the prediction result
function validatePredictionResult(content: string, predictionType: string) {
  try {
    // First, try to extract JSON if wrapped in code blocks or text
    const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                      content.match(/{[\s\S]*?}/);
                      
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    const predictionData = JSON.parse(jsonStr);
    
    // Validate the prediction structure
    if (!predictionData.prediction) {
      throw new Error("Missing prediction in parsed data");
    }
    
    // Normalize trend predictions
    if (predictionType === 'trend') {
      if (!['uptrend', 'downtrend'].includes(predictionData.prediction.toLowerCase())) {
        predictionData.prediction = predictionData.prediction.toLowerCase().includes('up') || 
                                  predictionData.prediction.toLowerCase().includes('bull') ? 
                                  'uptrend' : 'downtrend';
      }
    }
    
    // Ensure all required fields are present
    predictionData.confidence = predictionData.confidence || 80;
    predictionData.rationale = predictionData.rationale || predictionData.reasoning || 
                              "Based on market analysis, the AI has made this prediction.";
    predictionData.supportingPoints = predictionData.supportingPoints || [];
    predictionData.counterPoints = predictionData.counterPoints || [];
    
    return predictionData;
  } catch (parseError) {
    console.error("Failed to parse JSON response:", parseError);
    console.log("Raw content:", content);
    
    // If JSON parsing fails, attempt to extract information with regex
    return extractFallbackPrediction(content, predictionType);
  }
}

// Extract prediction from non-JSON response
function extractFallbackPrediction(content: string, predictionType: string) {
  console.log("Using fallback prediction extraction");
  
  const prediction = predictionType === 'trend' ? 
    (content.match(/prediction[:\s]+(uptrend|downtrend)/i)?.[1] || 
     (content.toLowerCase().includes('uptrend') || content.toLowerCase().includes('bullish')) ? 'uptrend' : 'downtrend') :
    content.match(/prediction[:\s]+\$?(\d+(\.\d+)?)/i)?.[1] || "0.00";
    
  const confidence = parseInt(content.match(/confidence[:\s]+(\d+)/i)?.[1] || "80");
  const rationale = content.match(/rationale[:\s]+(.*?)(\n|$)/i)?.[1] || "Based on market analysis.";
  
  // Create a structured prediction if parsing failed
  return {
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
}

// Run API connectivity test
async function testApiConnection() {
  if (!API_KEY) {
    console.error("Missing API key");
    return { success: false, error: "API key not configured" };
  }
  
  try {
    const testResponse = await fetch(`${BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error(`API test failed (${testResponse.status}): ${errorText}`);
      return { 
        success: false, 
        status: testResponse.status,
        error: errorText
      };
    }
    
    const models = await testResponse.json();
    return { 
      success: true, 
      availableModels: models 
    };
  } catch (error) {
    console.error("API test error:", error.message);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request start
    console.log("Processing prediction request");
    console.log(`Using ${API_PROVIDER} with model ${MODEL_NAME}`);
    
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
    
    // Check if API key exists
    if (!API_KEY) {
      console.error("API key is not configured");
      throw new Error("API key is not configured");
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

    // Call API with retry logic
    console.log(`Calling ${API_PROVIDER} API for prediction using model ${MODEL_NAME}`);
    const apiPayload = {
      model: MODEL_NAME,
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
    };
    
    console.log("API payload:", JSON.stringify(apiPayload));
    
    const response = await fetchWithRetry(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(apiPayload),
    });

    const data = await response.json();
    console.log(`Successfully received response from ${API_PROVIDER}`);
    
    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error(`No content in ${API_PROVIDER} response:`, JSON.stringify(data));
      throw new Error(`No content in ${API_PROVIDER} response`);
    }
    
    // Parse the JSON response with enhanced validation
    const predictionData = validatePredictionResult(content, predictionType);
    console.log("Successfully processed prediction:", JSON.stringify(predictionData));
    
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
