
/**
 * Polygon.io Base API Service
 * Handles core API functionality and common utilities
 */

import { config, MARKET_CONFIG } from "../../config";

// API configuration
const POLYGON_API_KEY = MARKET_CONFIG.polygon.apiKey || ""; 
const POLYGON_BASE_URL = "https://api.polygon.io";

/**
 * Make a request to the Polygon.io API with proper error handling
 */
export async function callPolygonApi(endpoint: string, params = {}) {
  try {
    // Build the URL with parameters
    let url = `${POLYGON_BASE_URL}${endpoint}`;
    
    // Add API key to all requests
    const queryParams = new URLSearchParams(params);
    queryParams.append('apiKey', POLYGON_API_KEY);
    
    // Append query parameters to URL
    url = `${url}?${queryParams.toString()}`;
    
    console.log(`Calling Polygon API: ${url.replace(POLYGON_API_KEY, '[REDACTED]')}`);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Polygon API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in Polygon API request:`, error);
    throw error;
  }
}

/**
 * Helper function to get a date X days ago in YYYY-MM-DD format
 */
export function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
