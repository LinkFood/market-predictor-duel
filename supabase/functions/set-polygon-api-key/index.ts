
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

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
    // Get the authenticated user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error("Unauthorized - You must be logged in to perform this action");
    }

    // Check if user is an admin
    const { data: profiles, error: profileError } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    const isAdmin = profiles?.is_admin === true;

    if (!isAdmin) {
      throw new Error("Unauthorized - Admin privileges required to update API keys");
    }

    // Get the API key from the request body
    const requestData = await req.json();
    const { apiKey } = requestData;

    if (!apiKey) {
      throw new Error("Missing required parameter: apiKey");
    }

    // We'll use Deno KV to store the key securely
    // Note: In a production environment, consider using a more secure storage mechanism
    // Deno KV provides basic storage capability for this example
    const kv = await Deno.openKv();
    await kv.set(["polygon_api_key"], apiKey);
    
    // Test the API key to make sure it works
    const testUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`;
    const testResponse = await fetch(testUrl);
    
    if (!testResponse.ok) {
      const errorData = await testResponse.text();
      throw new Error(`API key validation failed: ${testResponse.status} - ${errorData}`);
    }
    
    // Successfully stored and validated the API key
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Polygon API key successfully saved and validated" 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in set-polygon-api-key function:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred processing your request" 
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
});
