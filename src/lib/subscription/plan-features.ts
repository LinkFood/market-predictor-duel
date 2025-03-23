
/**
 * Subscription plan features configuration
 */

// Define subscription plans
export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro'
}

// Define feature types
export interface PlanFeatures {
  // Prediction-related limits
  maxDailyPredictions: number;
  maxMonthlyPredictions: number;
  
  // AI features
  aiAnalysisAccess: boolean;
  aiPatternRecognition: boolean;
  
  // API limits
  maxDailyApiCalls: number;
  
  // Data access
  historicalDataAccess: boolean;
  realTimeData: boolean;
  
  // Additional features
  prioritySupport: boolean;
  customAlerts: boolean;
}

// Define features for each plan
const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  [SubscriptionPlan.FREE]: {
    maxDailyPredictions: 5,
    maxMonthlyPredictions: 100,
    aiAnalysisAccess: false,
    aiPatternRecognition: false,
    maxDailyApiCalls: 50,
    historicalDataAccess: false,
    realTimeData: false,
    prioritySupport: false,
    customAlerts: false
  },
  
  [SubscriptionPlan.BASIC]: {
    maxDailyPredictions: 20,
    maxMonthlyPredictions: 500,
    aiAnalysisAccess: true,
    aiPatternRecognition: false,
    maxDailyApiCalls: 200,
    historicalDataAccess: true,
    realTimeData: false,
    prioritySupport: false,
    customAlerts: true
  },
  
  [SubscriptionPlan.PRO]: {
    maxDailyPredictions: 100,
    maxMonthlyPredictions: 3000,
    aiAnalysisAccess: true,
    aiPatternRecognition: true,
    maxDailyApiCalls: 1000,
    historicalDataAccess: true,
    realTimeData: true,
    prioritySupport: true,
    customAlerts: true
  }
};

// Function to get features for a specific plan
export function getPlanFeatures(plan: SubscriptionPlan): PlanFeatures {
  return PLAN_FEATURES[plan];
}

// Helper function to check if a feature is a boolean type
export function isFeatureBoolean(feature: keyof PlanFeatures): boolean {
  return typeof PLAN_FEATURES[SubscriptionPlan.FREE][feature] === 'boolean';
}

// Helper function to check if a feature is a numeric limit
export function isFeatureNumeric(feature: keyof PlanFeatures): boolean {
  return typeof PLAN_FEATURES[SubscriptionPlan.FREE][feature] === 'number';
}

// Format plan price for display
export function formatPlanPrice(plan: SubscriptionPlan): string {
  switch (plan) {
    case SubscriptionPlan.FREE:
      return 'Free';
    case SubscriptionPlan.BASIC:
      return '$9.99/month';
    case SubscriptionPlan.PRO:
      return '$29.99/month';
    default:
      return 'Unknown';
  }
}

// Get the feature descriptions for UI display
export function getFeatureDescription(feature: keyof PlanFeatures): string {
  const descriptions: Record<keyof PlanFeatures, string> = {
    maxDailyPredictions: 'Daily prediction limit',
    maxMonthlyPredictions: 'Monthly prediction limit',
    aiAnalysisAccess: 'AI analysis & insights',
    aiPatternRecognition: 'AI pattern recognition',
    maxDailyApiCalls: 'Daily API calls',
    historicalDataAccess: 'Historical data access',
    realTimeData: 'Real-time market data',
    prioritySupport: 'Priority support',
    customAlerts: 'Custom market alerts'
  };
  
  return descriptions[feature] || feature;
}

// Get comparison table data for the subscription plan comparison
export function getPlanComparisonData(): { feature: string, free: string | number | boolean, basic: string | number | boolean, pro: string | number | boolean }[] {
  const comparisonData = [];
  
  // Add all features to the comparison data
  const featureKeys = Object.keys(PLAN_FEATURES[SubscriptionPlan.FREE]) as (keyof PlanFeatures)[];
  
  for (const feature of featureKeys) {
    comparisonData.push({
      feature: getFeatureDescription(feature),
      free: PLAN_FEATURES[SubscriptionPlan.FREE][feature],
      basic: PLAN_FEATURES[SubscriptionPlan.BASIC][feature],
      pro: PLAN_FEATURES[SubscriptionPlan.PRO][feature]
    });
  }
  
  return comparisonData;
}
