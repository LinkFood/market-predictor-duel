import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FEATURES } from './config';

// Define user type
interface User {
  id: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  user_metadata?: Record<string, any>;
  created_at?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: any }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  devLogin: () => Promise<{ success: boolean; error?: string }>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create dev user for testing
const DEV_USER: User = {
  id: 'user-123',
  email: 'dev@example.com',
  username: 'DevUser',
  avatarUrl: null,
  user_metadata: { username: 'DevUser' },
  created_at: new Date().toISOString()
};

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
        
        if (data?.session) {
          // Get user details
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('Error getting user:', userError);
            setError(userError.message);
            setIsLoading(false);
            setIsInitialized(true);
            return;
          }
          
          if (userData?.user) {
            // Get profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', userData.user.id)
              .single();
            
            setUser({
              id: userData.user.id,
              email: userData.user.email,
              username: profileData?.username || userData.user.email?.split('@')[0],
              avatarUrl: profileData?.avatar_url,
              user_metadata: userData.user.user_metadata,
              created_at: userData.user.created_at
            });
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // Get profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', userData.user.id)
            .single();
          
          setUser({
            id: userData.user.id,
            email: userData.user.email,
            username: profileData?.username || userData.user.email?.split('@')[0],
            avatarUrl: profileData?.avatar_url,
            user_metadata: userData.user.user_metadata,
            created_at: userData.user.created_at
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function - old name, kept for backward compatibility
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to log in' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function - new name, same functionality
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  // Register function - old name, kept for backward compatibility
  const register = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to register' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function - new name, same functionality
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function - alias for logout
  const signOut = async () => {
    return logout();
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to send password reset email' };
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return { success: false, error: 'Not logged in' };
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          avatar_url: updates.avatarUrl
        })
        .eq('id', user.id);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Update local user state
      setUser({
        ...user,
        ...updates
      });
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update profile' };
    } finally {
      setIsLoading(false);
    }
  };

  // Dev login function for development environment
  const devLogin = async () => {
    if (!FEATURES.allowDevLogin) {
      return { success: false, error: 'Developer login is disabled' };
    }
    
    try {
      setIsLoading(true);
      // Set mock user for development
      setUser(DEV_USER);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to perform developer login' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isInitialized,
    isLoading,
    error,
    signIn,
    signUp,
    login,
    register,
    logout,
    signOut,
    resetPassword,
    updateProfile,
    devLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
