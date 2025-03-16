
import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Get Supabase config from window or fallback to config file
const supabaseUrl = (window as any).SUPABASE_CONFIG?.url || config.supabase.url;
const supabaseAnonKey = (window as any).SUPABASE_CONFIG?.key || config.supabase.anonKey;

// Validation checks
if (!supabaseUrl || supabaseUrl === 'https://example.supabase.co') {
  console.error('Invalid Supabase URL:', supabaseUrl);
  if (typeof (window as any).showError === 'function') {
    (window as any).showError('Supabase Configuration Error', 'Invalid Supabase URL. Please check your configuration.');
  }
}

if (!supabaseAnonKey || supabaseAnonKey.length < 20) {
  console.error('Invalid Supabase anon key:', supabaseAnonKey);
  if (typeof (window as any).showError === 'function') {
    (window as any).showError('Supabase Configuration Error', 'Invalid Supabase anonymous key. Please check your configuration.');
  }
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log for debugging
console.log('Supabase client initialized with URL:', supabaseUrl);

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error.message);
    if (typeof (window as any).showError === 'function') {
      (window as any).showError('Supabase Connection Error', `Failed to connect to Supabase: ${error.message}`);
    }
  } else {
    console.log('Supabase connection test successful:', data);
  }
});

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
