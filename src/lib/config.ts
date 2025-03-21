
// Application configuration with actual Supabase credentials
export const config = {
  supabase: {
    url: 'https://xvojivdhshgdbxrwcokx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2ppdmRoc2hnZGJ4cndjb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQxNDUsImV4cCI6MjA1NzY4MDE0NX0.G0HNXKFNUqIba27xsKY9t1KYRDL68ZHbsSgLmPQsXc4'
  },
  polygon: {
    baseUrl: "https://api.polygon.io",
    enabled: true, // Ensure this is set to true for using real data
    apiKey: import.meta.env.VITE_POLYGON_API_KEY || "" // Changed from process.env to import.meta.env
  },
  xai: {
    baseUrl: "https://api.x.ai/v1"
  }
};

// Feature flags
export const FEATURES = {
  enableRealMarketData: true, // Explicitly enable real market data
  enableAIAnalysis: true,
  enableHistoricalData: true,
  enableSocialSharing: false,
  devMode: true // Enable development mode for better logging
};

// Market Data Configuration
export const MARKET_CONFIG = {
  refreshInterval: 60000, // 60 seconds
  defaultTimeframes: ['1d', '1w', '1m', '3m'],
  chartPeriods: ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'],
  retryAttempts: 3, // Number of retry attempts for API calls
  retryDelay: 1000, // Base delay between retries in milliseconds
  requestTimeout: 10000 // Timeout for API requests in milliseconds
};

// API error messages
export const API_ERRORS = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  AUTHENTICATION_ERROR: "Authentication error. Please log in again.",
  SERVER_ERROR: "Server error. Please try again later.",
  NOT_FOUND: "Resource not found. Please check your request.",
  POLYGON_ERROR: "Error loading market data. Make sure the Polygon API key is correctly set in Supabase secrets and is valid."
};

// Logging configuration
export const LOGGING = {
  enabled: true,
  level: 'debug' // 'debug', 'info', 'warn', 'error'
};
