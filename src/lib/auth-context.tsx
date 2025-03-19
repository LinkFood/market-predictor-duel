
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { DEV_USER, DEV_SESSION } from './dev-mode';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from '@/hooks/use-toast';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut as authSignOut, 
  getCurrentSession,
  getUserProfile,
  UserProfile
} from './auth-service';

// Enable dev mode to skip real authentication for development
const USE_DEV_MODE = true;

// Define the context type
type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In dev mode, start with a user already logged in
  const [user, setUser] = useState<User | null>(USE_DEV_MODE ? DEV_USER : null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(USE_DEV_MODE ? DEV_SESSION : null);
  const [isLoading, setIsLoading] = useState(!USE_DEV_MODE);
  const [isInitialized, setIsInitialized] = useState(USE_DEV_MODE);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Log initial authentication state for debugging
  useEffect(() => {
    console.log('AuthProvider initialized with:', {
      devMode: USE_DEV_MODE,
      hasUser: !!user,
      hasSession: !!session,
      isInitialized
    });
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    if (USE_DEV_MODE) {
      // Set default profile for dev mode
      setProfile({
        id: DEV_USER.id,
        username: DEV_USER.user_metadata?.username || 'DevUser',
        email: DEV_USER.email
      });
      return;
    }

    try {
      const { profile, error } = await getUserProfile(userId);
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      if (profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };

  // Public method to refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // If dev mode is enabled, skip actual authentication
    if (USE_DEV_MODE) {
      console.log('🧪 Development mode: Using mock authentication');
      setUser(DEV_USER);
      setSession(DEV_SESSION);
      fetchUserProfile(DEV_USER.id);
      setIsInitialized(true);
      setIsLoading(false);
      return;
    }
    
    // Check for active session on mount
    const getInitialSession = async () => {
      setIsLoading(true);
      
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        console.error('Supabase is not configured properly');
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Supabase is not configured correctly. Using development mode.",
        });
        
        // Fall back to dev mode
        setUser(DEV_USER);
        setSession(DEV_SESSION);
        fetchUserProfile(DEV_USER.id);
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }
      
      try {
        const { success, session, user, error } = await getCurrentSession();
        
        if (!success) {
          throw new Error(error);
        }
        
        setSession(session);
        setUser(user ?? null);
        
        if (user) {
          await fetchUserProfile(user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setAuthError(error as Error);
        
        // Fall back to dev mode on error
        setUser(DEV_USER);
        setSession(DEV_SESSION);
        fetchUserProfile(DEV_USER.id);
        
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to get user session. Using development mode."
        });
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    getInitialSession();

    if (!USE_DEV_MODE) {
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state changed:', event);
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        }
      );

      // Cleanup subscription on unmount
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    // In dev mode, auto sign in - no need to check credentials
    if (USE_DEV_MODE) {
      console.log('🧪 Development mode: Auto signing in');
      setUser(DEV_USER);
      setSession(DEV_SESSION);
      fetchUserProfile(DEV_USER.id);
      return { error: null };
    }
    
    try {
      setIsLoading(true);
      const { success, error, user } = await signInWithEmail(email, password);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error || "Authentication failed"
        });
        return { error };
      }
      
      // Profile will be updated through auth state change listener
      return { error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred during login."
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, username: string) => {
    // In dev mode, auto sign up
    if (USE_DEV_MODE) {
      console.log('🧪 Development mode: Auto signing up');
      setUser(DEV_USER);
      setSession(DEV_SESSION);
      fetchUserProfile(DEV_USER.id);
      return { error: null };
    }
    
    try {
      setIsLoading(true);
      const { success, error } = await signUpWithEmail(email, password, username);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error || "Could not create account"
        });
        return { error };
      }
      
      if (error && error.includes('confirmation')) {
        // This is a success with email confirmation required
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account."
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully."
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "An unexpected error occurred during registration."
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    if (USE_DEV_MODE) {
      // In dev mode, we can still clear the user state but it will be reset on reload
      console.log('🧪 Development mode: Signing out (temporarily)');
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out (development mode)."
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { success, error } = await authSignOut();
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Sign Out Error",
          description: error || "Could not sign out"
        });
        return;
      }
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "An error occurred while signing out."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If still initializing auth, show loading screen
  if (!isInitialized && !USE_DEV_MODE) {
    return <LoadingScreen message="Initializing authentication..." />;
  }

  // Create the value object
  const value = {
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    refreshProfile,
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
