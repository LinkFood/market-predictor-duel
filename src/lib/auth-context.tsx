
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { signUpWithEmail } from './auth-service';

// Extend User type with our custom properties
type ExtendedUser = User & {
  username?: string;
  avatarUrl?: string;
};

type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        
        if (newSession?.user) {
          // Extract username and avatarUrl from user metadata if available
          const username = newSession.user.user_metadata?.username as string | undefined;
          const avatarUrl = newSession.user.user_metadata?.avatar_url as string | undefined;
          
          // Create extended user with custom properties
          const extendedUser: ExtendedUser = {
            ...newSession.user,
            username,
            avatarUrl
          };
          
          setUser(extendedUser);
        } else {
          setUser(null);
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: 'Signed out',
            description: 'You have been signed out.',
          });
        } else if (event === 'SIGNED_IN') {
          toast({
            title: 'Signed in',
            description: 'Welcome back!',
          });
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Extract username and avatarUrl from user metadata if available
          const username = currentSession.user.user_metadata?.username as string | undefined;
          const avatarUrl = currentSession.user.user_metadata?.avatar_url as string | undefined;
          
          // Create extended user with custom properties
          const extendedUser: ExtendedUser = {
            ...currentSession.user,
            username,
            avatarUrl
          };
          
          setUser(extendedUser);
          console.log('User already logged in:', currentSession.user.email);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await signUpWithEmail(email, password, username);
      return { error: response.error || null };
    } catch (error) {
      console.error('Error during signup:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'There was a problem signing out.',
        variant: 'destructive',
      });
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();
      setSession(refreshedSession);
      
      if (refreshedSession?.user) {
        // Extract username and avatarUrl from user metadata if available
        const username = refreshedSession.user.user_metadata?.username as string | undefined;
        const avatarUrl = refreshedSession.user.user_metadata?.avatar_url as string | undefined;
        
        // Create extended user with custom properties
        const extendedUser: ExtendedUser = {
          ...refreshedSession.user,
          username,
          avatarUrl
        };
        
        setUser(extendedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isInitialized,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
