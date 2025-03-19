// Application configuration with actual Supabase credentials
export const config = {
  supabase: {
    url: 'https://iphpwxputfwxsiwdmqmk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwaHB3eHB1dGZ3eHNpd2RtcW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTc1OTgsImV4cCI6MjA1NzY3MzU5OH0.f3UDw6w8FGXz-SpQKlcsGFzyxCOICaUANeBJ2lCYFlE'
  },
  polygon: {
    apiKey: "4qpZEOR2MVYcrB4Oq8RdSK9bbWtkA2kZ",
    baseUrl: "https://api.polygon.io",
    enabled: true
  },
  xai: {
    apiKey: "xai-4rv1Rbqn7wij0qg71KGIkjst8TLHn71I79yFflHgVrpwmC4fk0r57IqmuELV2SUMgkadDfPH7sbZfta4",
    baseUrl: "https://api.x.ai/v1"
  }
};

// Feature flags
export const FEATURES = {
  enableRealMarketData: config.polygon.enabled,
  enableAIAnalysis: true,
  enableHistoricalData: true,
  enableSocialSharing: false,
  devMode: false // Disable development mode
};

// Market Data Configuration
export const MARKET_CONFIG = {
  refreshInterval: 60000, // 60 seconds
  defaultTimeframes: ['1d', '1w', '1m', '3m'],
  chartPeriods: ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL']
};

// API error messages
export const API_ERRORS = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  AUTHENTICATION_ERROR: "Authentication error. Please log in again.",
  SERVER_ERROR: "Server error. Please try again later.",
  NOT_FOUND: "Resource not found. Please check your request."
};

// Logging configuration
export const LOGGING = {
  enabled: true,
  level: 'debug' // 'debug', 'info', 'warn', 'error'
};
