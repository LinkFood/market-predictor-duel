/**
 * Subscription Context
 * Provides subscription status and feature access throughout the app
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlanFeatures, FREE_PLAN_FEATURES, PREMIUM_PLAN_FEATURES, getFeatureValue, isFeatureEnabled, getFeatureLimit } from './plan-features';
import { trackUsageEvent } from './usage-tracking';

export type SubscriptionPlan = 'free' | 'premium';

export interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  isFeatureAvailable: (feature: keyof PlanFeatures) => boolean;
  getFeatureLimit: (feature: keyof PlanFeatures) => number;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeUrl: string;
}

const defaultContext: SubscriptionContextType = {
  plan: 'free',
  setPlan: () => {},
  isLoading: true,
  error: null,
  refreshSubscription: async () => {},
  isFeatureAvailable: () => false,
  getFeatureLimit: () => 0,
  showUpgradeModal: false,
  setShowUpgradeModal: () => {},
  upgradeUrl: '#',
};

export const SubscriptionContext = createContext<SubscriptionContextType>(defaultContext);

export const useSubscription = () => useContext(SubscriptionContext);

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // This would be your actual subscription service URL
  const upgradeUrl = 'https://example.com/upgrade';

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!user) {
        setPlan('free');
        return;
      }
      
      // In a real app, you would fetch subscription data from your database
      // For demo purposes, we'll use a simulated check
      // Check if user is part of a premium group or has a subscription record
      
      // Example: check a subscriptions table
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (subError) {
        console.error('Error fetching subscription:', subError);
      }
      
      // If found and active, set to premium
      if (subscription && subscription.plan === 'premium') {
        setPlan('premium');
      } else {
        // Otherwise default to free
        setPlan('free');
      }
      
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to fetch subscription status');
      setPlan('free'); // Default to free on error
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchSubscription();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Function to check if a feature is available in the current plan
  const isFeatureAvailable = (feature: keyof PlanFeatures): boolean => {
    // If it's a boolean feature, use isFeatureEnabled
    const value = getFeatureValue(feature, plan);
    if (typeof value === 'boolean') {
      return value;
    }
    // For numeric features, return true if value > 0
    return (value as number) > 0;
  };
  
  // Function to get the limit for a feature in the current plan
  const getFeatureLimitValue = (feature: keyof PlanFeatures): number => {
    return getFeatureLimit(feature, plan);
  };
  
  // Function to refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscription();
    if (plan === 'premium') {
      trackUsageEvent('subscription_changed', { plan: 'premium' });
    }
  };

  const value: SubscriptionContextType = {
    plan,
    setPlan,
    isLoading,
    error,
    refreshSubscription,
    isFeatureAvailable,
    getFeatureLimit: getFeatureLimitValue,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeUrl,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
