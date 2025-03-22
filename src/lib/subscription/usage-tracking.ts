
import { supabase } from '@/integrations/supabase/client';
import { logError } from '../error-handling';

// Event types for tracking
export type UsageEventType = 
  | 'prediction_created'
  | 'prediction_resolved'
  | 'prediction_viewed'
  | 'analysis_viewed'
  | 'subscription_changed'
  | 'login';

/**
 * Track a usage event for the current user
 */
export async function trackUsageEvent(
  eventType: UsageEventType, 
  details?: Record<string, any>
): Promise<boolean> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.warn('Cannot track usage: No authenticated user');
      return false;
    }
    
    // Use custom type assertion for the table not in the schema types
    const { error } = await supabase
      .from('usage_events')
      .insert({
        user_id: user.id,
        event_type: eventType,
        event_date: new Date().toISOString(),
        details: details || {}
      } as any);
    
    if (error) {
      console.error('Error tracking usage event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    logError(error, 'trackUsageEvent');
    console.error('Error tracking usage event:', error);
    return false;
  }
}

/**
 * Track when a prediction is created
 */
export function trackPredictionCreated(predictionId: string, predictionType: string): Promise<boolean> {
  return trackUsageEvent('prediction_created', { 
    prediction_id: predictionId,
    prediction_type: predictionType
  });
}

/**
 * Track when a prediction is resolved
 */
export function trackPredictionResolved(predictionId: string, outcome: string): Promise<boolean> {
  return trackUsageEvent('prediction_resolved', { 
    prediction_id: predictionId,
    outcome 
  });
}

/**
 * Get usage statistics for a specific event type in a date range
 */
export async function getUserEventCount(
  userId: string,
  eventType: UsageEventType,
  startDate: Date,
  endDate: Date = new Date()
): Promise<number> {
  try {
    // Use custom type assertion for the table not in schema types
    const { data, error, count } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('event_type', eventType)
      .gte('event_date', startDate.toISOString())
      .lte('event_date', endDate.toISOString()) as { data: any[], error: any, count: number | null };
    
    if (error) {
      console.error('Error getting usage count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    logError(error, 'getUserEventCount');
    console.error('Error getting usage count:', error);
    return 0;
  }
}

/**
 * Get usage statistics for the current day 
 */
export async function getTodayUsageStats(userId: string): Promise<Record<UsageEventType, number>> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result: Record<UsageEventType, number> = {
      prediction_created: 0,
      prediction_resolved: 0,
      prediction_viewed: 0,
      analysis_viewed: 0,
      subscription_changed: 0,
      login: 0
    };
    
    // Use custom type assertion for the table not in schema types
    const { data, error } = await supabase
      .from('usage_events')
      .select('event_type')
      .eq('user_id', userId)
      .gte('event_date', today.toISOString()) as { data: { event_type: UsageEventType }[] | null, error: any };
    
    if (error) {
      console.error('Error getting usage stats:', error);
      return result;
    }
    
    if (!data) return result;
    
    // Count events by type
    data.forEach(event => {
      const eventType = event.event_type as UsageEventType;
      if (eventType in result) {
        result[eventType]++;
      }
    });
    
    return result;
  } catch (error) {
    logError(error, 'getTodayUsageStats');
    console.error('Error getting today usage stats:', error);
    return {
      prediction_created: 0,
      prediction_resolved: 0,
      prediction_viewed: 0,
      analysis_viewed: 0,
      subscription_changed: 0,
      login: 0
    };
  }
}
