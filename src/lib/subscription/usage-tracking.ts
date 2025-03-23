
import { supabase } from '@/integrations/supabase/client';
import { logError } from '../error-handling';

// Event types for tracking
export type UsageEventType = 
  | 'prediction_created'
  | 'prediction_resolved'
  | 'prediction_viewed'
  | 'analysis_viewed'
  | 'ai_analysis_viewed'
  | 'subscription_changed'
  | 'login';

// Define types for tables not in the Supabase types.ts
interface UsageEvent {
  id?: string;
  user_id: string;
  event_type: UsageEventType;
  event_date?: string;
  details?: Record<string, any>;
}

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
    const eventData: UsageEvent = {
      user_id: user.id,
      event_type: eventType,
      details: details || {}
    };
    
    // @ts-ignore - intentionally ignoring type errors for tables not in types.ts
    const { error } = await supabase
      .from('usage_events')
      .insert(eventData);
    
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
 * Track when AI analysis is viewed
 */
export function trackAiAnalysisViewed(predictionId: string): Promise<boolean> {
  return trackUsageEvent('ai_analysis_viewed', {
    prediction_id: predictionId
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
    // @ts-ignore - intentionally ignoring type errors for tables not in types.ts
    const { count, error } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('event_type', eventType)
      .gte('event_date', startDate.toISOString())
      .lte('event_date', endDate.toISOString());
    
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
      ai_analysis_viewed: 0,
      subscription_changed: 0,
      login: 0
    };
    
    // @ts-ignore - intentionally ignoring type errors for tables not in types.ts
    const { data, error } = await supabase
      .from('usage_events')
      .select('event_type')
      .eq('user_id', userId)
      .gte('event_date', today.toISOString());
    
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
      ai_analysis_viewed: 0,
      subscription_changed: 0,
      login: 0
    };
  }
}
