
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

// Types for authentication
export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User | null;
}

// Basic user profile type
export interface UserProfile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  subscription_tier?: string;
}

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Unexpected error during sign in:', error);
    return { success: false, error: 'An unexpected error occurred during sign in' };
  }
};

/**
 * Sign up a new user with email, password and username
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  username: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error.message);
      return { success: false, error: error.message };
    }

    // Determine if email confirmation is required
    const needsEmailConfirmation = !data.session;
    
    if (needsEmailConfirmation) {
      return { 
        success: true, 
        user: data.user,
        error: 'Please check your email for a confirmation link'
      };
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Unexpected error during sign up:', error);
    return { success: false, error: 'An unexpected error occurred during sign up' };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error during sign out:', error);
    return { success: false, error: 'An unexpected error occurred during sign out' };
  }
};

/**
 * Get the current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session error:', error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true, session: data.session, user: data.session?.user };
  } catch (error: any) {
    console.error('Unexpected error getting session:', error);
    return { success: false, error: 'An unexpected error occurred getting user session' };
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = async (userId: string): Promise<{ profile?: UserProfile; error?: string }> => {
  try {
    // Get profile data from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { error: profileError.message };
    }
    
    // Get subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('plan, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (subscriptionError) {
      console.warn('Error fetching subscription:', subscriptionError);
      // Continue without subscription data
    }
    
    // Combine profile and subscription data
    const profile: UserProfile = {
      id: profileData.id,
      username: profileData.username,
      email: profileData.email,
      avatar_url: profileData.avatar_url,
      created_at: profileData.created_at,
      subscription_tier: subscriptionData?.plan || 'free'
    };
    
    return { profile };
  } catch (error: any) {
    console.error('Unexpected error fetching profile:', error);
    return { error: 'An unexpected error occurred fetching user profile' };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Update user metadata for items stored in auth.users
    if (updates.username) {
      const { error: authError } = await supabase.auth.updateUser({
        data: { username: updates.username }
      });
      
      if (authError) {
        console.error('Update auth metadata error:', authError.message);
        return { success: false, error: authError.message };
      }
    }
    
    // Update profile data in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: updates.username,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (profileError) {
      console.error('Update profile error:', profileError.message);
      return { success: false, error: profileError.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error updating profile:', error);
    return { success: false, error: 'An unexpected error occurred updating user profile' };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Reset password error:', error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error during password reset:', error);
    return { success: false, error: 'An unexpected error occurred during password reset' };
  }
};
