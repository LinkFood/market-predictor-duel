import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Define the window interface with Supabase config
declare global {
  interface Window {
    SUPABASE_CONFIG?: {
      url: string;
      key: string;
    };
  }
}

// Get URL from various sources (window config object, env vars, or config file)
const supabaseUrl = 
  (typeof window !== 'undefined' && window.SUPABASE_CONFIG?.url) ||
  import.meta.env.VITE_SUPABASE_URL || 
  config.supabase.url;

// Get key from various sources (window config object, env vars, or config file)
const supabaseAnonKey = 
  (typeof window !== 'undefined' && window.SUPABASE_CONFIG?.key) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  config.supabase.anonKey;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log for debugging
console.log('Supabase client initialized with URL:', supabaseUrl);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

export default supabase;