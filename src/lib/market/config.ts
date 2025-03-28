
/**
 * Market Data API Configuration
 */

// API endpoints and keys for market data services
export const API_ENDPOINT = "https://www.alphavantage.co/query";
export const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY || "demo"; 

// API error messages
export const API_ERRORS = {
  NETWORK_ERROR: "Network error. Please check your internet connection and try again.",
  AUTHENTICATION_ERROR: "Authentication error. Please check your API key and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
  POLYGON_KEY_MISSING: "Polygon API key not configured. Please set up your API key in the settings."
};

// Centralized market configuration 
export const MARKET_CONFIG = {
  polygon: {
    apiKey: import.meta.env.VITE_POLYGON_API_KEY || "",
    baseUrl: "https://api.polygon.io",
    enabled: true
  }
};
