import { createClient } from '@supabase/supabase-js';

// Type guard to check if SUPABASE_CONFIG exists and has required properties
export const isSupabaseConfigured = (): boolean => {
  return !!(
    window.SUPABASE_CONFIG?.url &&
    window.SUPABASE_CONFIG?.key &&
    window.SUPABASE_CONFIG.url.length > 10 &&
    window.SUPABASE_CONFIG.key.length > 10
  );
};

// Helper to get any configuration errors
export const getSupabaseConfigError = (): string | null => {
  if (!window.SUPABASE_CONFIG) {
    return 'Supabase configuration is missing';
  }
  if (!window.SUPABASE_CONFIG.url || window.SUPABASE_CONFIG.url.length < 10) {
    return 'Invalid Supabase URL';
  }
  if (!window.SUPABASE_CONFIG.key || window.SUPABASE_CONFIG.key.length < 10) {
    return 'Invalid Supabase anonymous key';
  }
  return null;
};

// Get Supabase config from window or fallback to hardcoded values
const supabaseUrl = window.SUPABASE_CONFIG?.url || "https://xvojivdhshgdbxrwcokx.supabase.co";
const supabaseAnonKey = window.SUPABASE_CONFIG?.key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2ppdmRoc2hnZGJ4cndjb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQxNDUsImV4cCI6MjA1NzY4MDE0NX0.G0HNXKFNUqIba27xsKY9t1KYRDL68ZHbsSgLmPQsXc4";

// Validation checks
if (!supabaseUrl || supabaseUrl === 'https://example.supabase.co') {
  console.error('Invalid Supabase URL:', supabaseUrl);
  if (typeof window.showError === 'function') {
    window.showError('Supabase Configuration Error', 'Invalid Supabase URL. Please check your configuration.');
  }
}

if (!supabaseAnonKey || supabaseAnonKey.length < 20) {
  console.error('Invalid Supabase anon key:', supabaseAnonKey);
  if (typeof window.showError === 'function') {
    window.showError('Supabase Configuration Error', 'Invalid Supabase anonymous key. Please check your configuration.');
  }
}

// Dev mode flag
const USE_DEV_MODE = false;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Log for debugging
console.log('Supabase client initialized with URL:', supabaseUrl);

// Test connection if not in dev mode
if (!USE_DEV_MODE) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      if (typeof window.showError === 'function') {
        window.showError('Supabase Connection Error', `Failed to connect to Supabase: ${error.message}`);
      }
    } else {
      console.log('Supabase connection test successful:', data);
    }
  });
} else {
  console.log('🧪 Development mode: Skipping Supabase connection test');
}

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, username?: string) => {
  const options = username 
    ? { data: { username } }
    : undefined;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options
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
