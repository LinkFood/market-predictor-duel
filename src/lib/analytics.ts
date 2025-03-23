
/**
 * Basic analytics tracking functionality
 */

// Track general events
export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  console.log(`Analytics event: ${eventName}`, properties);
  // In production, this would send data to an analytics provider
}

// Track feature usage
export function trackFeatureUsage(featureName: string, userId: string): void {
  trackEvent('feature_used', { feature: featureName, userId });
}

// Track prediction-related events
export function trackPredictionCreated(userId: string, predictionType: string): void {
  trackEvent('prediction_created', { userId, predictionType });
}

// Track subscription-related events
export function trackSubscriptionChanged(userId: string, plan: string): void {
  trackEvent('subscription_changed', { userId, plan });
}
