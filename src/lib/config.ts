
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
  }
}

// Feature flags
export const FEATURES = {
  enableRealMarketData: config.polygon.enabled,
  enableAIAnalysis: true,
  enableHistoricalData: true,
  enableSocialSharing: false
};

// Market Data Configuration
export const MARKET_CONFIG = {
  refreshInterval: 60000, // 60 seconds
  defaultTimeframes: ['1d', '1w', '1m', '3m'],
  chartPeriods: ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL']
};
