
// Prediction generation service

import { corsHeaders, fetchWithRetry, validatePredictionResult } from "./utils.ts";

const API_KEY = Deno.env.get('XAI_API_KEY');
const XAI_BASE_URL = "https://api.x.ai/v1";
const MODEL_NAME = "grok-2-latest"; // Use the correct X.ai model name

// Generate a prediction using the X.ai API
export async function generatePrediction(ticker: string, timeframe: string, predictionType: string, currentPrice?: number) {
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
  console.log(`Calling X.ai API for prediction using model ${MODEL_NAME}`);
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
  
  const response = await fetchWithRetry(`${XAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(apiPayload),
  });

  const data = await response.json();
  console.log(`Successfully received response from X.ai`);
  
  // Extract the content from the response
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    console.error(`No content in X.ai response:`, JSON.stringify(data));
    throw new Error(`No content in X.ai response`);
  }
  
  // Parse the JSON response with enhanced validation
  const predictionData = validatePredictionResult(content, predictionType);
  console.log("Successfully processed prediction:", JSON.stringify(predictionData));
  
  return predictionData;
}
