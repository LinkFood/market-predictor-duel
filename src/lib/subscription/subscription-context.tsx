/**
 * Subscription Context
 * Provides subscription status and feature access throughout the app
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, PlanFeatures, PLAN_FEATURES } from './plan-features';
import { useAuth } from '@/lib/auth-context';

// Usage tracking interface
interface UsageMetrics {
  predictionsThisMonth: number;
  predictionsLimit: number;
  apiCallsToday: number;
  apiCallsLimit: number;
  lastUpdated: Date;
}

// Subscription context interface
interface SubscriptionContextType {
  plan: SubscriptionPlan;
  features: PlanFeatures;
  isLoading: boolean;
  usage: UsageMetrics;
  hasPremium: boolean;
  canMakePrediction: boolean;
  refreshUsage: () => Promise<void>;
  hasAccess: (feature: keyof PlanFeatures) => boolean;
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Context provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [isLoading, setIsLoading] = useState(true);
  const [usage, setUsage] = useState<UsageMetrics>({
    predictionsThisMonth: 0,
    predictionsLimit: PLAN_FEATURES[SubscriptionPlan.FREE].maxPredictionsPerMonth,
    apiCallsToday: 0,
    apiCallsLimit: PLAN_FEATURES[SubscriptionPlan.FREE].apiCallsPerDay,
    lastUpdated: new Date()
  });

  // Fetch user's subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        setPlan(SubscriptionPlan.FREE);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // In a real implementation, query Supabase for user's subscription
        // For now, use a mock implementation
        
        // TODO: Replace with actual DB query
        // const { data, error } = await supabase
        //   .from('user_subscriptions')
        //   .select('plan, expires_at')
        //   .eq('user_id', user.id)
        //   .single();
        
        // Mock subscription data for development
        const mockSubscription = {
          plan: SubscriptionPlan.FREE,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
        
        // Set the user's plan
        setPlan(mockSubscription.plan);
        
        // Fetch usage metrics
        await refreshUsageMetrics();
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        // Default to free plan if there's an error
        setPlan(SubscriptionPlan.FREE);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptionData();
  }, [user]);
  
  // Fetch user's usage metrics
  const refreshUsageMetrics = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, query for actual usage
      // For now, use mock data
      
      // Get the current month's predictions
      // const { data: predictionData, error: predictionError } = await supabase
      //   .from('predictions')
      //   .select('count')
      //   .eq('user_id', user.id)
      //   .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      
      // Mock usage data
      const predictionsThisMonth = 5; // Mock value
      
      // Get today's API calls
      // const { data: apiCallData, error: apiCallError } = await supabase
      //   .from('api_usage')
      //   .select('count')
      //   .eq('user_id', user.id)
      //   .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
      
      // Mock API call data
      const apiCallsToday = 3; // Mock value
      
      // Update usage state
      setUsage({
        predictionsThisMonth,
        predictionsLimit: PLAN_FEATURES[plan].maxPredictionsPerMonth,
        apiCallsToday,
        apiCallsLimit: PLAN_FEATURES[plan].apiCallsPerDay,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
    }
  };
  
  // Check if user has a premium plan
  const hasPremium = plan !== SubscriptionPlan.FREE;
  
  // Check if user can make more predictions
  const canMakePrediction = usage.predictionsThisMonth < usage.predictionsLimit;
  
  // Feature access check function
  const hasAccess = (feature: keyof PlanFeatures) => {
    return PLAN_FEATURES[plan][feature];
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        features: PLAN_FEATURES[plan],
        isLoading,
        usage,
        hasPremium,
        canMakePrediction,
        refreshUsage: refreshUsageMetrics,
        hasAccess
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

// Custom hook for using the subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}