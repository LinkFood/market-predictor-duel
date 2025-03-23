
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

/**
 * Track a feature usage event in Supabase
 */
export async function trackFeatureUsage(
  userId: string,
  eventType: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    // Also track in client-side analytics
    trackEvent(`feature_used_${eventType}`, { userId, ...details });
    
    // Insert event into Supabase
    const { error } = await supabase
      .from('usage_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        details: details || {}
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
