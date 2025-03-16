import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { DEV_USER, DEV_SESSION } from './dev-mode';

// Enable dev mode to skip real authentication
const USE_DEV_MODE = true;

// Define the context type
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In dev mode, start with a user already logged in
  const [user, setUser] = useState<User | null>(USE_DEV_MODE ? DEV_USER : null);
  const [session, setSession] = useState<Session | null>(USE_DEV_MODE ? DEV_SESSION : null);
  const [isLoading, setIsLoading] = useState(!USE_DEV_MODE);

  useEffect(() => {
    // If dev mode is enabled, skip actual authentication
    if (USE_DEV_MODE) {
      console.log('🧪 Development mode: Using mock authentication');
      return;
    }
    
    // Check for active session on mount
    const getInitialSession = async () => {
      setIsLoading(true);
      
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        console.error('Supabase is not configured properly');
        setIsLoading(false);
        return;
      }
      
      try {
        // Get session from supabase
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    // In dev mode, auto sign in - no need to check credentials
    if (USE_DEV_MODE) {
      console.log('🧪 Development mode: Auto signing in');
      setUser(DEV_USER);
      setSession(DEV_SESSION);
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    // In dev mode, auto sign up
    if (USE_DEV_MODE) {
      console.log('🧪 Development mode: Auto signing up');
      setUser(DEV_USER);
      setSession(DEV_SESSION);
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    if (USE_DEV_MODE) {
      // In dev mode, we can still clear the user state but it will be reset on reload
      console.log('🧪 Development mode: Signing out (temporarily)');
      setUser(null);
      setSession(null);
      return;
    }
    
    await supabase.auth.signOut();
  };

  // Create the value object
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  // Return the provider with the value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
