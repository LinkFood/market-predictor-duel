/**
 * Subscription Context
 * Provides subscription status and feature access throughout the app
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlanFeatures, SubscriptionPlan, getPlanFeatures } from './plan-features';
import { trackUsageEvent } from './usage-tracking';

export type { SubscriptionPlan };

interface UsageStats {
  predictionsThisMonth: number;
  predictionsLimit: number;
  apiCallsToday: number;
  apiCallsLimit: number;
  lastUpdated: Date;
}

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
  usage: UsageStats;
  hasPremium: boolean;
  refreshUsage: () => Promise<void>;
  canMakePrediction: boolean;
  hasAccess: (feature: keyof PlanFeatures) => boolean;
}

const defaultContext: SubscriptionContextType = {
  plan: SubscriptionPlan.FREE,
  setPlan: () => {},
  isLoading: true,
  error: null,
  refreshSubscription: async () => {},
  isFeatureAvailable: () => false,
  getFeatureLimit: () => 0,
  showUpgradeModal: false,
  setShowUpgradeModal: () => {},
  upgradeUrl: '#',
  usage: {
    predictionsThisMonth: 0,
    predictionsLimit: 10,
    apiCallsToday: 0,
    apiCallsLimit: 50,
    lastUpdated: new Date()
  },
  hasPremium: false,
  refreshUsage: async () => {},
  canMakePrediction: true,
  hasAccess: () => false
};

export const SubscriptionContext = createContext<SubscriptionContextType>(defaultContext);

export const useSubscription = () => useContext(SubscriptionContext);

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usage, setUsage] = useState<UsageStats>({
    predictionsThisMonth: 0,
    predictionsLimit: 10,
    apiCallsToday: 0,
    apiCallsLimit: 50,
    lastUpdated: new Date()
  });
  
  // This would be your actual subscription service URL
  const upgradeUrl = 'https://example.com/upgrade';
  
  // Helper to determine if a user has premium
  const hasPremium = plan !== SubscriptionPlan.FREE;

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
        setPlan(SubscriptionPlan.FREE);
        return;
      }
      
      // In a real app, you would fetch subscription data from your database
      // For demo purposes, we'll use a simulated check
      // Check if user is part of a premium group or has a subscription record
      
      // Example: check a subscriptions table
      // @ts-ignore - We know subscriptions table exists but it's not in types
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
        setPlan(SubscriptionPlan.BASIC); // Basic is our "premium" for now
      } else {
        // Otherwise default to free
        setPlan(SubscriptionPlan.FREE);
      }
      
      // Also fetch usage stats
      await refreshUsageStats();
      
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to fetch subscription status');
      setPlan(SubscriptionPlan.FREE); // Default to free on error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to refresh usage stats
  const refreshUsageStats = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // In a real app, you would fetch real usage stats from your database
      // For demo purposes, we'll simulate some usage based on the subscription plan
      const planFeatures = getPlanFeatures(plan);
      
      // Set usage limits based on plan
      setUsage({
        predictionsThisMonth: Math.floor(Math.random() * 5),
        predictionsLimit: planFeatures.maxMonthlyPredictions,
        apiCallsToday: Math.floor(Math.random() * 10),
        apiCallsLimit: planFeatures.maxDailyApiCalls,
        lastUpdated: new Date()
      });
      
    } catch (err) {
      console.error('Error refreshing usage stats:', err);
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
    const planFeatures = getPlanFeatures(plan);
    const value = planFeatures[feature];
    
    // If it's a boolean feature
    if (typeof value === 'boolean') {
      return value;
    }
    // For numeric features, return true if value > 0
    return (value as number) > 0;
  };
  
  // Function to get the limit for a feature in the current plan
  const getFeatureLimitValue = (feature: keyof PlanFeatures): number => {
    const planFeatures = getPlanFeatures(plan);
    const value = planFeatures[feature];
    
    // Return 0 if it's not a numeric feature
    if (typeof value !== 'number') {
      return 0;
    }
    
    return value;
  };
  
  // Function to check if user has access to a feature
  const hasAccess = (feature: keyof PlanFeatures): boolean => {
    return isFeatureAvailable(feature);
  };
  
  // Check if user can make predictions based on limits
  const canMakePrediction = usage.predictionsThisMonth < usage.predictionsLimit;
  
  // Function to refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscription();
    if (plan !== SubscriptionPlan.FREE) {
      trackUsageEvent('subscription_changed', { plan: plan });
    }
  };
  
  // Function to refresh usage data
  const refreshUsage = async () => {
    await refreshUsageStats();
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
    usage,
    hasPremium,
    refreshUsage,
    canMakePrediction,
    hasAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
