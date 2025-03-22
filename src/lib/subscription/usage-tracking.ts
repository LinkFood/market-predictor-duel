/**
 * Usage Tracking Service
 * Tracks API calls, predictions, and resource usage for both analytics and billing
 */
import { supabase } from '@/integrations/supabase/client';
import { getUserPlan } from './plan-features';

// Usage event types
export enum UsageEventType {
  API_CALL = 'api_call',
  PREDICTION_CREATED = 'prediction_created',
  AI_ANALYSIS_VIEWED = 'ai_analysis_viewed',
  MARKET_DATA_FETCHED = 'market_data_fetched'
}

// Usage event interface
interface UsageEvent {
  userId: string;
  eventType: UsageEventType;
  resourceId?: string;
  metadata?: Record<string, any>;
}

/**
 * Track a usage event
 */
export async function trackUsage(event: UsageEvent): Promise<void> {
  try {
    console.log('Tracking usage event:', event);
    
    // Create usage record in database
    const { error } = await supabase
      .from('usage_events')
      .insert({
        user_id: event.userId,
        event_type: event.eventType,
        resource_id: event.resourceId,
        metadata: event.metadata,
        plan: getUserPlan()
      });
    
    if (error) {
      console.error('Error tracking usage:', error);
    }
  } catch (error) {
    // Don't let tracking errors affect the main app flow
    console.error('Failed to track usage:', error);
  }
}

/**
 * Track an API call
 */
export async function trackApiCall(
  userId: string, 
  apiName: string, 
  endpoint: string
): Promise<void> {
  await trackUsage({
    userId,
    eventType: UsageEventType.API_CALL,
    metadata: {
      apiName,
      endpoint,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Track prediction creation
 */
export async function trackPredictionCreated(
  userId: string,
  predictionId: string,
  ticker: string,
  predictionType: string
): Promise<void> {
  await trackUsage({
    userId,
    eventType: UsageEventType.PREDICTION_CREATED,
    resourceId: predictionId,
    metadata: {
      ticker,
      predictionType,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Track AI analysis view
 */
export async function trackAiAnalysisViewed(
  userId: string,
  predictionId: string
): Promise<void> {
  await trackUsage({
    userId,
    eventType: UsageEventType.AI_ANALYSIS_VIEWED,
    resourceId: predictionId,
    metadata: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Get usage summary for a user
 */
export async function getUserUsageSummary(userId: string): Promise<{
  totalPredictions: number;
  totalApiCalls: number;
  costEstimate: number;
}> {
  try {
    // In a real implementation, query database for usage summary
    // For now, return mock data
    
    // Get prediction count
    const { data: predictions, error: predictionError } = await supabase
      .from('predictions')
      .select('count')
      .eq('user_id', userId);
    
    if (predictionError) {
      throw predictionError;
    }
    
    // Get API call count
    const { data: apiCalls, error: apiCallError } = await supabase
      .from('usage_events')
      .select('count')
      .eq('user_id', userId)
      .eq('event_type', UsageEventType.API_CALL);
    
    if (apiCallError) {
      throw apiCallError;
    }
    
    // Calculate an estimated cost
    // This would be based on your actual cost structure
    const totalPredictions = predictions?.length || 0;
    const totalApiCalls = apiCalls?.length || 0;
    const costEstimate = totalPredictions * 0.02 + totalApiCalls * 0.001;
    
    return {
      totalPredictions,
      totalApiCalls,
      costEstimate
    };
  } catch (error) {
    console.error('Error fetching usage summary:', error);
    return {
      totalPredictions: 0,
      totalApiCalls: 0,
      costEstimate: 0
    };
  }
}