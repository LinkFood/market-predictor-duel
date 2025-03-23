
/**
 * Application Configuration
 * Contains feature flags and configuration settings
 */

// Feature flags to control app functionality
export const FEATURES = {
  // Data source controls
  enableRealMarketData: false,
  enableMockData: true,

  // Authentication controls
  enableAuth: true,
  allowDevLogin: true,

  // Feature controls
  enableSubscriptions: true,
  enableBrackets: true,
  enableCommunityPredictions: true,
  enableAIAnalysis: true,
  
  // Limit controls
  predictionsPerDay: {
    free: 5,
    premium: 50
  },
  
  // Debug features
  enableDebugMode: true,
  devMode: true
};

// API endpoints and settings
export const API_CONFIG = {
  marketDataApiBase: "https://api.example.com/market",
  predictionApiBase: "https://api.example.com/predict",
  aiApiBase: "https://api.example.com/ai"
};

// Market configuration
export const MARKET_CONFIG = {
  polygon: {
    enabled: false,
    baseUrl: "https://api.polygon.io",
    apiKey: import.meta.env.VITE_POLYGON_API_KEY || "demo"
  },
  refreshInterval: 60000, // 1 minute refresh interval
  retryAttempts: 3,
  retryDelay: 1000
};

// API error messages
export const API_ERRORS = {
  MARKET_DATA_UNAVAILABLE: "Market data is temporarily unavailable",
  PREDICTION_SERVICE_UNAVAILABLE: "Prediction service is temporarily unavailable",
  AUTHENTICATION_FAILED: "Authentication failed",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
  GENERAL_ERROR: "An unexpected error occurred",
  NETWORK_ERROR: "Network connection error",
  AUTHENTICATION_ERROR: "Authentication error",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Server error",
  POLYGON_ERROR: "Polygon API configuration error"
};

// General application config
export const config = {
  polygon: {
    enabled: false,
    baseUrl: "https://api.polygon.io"
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  }
};

// Timeframes available for predictions
export const PREDICTION_TIMEFRAMES = [
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" }
];

// Application version 
export const APP_VERSION = "0.1.0";
