
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

    console.log("Processing admin role assignment:", { userId, adminEmail, requestingUser: user.id });

    // Special case for first admin assignment or self-assignment
    const isFirstAdminAssignment = await isFirstAdmin(supabaseClient);
    const isSelfAssignment = userId === user.id;
    
    console.log("Context:", { isFirstAdminAssignment, isSelfAssignment });
    
    // For standard cases, check if the requesting user is an admin
    if (!isFirstAdminAssignment && !isSelfAssignment) {
      // Check if the requesting user has admin role
      const { data: isAdmin, error: adminCheckError } = await supabaseClient.rpc(
        'user_has_role',
        { 
          check_user_id: user.id,
          check_role: 'admin'
        }
      );
      
      if (adminCheckError) {
        throw new Error(`Error checking admin status: ${adminCheckError.message}`);
      }
      
      if (!isAdmin) {
        throw new Error("Unauthorized: Only existing admins can assign admin roles");
      }
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
      console.log("Assigning new admin role to user:", userId);
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
      console.log("User already has admin role:", userId);
      result = { success: true, message: "User already has admin role", data: existingRole };
    }

    console.log("Operation result:", result);

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

// Helper function to check if this is the first admin being assigned
async function isFirstAdmin(supabase) {
  try {
    const { count, error } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error checking for existing admins:", error);
      return false;
    }
    
    console.log("Current admin count:", count);
    return count === 0;
  } catch (error) {
    console.error("Error in isFirstAdmin check:", error);
    return false;
  }
}
