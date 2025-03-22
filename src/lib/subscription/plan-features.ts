
/**
 * Feature definitions for subscription plans
 */

export interface PlanFeatures {
  // Core prediction features
  maxDailyPredictions: number;       // Maximum number of predictions per day
  historyRetentionDays: number;      // How many days of prediction history to retain
  enableAIInsights: boolean;         // Access to AI insights
  enableDetailedAnalysis: boolean;   // Access to detailed analysis
  enableAdvancedCharts: boolean;     // Access to advanced chart features
  
  // Special features
  enableSectorAnalysis: boolean;     // Access to sector-specific analysis
  enableAlerts: boolean;             // Enable price and prediction alerts
  enableCustomTimeframes: boolean;   // Allow custom prediction timeframes
  enableBatchPredictions: boolean;   // Allow making predictions for multiple assets at once
  prioritySupport: boolean;          // Priority customer support
  
  // API access
  apiAccess: boolean;                // Access to prediction API
  apiRequestsPerDay: number;         // Maximum API requests per day
  
  // Learning features
  enableLearningSystem: boolean;     // Access to AI learning system insights
  enableCustomLearning: boolean;     // Allow customizing AI learning parameters
}

// Free plan features
export const FREE_PLAN_FEATURES: PlanFeatures = {
  // Core prediction features
  maxDailyPredictions: 3,
  historyRetentionDays: 7,
  enableAIInsights: true,
  enableDetailedAnalysis: false,
  enableAdvancedCharts: false,
  
  // Special features
  enableSectorAnalysis: false,
  enableAlerts: false,
  enableCustomTimeframes: false,
  enableBatchPredictions: false,
  prioritySupport: false,
  
  // API access
  apiAccess: false,
  apiRequestsPerDay: 0,
  
  // Learning features
  enableLearningSystem: true,
  enableCustomLearning: false
};

// Premium plan features
export const PREMIUM_PLAN_FEATURES: PlanFeatures = {
  // Core prediction features
  maxDailyPredictions: 100,
  historyRetentionDays: 365,
  enableAIInsights: true,
  enableDetailedAnalysis: true,
  enableAdvancedCharts: true,
  
  // Special features
  enableSectorAnalysis: true,
  enableAlerts: true,
  enableCustomTimeframes: true,
  enableBatchPredictions: true,
  prioritySupport: true,
  
  // API access
  apiAccess: true,
  apiRequestsPerDay: 100,
  
  // Learning features
  enableLearningSystem: true,
  enableCustomLearning: true
};

// Helper type guard to check if a feature value is a boolean
export function isFeatureBoolean(value: boolean | number): value is boolean {
  return typeof value === 'boolean';
}

// Helper to get feature value based on plan
export function getFeatureValue(feature: keyof PlanFeatures, plan: 'free' | 'premium'): boolean | number {
  if (plan === 'premium') {
    return PREMIUM_PLAN_FEATURES[feature];
  } else {
    return FREE_PLAN_FEATURES[feature];
  }
}

// Helper to check if a boolean feature is enabled for a plan
export function isFeatureEnabled(feature: keyof PlanFeatures, plan: 'free' | 'premium'): boolean {
  const value = getFeatureValue(feature, plan);
  return isFeatureBoolean(value) ? value : false;
}

// Helper to get the numeric limit for a feature
export function getFeatureLimit(feature: keyof PlanFeatures, plan: 'free' | 'premium'): number {
  const value = getFeatureValue(feature, plan);
  return typeof value === 'number' ? value : 0;
}
