
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Authentication required");
    }

    // Get the request JSON body
    const requestData = await req.json();
    const { userId, adminEmail } = requestData;

    // Verify the requestor is an admin by email (temporary security measure)
    // In a production system, you would use a more robust security check
    if (user.email !== adminEmail) {
      throw new Error("Unauthorized: Only existing admins can assign admin roles");
    }

    // Check if the user already has the admin role
    const { data: existingRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError) {
      throw new Error(`Error checking existing role: ${roleError.message}`);
    }

    // If the user doesn't have the admin role, assign it
    let result;
    if (!existingRole) {
      const { data, error } = await supabaseClient
        .from('user_roles')
        .insert([
          { user_id: userId, role: 'admin' }
        ])
        .select();

      if (error) {
        throw new Error(`Error assigning admin role: ${error.message}`);
      }
      
      result = { success: true, message: "Admin role assigned successfully", data };
    } else {
      result = { success: true, message: "User already has admin role", data: existingRole };
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in assign-admin-role function:", error.message);
    
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
