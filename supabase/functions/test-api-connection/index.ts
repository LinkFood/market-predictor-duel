
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const XAI_API_KEY = Deno.env.get('XAI_API_KEY');
const XAI_BASE_URL = "https://api.x.ai/v1";
const API_PROVIDER = "xai"; // Set to "xai" to use X.ai

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
    console.log("Testing API connection");
    
    // Verify API key is configured
    if (!XAI_API_KEY) {
      console.error("API key is not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "API key is not configured in environment variables" 
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

    // X.ai specific model name
    const modelName = "grok-2-latest";
    
    // Test models endpoint
    console.log(`Testing models endpoint for ${API_PROVIDER}`);
    let modelsResponse;
    try {
      modelsResponse = await fetch(`${XAI_BASE_URL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      
      const modelsData = await modelsResponse.json();
      console.log("Models response:", JSON.stringify({
        status: modelsResponse.status,
        data: modelsData
      }));
    } catch (modelsError) {
      console.error("Error testing models endpoint:", modelsError);
    }
    
    // Test chat completions endpoint with a simple prompt
    console.log(`Testing chat completions endpoint for ${API_PROVIDER}`);
    const chatResponse = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy." },
          { role: "user", content: "Say hello!" }
        ],
        temperature: 0
      }),
    });
    
    const chatStatus = chatResponse.status;
    const chatData = await chatResponse.text();
    
    console.log(`Chat API response status: ${chatStatus}`);
    console.log(`Chat API response: ${chatData}`);
    
    // Handle specific error cases
    if (chatStatus === 401) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Authentication failed. Please check your API key.",
          details: {
            error: "Unauthorized - The API key provided is invalid",
            status: chatStatus
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
    
    if (chatStatus === 404 && chatData.includes("model")) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `The model "${modelName}" was not found. Your account may not have access to this model.`,
          details: {
            error: "Model not found or not accessible",
            model: modelName,
            provider: API_PROVIDER,
            status: chatStatus
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
    
    // Build comprehensive test results
    const testResults = {
      success: chatStatus === 200,
      message: chatStatus === 200 
        ? "API connection successful"
        : `Connection test failed with status ${chatStatus}`,
      apiKey: {
        provided: !!XAI_API_KEY,
        truncated: XAI_API_KEY ? `${XAI_API_KEY.substring(0, 5)}...` : null
      },
      provider: API_PROVIDER,
      model: modelName,
      endpoints: {
        models: {
          status: modelsResponse?.status,
          success: modelsResponse?.ok
        },
        chat: {
          status: chatStatus,
          success: chatStatus === 200,
          data: chatStatus === 200 ? JSON.parse(chatData) : { error: chatData }
        }
      },
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(testResults),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error testing API:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred testing the API",
        timestamp: new Date().toISOString()
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
