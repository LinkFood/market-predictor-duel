
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';
import { useSubscription } from './subscription-context';

/**
 * Track a feature usage event in Supabase
 */
export async function trackFeatureUsage(
  userId: string,
  eventType: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    // Get user's current plan
    const { data: subscriptionData, error: subError } = await supabase
      .from('user_subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (subError && subError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching subscription for usage tracking:', subError);
    }
    
    const plan = subscriptionData?.plan || 'free';
    
    // Also track in client-side analytics
    trackEvent(`feature_used_${eventType}`, { userId, plan, ...details });
    
    // Insert event into Supabase
    const { error } = await supabase
      .from('usage_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        resource_id: details?.id || details?.predictionId || details?.bracketId,
        plan,
        metadata: details || {}
      });
    
    if (error) {
      console.error('Error tracking feature usage:', error);
    }
  } catch (err) {
    console.error('Failed to track feature usage:', err);
  }
}

/**
 * Track AI analysis viewed event
 */
export function trackAiAnalysisViewed(userId: string, predictionId: string): void {
  trackFeatureUsage(userId, 'ai_analysis_viewed', { predictionId });
}

/**
 * Track prediction created event
 */
export function trackPredictionCreated(userId: string, predictionId: string): void {
  trackFeatureUsage(userId, 'prediction_created', { predictionId });
}

/**
 * Track bracket created event
 */
export function trackBracketCreated(userId: string, bracketId: string): void {
  trackFeatureUsage(userId, 'bracket_created', { bracketId });
}

/**
 * Track bracket viewed event
 */
export function trackBracketViewed(userId: string, bracketId: string): void {
  trackFeatureUsage(userId, 'bracket_viewed', { bracketId });
}

/**
 * Track bracket completed event
 */
export function trackBracketCompleted(userId: string, bracketId: string, result: string): void {
  trackFeatureUsage(userId, 'bracket_completed', { bracketId, result });
}

/**
 * Track advanced charting usage
 */
export function trackAdvancedChartingUsed(userId: string, chartType: string): void {
  trackFeatureUsage(userId, 'advanced_chart_used', { chartType });
}

/**
 * Track data export event
 */
export function trackDataExport(userId: string, dataType: string): void {
  trackFeatureUsage(userId, 'data_exported', { dataType });
}

/**
 * Custom hook to track feature usage in components
 */
export function useFeatureTracking() {
  const { currentPlan } = useSubscription();
  
  return {
    trackFeature: (userId: string, eventType: string, details?: Record<string, any>) => {
      trackFeatureUsage(userId, eventType, { ...details, planAtTime: currentPlan });
    },
    trackBracketCreated: (userId: string, bracketId: string) => {
      trackBracketCreated(userId, bracketId);
    },
    trackBracketViewed: (userId: string, bracketId: string) => {
      trackBracketViewed(userId, bracketId);
    }
  };
}
