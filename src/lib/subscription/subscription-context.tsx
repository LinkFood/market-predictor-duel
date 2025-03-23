
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

// Subscription plans
export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro'
}

// Feature limits by plan
interface FeatureLimits {
  predictions: {
    daily: number;
    monthly: number;
  };
  apiCalls: {
    daily: number;
    monthly: number;
  };
  historicalData: {
    days: number;
  };
}

// Feature availability by plan
interface FeatureAvailability {
  aiAnalysisAccess: boolean;
  advancedCharts: boolean;
  exportData: boolean;
  customAlerts: boolean;
  prioritySupport: boolean;
  beta: boolean;
}

// Available features and their accessibility per plan
const PLAN_FEATURES: Record<SubscriptionPlan, FeatureAvailability> = {
  [SubscriptionPlan.FREE]: {
    aiAnalysisAccess: false,
    advancedCharts: false,
    exportData: false,
    customAlerts: false,
    prioritySupport: false,
    beta: false
  },
  [SubscriptionPlan.BASIC]: {
    aiAnalysisAccess: true,
    advancedCharts: true,
    exportData: true,
    customAlerts: false,
    prioritySupport: false,
    beta: false
  },
  [SubscriptionPlan.PRO]: {
    aiAnalysisAccess: true,
    advancedCharts: true,
    exportData: true,
    customAlerts: true,
    prioritySupport: true,
    beta: true
  }
};

// Limits per plan
const PLAN_LIMITS: Record<SubscriptionPlan, FeatureLimits> = {
  [SubscriptionPlan.FREE]: {
    predictions: {
      daily: 5,
      monthly: 100
    },
    apiCalls: {
      daily: 50,
      monthly: 1000
    },
    historicalData: {
      days: 30
    }
  },
  [SubscriptionPlan.BASIC]: {
    predictions: {
      daily: 20,
      monthly: 500
    },
    apiCalls: {
      daily: 500,
      monthly: 10000
    },
    historicalData: {
      days: 180
    }
  },
  [SubscriptionPlan.PRO]: {
    predictions: {
      daily: 100,
      monthly: 2000
    },
    apiCalls: {
      daily: 2000,
      monthly: 50000
    },
    historicalData: {
      days: 365
    }
  }
};

// Usage data type
interface UsageData {
  predictions?: {
    used: number;
    limit: number;
  };
  apiCalls?: {
    used: number;
    limit: number;
  };
}

// Context type
export interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  isLoading: boolean;
  error: string | null;
  expiresAt: string | null;
  isPremium: boolean;
  isProPlan: boolean;
  usageData: UsageData | null;
  refreshUsage: () => Promise<void>;
  hasFeatureAccess: (feature: keyof FeatureAvailability) => boolean;
  getFeatureValue: <T extends keyof FeatureLimits>(feature: T, subFeature?: keyof FeatureLimits[T]) => any;
  showLimitWarning: (limitType: string) => void;
  // Added for backward compatibility with PlanBadge
  plan: SubscriptionPlan;
  // Added for backward compatibility with PremiumFeature
  hasPremium: boolean;
  hasAccess: (feature: keyof FeatureAvailability) => boolean;
  isFeatureAvailable: (feature: keyof FeatureAvailability) => boolean;
  // Added for backward compatibility with usage hooks
  canMakePrediction: boolean;
  usage: UsageData | null;
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  currentPlan: SubscriptionPlan.FREE,
  isLoading: true,
  error: null,
  expiresAt: null,
  isPremium: false,
  isProPlan: false,
  usageData: null,
  refreshUsage: async () => {},
  hasFeatureAccess: () => false,
  getFeatureValue: () => null,
  showLimitWarning: () => {},
  // For backward compatibility
  plan: SubscriptionPlan.FREE,
  hasPremium: false,
  hasAccess: () => false,
  isFeatureAvailable: () => false,
  canMakePrediction: false,
  usage: null
});

export const SubscriptionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  
  // Calculated properties
  const isPremium = currentPlan !== SubscriptionPlan.FREE;
  const isProPlan = currentPlan === SubscriptionPlan.PRO;
  
  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setCurrentPlan(SubscriptionPlan.FREE);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch subscription from Supabase
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching subscription:', error);
          setError('Failed to fetch subscription data');
          setCurrentPlan(SubscriptionPlan.FREE);
        } else if (data) {
          setCurrentPlan(data.plan as SubscriptionPlan);
          setExpiresAt(data.expires_at);
        } else {
          setCurrentPlan(SubscriptionPlan.FREE);
        }
        
        // Generate mock usage data for now
        setUsageData({
          predictions: {
            used: 2,
            limit: PLAN_LIMITS[data?.plan as SubscriptionPlan || SubscriptionPlan.FREE].predictions.daily
          },
          apiCalls: {
            used: 15,
            limit: PLAN_LIMITS[data?.plan as SubscriptionPlan || SubscriptionPlan.FREE].apiCalls.daily
          }
        });
      } catch (err) {
        console.error('Unexpected error fetching subscription:', err);
        setError('An unexpected error occurred');
        setCurrentPlan(SubscriptionPlan.FREE);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);
  
  // Check if a feature is available for the current plan
  const hasFeatureAccess = (feature: keyof FeatureAvailability): boolean => {
    if (isLoading || !PLAN_FEATURES[currentPlan]) return false;
    return PLAN_FEATURES[currentPlan][feature];
  };
  
  // Get a specific feature value/limit
  const getFeatureValue = <T extends keyof FeatureLimits>(
    feature: T, 
    subFeature?: keyof FeatureLimits[T]
  ): any => {
    if (isLoading || !PLAN_LIMITS[currentPlan]) return null;
    
    const featureObj = PLAN_LIMITS[currentPlan][feature];
    if (subFeature && typeof featureObj === 'object') {
      return featureObj[subFeature as keyof typeof featureObj];
    }
    return featureObj;
  };
  
  // Show a limit warning
  const showLimitWarning = (limitType: string) => {
    console.log(`Warning: ${limitType} limit reached for ${currentPlan} plan`);
    // This would show a toast or modal in a real implementation
  };
  
  // Refresh usage data
  const refreshUsage = async (): Promise<void> => {
    if (!user) return;
    
    try {
      // In a real implementation, this would hit an API endpoint
      // For now, we'll just update the mock data slightly
      setUsageData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          predictions: {
            used: Math.min((prev.predictions?.used || 0) + 1, 
                          PLAN_LIMITS[currentPlan].predictions.daily),
            limit: PLAN_LIMITS[currentPlan].predictions.daily
          }
        };
      });
    } catch (err) {
      console.error('Error refreshing usage data:', err);
    }
  };
  
  // Check if can make prediction based on usage
  const canMakePrediction = usageData ? 
    usageData.predictions !== undefined && 
    usageData.predictions.used < usageData.predictions.limit : true;
  
  // Value object for the context
  const value: SubscriptionContextType = {
    currentPlan,
    isLoading,
    error,
    expiresAt,
    isPremium,
    isProPlan,
    usageData,
    refreshUsage,
    hasFeatureAccess,
    getFeatureValue,
    showLimitWarning,
    // For backward compatibility
    plan: currentPlan,
    hasPremium: isPremium,
    hasAccess: hasFeatureAccess,
    isFeatureAvailable: hasFeatureAccess,
    canMakePrediction,
    usage: usageData
  };
  
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
