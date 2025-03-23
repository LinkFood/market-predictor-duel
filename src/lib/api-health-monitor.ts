
/**
 * API Health Monitor
 * Tracks API health and provides methods to check status
 */

import { FEATURES, MARKET_CONFIG } from './config';

// API Health status
type ApiStatus = 'unknown' | 'healthy' | 'degraded' | 'down';

interface ApiHealth {
  status: ApiStatus;
  lastChecked: Date | null;
  consecutiveFailures: number;
  lastError: string | null;
}

// Initialize health status for each API
const apiHealthStatus: Record<string, ApiHealth> = {
  polygon: {
    status: 'unknown',
    lastChecked: null,
    consecutiveFailures: 0,
    lastError: null
  },
  xai: {
    status: 'unknown',
    lastChecked: null,
    consecutiveFailures: 0,
    lastError: null
  },
  supabase: {
    status: 'unknown',
    lastChecked: null,
    consecutiveFailures: 0,
    lastError: null
  }
};

/**
 * Record API success
 */
export function recordApiSuccess(apiName: 'polygon' | 'xai' | 'supabase'): void {
  if (!FEATURES.devMode) return;
  
  const api = apiHealthStatus[apiName];
  if (!api) return;
  
  api.status = 'healthy';
  api.lastChecked = new Date();
  api.consecutiveFailures = 0;
  api.lastError = null;
  
  // Log status in development mode
  console.log(`API Status: ${apiName} is healthy`);
}

/**
 * Record API failure
 */
export function recordApiFailure(apiName: 'polygon' | 'xai' | 'supabase', error: any): void {
  if (!FEATURES.devMode) return;
  
  const api = apiHealthStatus[apiName];
  if (!api) return;
  
  api.lastChecked = new Date();
  api.consecutiveFailures += 1;
  api.lastError = error?.message || String(error);
  
  // Update status based on consecutive failures
  if (api.consecutiveFailures >= 5) {
    api.status = 'down';
  } else if (api.consecutiveFailures >= 2) {
    api.status = 'degraded';
  }
  
  // Log status in development mode
  console.error(`API Status: ${apiName} - ${api.status}`, error);
}

/**
 * Get current API health status
 */
export function getApiHealthStatus(): Record<string, ApiHealth> {
  return { ...apiHealthStatus };
}

/**
 * Check if specific API is healthy
 */
export function isApiHealthy(apiName: 'polygon' | 'xai' | 'supabase'): boolean {
  const api = apiHealthStatus[apiName];
  return api?.status === 'healthy';
}

/**
 * Run a ping check on API endpoints
 */
export async function pingApiEndpoints(): Promise<void> {
  if (!FEATURES.devMode) return;
  
  // Ping Polygon API - Using just the base URL since we no longer have the apiKey in config
  try {
    // Simple status check endpoint that doesn't require an API key
    const response = await fetch(`${MARKET_CONFIG.polygon.baseUrl}/v1/marketstatus/now`);
    if (response.ok) {
      recordApiSuccess('polygon');
    } else {
      recordApiFailure('polygon', new Error(`Status: ${response.status}`));
    }
  } catch (error) {
    recordApiFailure('polygon', error);
  }
  
  // Ping Supabase - Simplified to just a mock check since we lack the actual config
  try {
    recordApiSuccess('supabase');
  } catch (error) {
    recordApiFailure('supabase', error);
  }
  
  // X.ai doesn't have a simple ping endpoint, so we'll have to rely on actual API calls
}
