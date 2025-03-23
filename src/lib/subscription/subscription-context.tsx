
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

// Define subscription plans enum (same as in plan-features.ts)
export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro'
}

// Interface for subscription data
interface UserSubscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd: string;
  createdAt: string;
}

// Feature limits for each plan
interface FeatureLimits {
  predictionsPerDay: number;
  historyRetention: number;
  customStocks: boolean;
  detailedAnalysis: boolean;
  prioritySupport: boolean;
  maxPredictionTimeframe: '1d' | '1w' | '1m';
}

// Plan limits by subscription type
const PLAN_LIMITS: Record<SubscriptionPlan, FeatureLimits> = {
  [SubscriptionPlan.FREE]: {
    predictionsPerDay: 3,
    historyRetention: 7,
    customStocks: false,
    detailedAnalysis: false,
    prioritySupport: false,
    maxPredictionTimeframe: '1d'
  },
  [SubscriptionPlan.BASIC]: {
    predictionsPerDay: 10,
    historyRetention: 30,
    customStocks: true,
    detailedAnalysis: false,
    prioritySupport: false,
    maxPredictionTimeframe: '1w'
  },
  [SubscriptionPlan.PRO]: {
    predictionsPerDay: 50,
    historyRetention: 90,
    customStocks: true,
    detailedAnalysis: true,
    prioritySupport: true,
    maxPredictionTimeframe: '1m'
  }
};

// Add the missing getFeatureValue function
export function getFeatureValue(plan: SubscriptionPlan, feature: keyof FeatureLimits): any {
  return PLAN_LIMITS[plan][feature];
}

// Add the missing getPlanComparisonData function
export function getPlanComparisonData() {
  return [
    {
      feature: 'Predictions per day',
      free: PLAN_LIMITS.free.predictionsPerDay,
      basic: PLAN_LIMITS.basic.predictionsPerDay,
      pro: PLAN_LIMITS.pro.predictionsPerDay
    },
    {
      feature: 'History retention (days)',
      free: PLAN_LIMITS.free.historyRetention,
      basic: PLAN_LIMITS.basic.historyRetention,
      pro: PLAN_LIMITS.pro.historyRetention
    },
    {
      feature: 'Custom stock selection',
      free: PLAN_LIMITS.free.customStocks,
      basic: PLAN_LIMITS.basic.customStocks,
      pro: PLAN_LIMITS.pro.customStocks
    },
    {
      feature: 'Detailed analysis',
      free: PLAN_LIMITS.free.detailedAnalysis,
      basic: PLAN_LIMITS.basic.detailedAnalysis,
      pro: PLAN_LIMITS.pro.detailedAnalysis
    },
    {
      feature: 'Priority support',
      free: PLAN_LIMITS.free.prioritySupport,
      basic: PLAN_LIMITS.basic.prioritySupport,
      pro: PLAN_LIMITS.pro.prioritySupport
    }
  ];
}

// Context type definition
interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  isLoading: boolean;
  subscription: UserSubscription | null;
  isPremium: boolean;
  getFeatureLimit: <K extends keyof FeatureLimits>(feature: K) => FeatureLimits[K];
  upgradePlan: (newPlan: SubscriptionPlan) => Promise<void>;
}

// Create the context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch subscription data on user change
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setCurrentPlan(SubscriptionPlan.FREE);
        setSubscription(null);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch from subscriptions table
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error code
            console.error('Error fetching subscription:', error);
          }
          setCurrentPlan(SubscriptionPlan.FREE);
          setSubscription(null);
        } else if (data) {
          setCurrentPlan(data.plan as SubscriptionPlan);
          setSubscription({
            id: data.id,
            userId: data.user_id,
            plan: data.plan,
            status: data.status,
            currentPeriodEnd: data.current_period_end,
            createdAt: data.created_at
          });
        } else {
          setCurrentPlan(SubscriptionPlan.FREE);
          setSubscription(null);
        }
      } catch (error) {
        console.error('Error in fetchSubscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);

  // Check if the user has a premium plan
  const isPremium = currentPlan !== SubscriptionPlan.FREE;

  // Get feature limit based on current plan
  const getFeatureLimit = <K extends keyof FeatureLimits>(feature: K): FeatureLimits[K] => {
    return PLAN_LIMITS[currentPlan][feature];
  };

  // Upgrade plan (mock implementation)
  const upgradePlan = async (newPlan: SubscriptionPlan): Promise<void> => {
    try {
      // In a real app, this would integrate with a payment provider
      // and then update the subscription in the database
      
      // Mock implementation for development
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to upgrade your plan.',
          variant: 'destructive'
        });
        return;
      }
      
      setIsLoading(true);
      
      // This is just for demo/development - in a real app you would:
      // 1. Process payment with Stripe/other payment provider
      // 2. Create subscription record after payment is confirmed
      
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: newPlan,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        
      if (error) {
        console.error('Error upgrading plan:', error);
        toast({
          title: 'Upgrade Failed',
          description: 'There was an error upgrading your plan. Please try again.',
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      setCurrentPlan(newPlan);
      
      toast({
        title: 'Plan Upgraded',
        description: `You have successfully upgraded to the ${newPlan} plan.`,
      });
    } catch (error) {
      console.error('Error in upgradePlan:', error);
      toast({
        title: 'Upgrade Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    currentPlan,
    isLoading,
    subscription,
    isPremium,
    getFeatureLimit,
    upgradePlan
  };
  
  return (
    <SubscriptionContext.Provider value={value}>
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
