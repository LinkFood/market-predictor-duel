
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
    console.log("Testing X.ai API connection");
    
    // Verify API key is configured
    if (!XAI_API_KEY) {
      console.error("X.ai API key is not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "X.ai API key is not configured in environment variables" 
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
    
    // Test models endpoint
    console.log("Testing models endpoint");
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
    console.log("Testing chat completions endpoint");
    const chatResponse = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "x1",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello!" }
        ],
        max_tokens: 50
      }),
    });
    
    const chatStatus = chatResponse.status;
    const chatData = await chatResponse.text();
    
    console.log(`Chat API response status: ${chatStatus}`);
    console.log(`Chat API response: ${chatData}`);
    
    // Build comprehensive test results
    const testResults = {
      success: chatStatus === 200,
      apiKey: {
        provided: !!XAI_API_KEY,
        truncated: XAI_API_KEY ? `${XAI_API_KEY.substring(0, 5)}...` : null
      },
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
    console.error("Error testing X.ai API:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred testing the X.ai API",
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
