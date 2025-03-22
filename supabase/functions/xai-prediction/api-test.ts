
// API connectivity test functionality

import { corsHeaders } from "./utils.ts";

const API_KEY = Deno.env.get('XAI_API_KEY');
const XAI_BASE_URL = "https://api.x.ai/v1";

// Run API connectivity test
export async function testApiConnection() {
  if (!API_KEY) {
    console.error("Missing API key");
    return { success: false, error: "API key not configured" };
  }
  
  try {
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
