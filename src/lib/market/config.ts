
/**
 * Market Data API Configuration
 */

// API endpoints and keys for market data services
export const API_ENDPOINT = "https://www.alphavantage.co/query";
export const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY || "demo"; // Replace with your actual API key

// Centralized market configuration 
export const MARKET_CONFIG = {
  polygon: {
    apiKey: import.meta.env.VITE_POLYGON_API_KEY || "",
    baseUrl: "https://api.polygon.io"
  }
};
