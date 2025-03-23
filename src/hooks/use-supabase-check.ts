
import { useState, useEffect } from "react";
import { isSupabaseConfigured, getSupabaseConfigError, supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export const useSupabaseCheck = () => {
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setIsChecking(true);
        
        // First check if Supabase is configured properly
        const configError = getSupabaseConfigError();
        if (configError) {
          setSupabaseError(configError);
          console.error('Supabase configuration error:', configError);
          toast({
            variant: "destructive",
            title: "Configuration Error",
            description: configError
          });
          return;
        }
        
        // Test Supabase connection
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase connection test error:', error.message);
          setSupabaseError(`Connection test failed: ${error.message}`);
          toast({
            variant: "destructive",
            title: "Supabase Connection Error",
            description: error.message
          });
        } else {
          console.log('Supabase connection successful', data);
          setSupabaseError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error checking Supabase';
        setSupabaseError(message);
        console.error('Error in useSupabaseCheck:', err);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkSupabase();
  }, []);

  return { 
    supabaseError, 
    isChecking,
    isSupabaseConfigured: isSupabaseConfigured() 
  };
};
