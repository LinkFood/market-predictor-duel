
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const API_KEY = Deno.env.get('XAI_API_KEY');
const XAI_BASE_URL = "https://api.x.ai/v1";
const API_PROVIDER = "xai";
const MODEL_NAME = "grok-2-latest";

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
    console.log("Running API connectivity test for", API_PROVIDER);
    
    if (!API_KEY) {
      console.error("Missing API key");
      return new Response(
        JSON.stringify({
          success: false,
          message: "API key not configured", 
          details: {
            provider: API_PROVIDER,
            error: "API_KEY environment variable is not set",
            timestamp: new Date().toISOString()
          }
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    console.log(`Testing ${API_PROVIDER} connectivity with model ${MODEL_NAME}`);
    
    // Testing API connectivity
    const testResponse = await fetch(`${XAI_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error(`API test failed (${testResponse.status}): ${errorText}`);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: `API responded with status ${testResponse.status}`, 
          details: {
            provider: API_PROVIDER,
            status: testResponse.status,
            error: errorText,
            timestamp: new Date().toISOString()
          }
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    const modelsData = await testResponse.json();
    
    // Check if the model we want to use is available
    const availableModels = modelsData.data || [];
    const ourModelAvailable = availableModels.some(m => m.id === MODEL_NAME);
    
    // Test a simple call to ensure the API is fully functional
    const simpleTestResponse = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, this is a test message." }
        ],
        max_tokens: 50,
        temperature: 0.5
      }),
    });
    
    let completionSuccess = false;
    let completionResponse = null;
    
    if (simpleTestResponse.ok) {
      completionResponse = await simpleTestResponse.json();
      completionSuccess = completionResponse && 
                         completionResponse.choices && 
                         completionResponse.choices.length > 0;
    }
    
    // Return the successful result
    return new Response(
      JSON.stringify({
        success: true,
        message: "API connection successful",
        details: {
          provider: API_PROVIDER,
          model: MODEL_NAME,
          modelAvailable: ourModelAvailable,
          completionSuccess: completionSuccess,
          availableModels: availableModels.map(m => m.id),
          timestamp: new Date().toISOString(),
          responseTime: `${simpleTestResponse.headers.get('x-response-time') || 'unknown'}ms`
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
    console.error("Error in test-api-connection function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`,
        details: {
          provider: API_PROVIDER,
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
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
