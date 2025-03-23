
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

  // Limit controls
  predictionsPerDay: {
    free: 5,
    premium: 50
  },
  
  // Debug features
  enableDebugMode: true
};

// API endpoints and settings
export const API_CONFIG = {
  marketDataApiBase: "https://api.example.com/market",
  predictionApiBase: "https://api.example.com/predict",
  aiApiBase: "https://api.example.com/ai"
};

// Timeframes available for predictions
export const PREDICTION_TIMEFRAMES = [
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" }
];

// Application version 
export const APP_VERSION = "0.1.0";
