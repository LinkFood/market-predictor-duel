import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Create Supabase client using the config file
export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// Log for debugging
console.log('Supabase client initialized with URL:', config.supabase.url);

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