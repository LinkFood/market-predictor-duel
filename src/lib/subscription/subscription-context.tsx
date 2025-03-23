
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
export interface FeatureAvailability {
  aiAnalysisAccess: boolean;
  advancedCharts: boolean;
  exportData: boolean;
  customAlerts: boolean;
  prioritySupport: boolean;
  beta: boolean;
  predictions: boolean; // Added for compatibility
}

// Available features and their accessibility per plan
const PLAN_FEATURES: Record<SubscriptionPlan, FeatureAvailability> = {
  [SubscriptionPlan.FREE]: {
    aiAnalysisAccess: false,
    advancedCharts: false,
    exportData: false,
    customAlerts: false,
    prioritySupport: false,
    beta: false,
    predictions: true
  },
  [SubscriptionPlan.BASIC]: {
    aiAnalysisAccess: true,
    advancedCharts: true,
    exportData: true,
    customAlerts: false,
    prioritySupport: false,
    beta: false,
    predictions: true
  },
  [SubscriptionPlan.PRO]: {
    aiAnalysisAccess: true,
    advancedCharts: true,
    exportData: true,
    customAlerts: true,
    prioritySupport: true,
    beta: true,
    predictions: true
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

// For plan comparison table
export interface PlanFeature {
  feature: string;
  free: string | number | boolean;
  basic: string | number | boolean;
  pro: string | number | boolean;
}

// Plan comparison data for display
export function getPlanComparisonData(): PlanFeature[] {
  return [
    {
      feature: "Daily predictions",
      free: PLAN_LIMITS[SubscriptionPlan.FREE].predictions.daily,
      basic: PLAN_LIMITS[SubscriptionPlan.BASIC].predictions.daily,
      pro: PLAN_LIMITS[SubscriptionPlan.PRO].predictions.daily
    },
    {
      feature: "API calls per day",
      free: PLAN_LIMITS[SubscriptionPlan.FREE].apiCalls.daily,
      basic: PLAN_LIMITS[SubscriptionPlan.BASIC].apiCalls.daily,
      pro: PLAN_LIMITS[SubscriptionPlan.PRO].apiCalls.daily
    },
    {
      feature: "Historical data access",
      free: PLAN_LIMITS[SubscriptionPlan.FREE].historicalData.days + " days",
      basic: PLAN_LIMITS[SubscriptionPlan.BASIC].historicalData.days + " days",
      pro: PLAN_LIMITS[SubscriptionPlan.PRO].historicalData.days + " days"
    },
    {
      feature: "AI analysis insights",
      free: PLAN_FEATURES[SubscriptionPlan.FREE].aiAnalysisAccess,
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC].aiAnalysisAccess,
      pro: PLAN_FEATURES[SubscriptionPlan.PRO].aiAnalysisAccess
    },
    {
      feature: "Advanced charting",
      free: PLAN_FEATURES[SubscriptionPlan.FREE].advancedCharts,
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC].advancedCharts,
      pro: PLAN_FEATURES[SubscriptionPlan.PRO].advancedCharts
    },
    {
      feature: "Data export",
      free: PLAN_FEATURES[SubscriptionPlan.FREE].exportData,
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC].exportData,
      pro: PLAN_FEATURES[SubscriptionPlan.PRO].exportData
    },
    {
      feature: "Custom alerts",
      free: PLAN_FEATURES[SubscriptionPlan.FREE].customAlerts,
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC].customAlerts,
      pro: PLAN_FEATURES[SubscriptionPlan.PRO].customAlerts
    },
    {
      feature: "Priority support",
      free: PLAN_FEATURES[SubscriptionPlan.FREE].prioritySupport,
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC].prioritySupport,
      pro: PLAN_FEATURES[SubscriptionPlan.PRO].prioritySupport
    },
    {
      feature: "Beta features access",
      free: PLAN_FEATURES[SubscriptionPlan.FREE].beta,
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC].beta,
      pro: PLAN_FEATURES[SubscriptionPlan.PRO].beta
    }
  ];
}

// Usage data type
export interface UsageData {
  predictions?: {
    used: number;
    limit: number;
  };
  apiCalls?: {
    used: number;
    limit: number;
  };
  predictionsThisMonth: number;
  predictionsLimit: number;
  apiCallsToday: number;
  apiCallsLimit: number;
  lastUpdated: Date;
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
        const planLimits = PLAN_LIMITS[data?.plan as SubscriptionPlan || SubscriptionPlan.FREE];
        const predictionsUsed = 2;
        const apiCallsUsed = 15;
        
        setUsageData({
          predictions: {
            used: predictionsUsed,
            limit: planLimits.predictions.daily
          },
          apiCalls: {
            used: apiCallsUsed,
            limit: planLimits.apiCalls.daily
          },
          predictionsThisMonth: predictionsUsed,
          predictionsLimit: planLimits.predictions.daily,
          apiCallsToday: apiCallsUsed,
          apiCallsLimit: planLimits.apiCalls.daily,
          lastUpdated: new Date()
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
      const planLimits = PLAN_LIMITS[currentPlan];
      const predictionsUsed = Math.min((usageData?.predictions?.used || 0) + 1, 
                                      planLimits.predictions.daily);
      const apiCallsUsed = Math.min((usageData?.apiCalls?.used || 0) + 1,
                                   planLimits.apiCalls.daily);
      
      setUsageData({
        predictions: {
          used: predictionsUsed,
          limit: planLimits.predictions.daily
        },
        apiCalls: {
          used: apiCallsUsed,
          limit: planLimits.apiCalls.daily
        },
        predictionsThisMonth: predictionsUsed,
        predictionsLimit: planLimits.predictions.daily,
        apiCallsToday: apiCallsUsed,
        apiCallsLimit: planLimits.apiCalls.daily,
        lastUpdated: new Date()
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
