/**
 * Subscription Plans and Feature Access Management
 * Controls what features users can access based on their subscription level
 */

// Subscription plan types
export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

// Feature access flags
export interface PlanFeatures {
  // Challenge Mode (Free)
  maxPredictionsPerMonth: number;
  aiCompetition: boolean;
  basicStats: boolean;
  leaderboardAccess: boolean;
  
  // Insight Mode (Paid)
  aiAnalysisAccess: boolean;
  aiReasoningAccess: boolean;
  historicalPatterns: boolean;
  marketInsights: boolean;
  realTimeAlerts: boolean;
  advancedTimeframes: boolean;
  unlimitedHistory: boolean;
  
  // Usage limits
  apiCallsPerDay: number;
}

// Feature configuration by plan
export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  [SubscriptionPlan.FREE]: {
    // Challenge Mode features
    maxPredictionsPerMonth: 20,
    aiCompetition: true,
    basicStats: true,
    leaderboardAccess: true,
    
    // Insight Mode features (restricted)
    aiAnalysisAccess: false,
    aiReasoningAccess: false,
    historicalPatterns: false,
    marketInsights: false,
    realTimeAlerts: false,
    advancedTimeframes: false,
    unlimitedHistory: false,
    
    // Usage limits
    apiCallsPerDay: 10
  },
  
  [SubscriptionPlan.BASIC]: {
    // Challenge Mode features
    maxPredictionsPerMonth: 50,
    aiCompetition: true,
    basicStats: true,
    leaderboardAccess: true,
    
    // Insight Mode features (basic)
    aiAnalysisAccess: true,
    aiReasoningAccess: true,
    historicalPatterns: false,
    marketInsights: true,
    realTimeAlerts: false,
    advancedTimeframes: false,
    unlimitedHistory: false,
    
    // Usage limits
    apiCallsPerDay: 50
  },
  
  [SubscriptionPlan.PRO]: {
    // Challenge Mode features
    maxPredictionsPerMonth: 200,
    aiCompetition: true,
    basicStats: true,
    leaderboardAccess: true,
    
    // Insight Mode features (full)
    aiAnalysisAccess: true,
    aiReasoningAccess: true,
    historicalPatterns: true,
    marketInsights: true,
    realTimeAlerts: true,
    advancedTimeframes: true,
    unlimitedHistory: true,
    
    // Usage limits
    apiCallsPerDay: 200
  },
  
  [SubscriptionPlan.ENTERPRISE]: {
    // Challenge Mode features
    maxPredictionsPerMonth: 1000,
    aiCompetition: true,
    basicStats: true,
    leaderboardAccess: true,
    
    // Insight Mode features (unlimited)
    aiAnalysisAccess: true,
    aiReasoningAccess: true,
    historicalPatterns: true,
    marketInsights: true,
    realTimeAlerts: true,
    advancedTimeframes: true,
    unlimitedHistory: true,
    
    // Usage limits
    apiCallsPerDay: 1000
  }
};

// Default to free plan
const DEFAULT_PLAN = SubscriptionPlan.FREE;

/**
 * Get current user's plan
 */
export function getUserPlan(): SubscriptionPlan {
  // In the future, get this from user profile in the database
  return DEFAULT_PLAN;
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(feature: keyof PlanFeatures): boolean {
  const userPlan = getUserPlan();
  return PLAN_FEATURES[userPlan][feature];
}

/**
 * Get user's feature limits (like max predictions)
 */
export function getUserLimit(limit: keyof PlanFeatures): number {
  const userPlan = getUserPlan();
  return PLAN_FEATURES[userPlan][limit];
}

/**
 * Check if user has reached their prediction limit
 */
export async function hasReachedPredictionLimit(): Promise<boolean> {
  // This would check the database for current month's prediction count
  // For now, always return false
  return false;
}

/**
 * Format price for display
 */
export function formatPlanPrice(plan: SubscriptionPlan): string {
  switch (plan) {
    case SubscriptionPlan.FREE:
      return 'Free';
    case SubscriptionPlan.BASIC:
      return '$9.99/month';
    case SubscriptionPlan.PRO:
      return '$19.99/month';
    case SubscriptionPlan.ENTERPRISE:
      return 'Custom pricing';
  }
}