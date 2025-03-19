
import { useState, useEffect } from "react";
import { isSupabaseConfigured, getSupabaseConfigError, supabase } from "@/lib/supabase";

export const useSupabaseCheck = () => {
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  
  useEffect(() => {
    const configError = getSupabaseConfigError();
    setSupabaseError(configError);
    
    // Test Supabase connection
    if (!configError) {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('Supabase connection test error:', error.message);
          setSupabaseError(`Connection test failed: ${error.message}`);
        } else {
          console.log('Supabase connection successful');
        }
      });
    }
  }, []);

  return { supabaseError };
};
