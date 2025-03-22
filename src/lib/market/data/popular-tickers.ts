
/**
 * Popular Stock Tickers
 * A curated list of 250 well-known, liquid stocks for market movers tracking
 */

export const POPULAR_TICKERS = [
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "GOOG", "TSLA", "META", "BRK.B", "AVGO",
  "UNH", "JPM", "LLY", "V", "XOM", "COST", "HD", "PG", "MA", "MRK",
  "CVX", "ABBV", "PEP", "BAC", "KO", "ADBE", "CRM", "MCD", "CSCO", "TMO",
  "WMT", "ABT", "ACN", "DHR", "NFLX", "LIN", "CMCSA", "AMD", "PFE", "ORCL",
  "NKE", "DIS", "TXN", "WFC", "PM", "NEE", "MS", "IBM", "QCOM", "RTX",
  "CAT", "INTU", "INTC", "BA", "SPGI", "GE", "LOW", "BMY", "SBUX", "HON",
  "GS", "AMAT", "UPS", "AMT", "BLK", "BKNG", "MDLZ", "ISRG", "PLD", "ADP",
  "DE", "TJX", "C", "MDT", "GILD", "MMC", "SYK", "VRTX", "LRCX", "PANW",
  "ADI", "ZTS", "MO", "AXP", "TMUS", "CB", "T", "PGR", "REGN", "EOG",
  "UBER", "SCHW", "CME", "CL", "CI", "DUK", "MU", "SO", "APD", "FI",
  "BSX", "HCA", "NOC", "PNC", "ITW", "ETN", "SLB", "CSX"
];

// Batches of tickers for API requests (Polygon has a limit of tickers per request)
export const TICKER_BATCHES = (): string[] => {
  // Join all tickers with commas, but in batches of 50 (Polygon's typical limit)
  const batchSize = 50;
  const batches: string[] = [];
  
  for (let i = 0; i < POPULAR_TICKERS.length; i += batchSize) {
    batches.push(POPULAR_TICKERS.slice(i, i + batchSize).join(','));
  }
  
  return batches;
};

// Helper function to check if a ticker is in our popular list
export const isPopularTicker = (ticker: string): boolean => {
  return POPULAR_TICKERS.includes(ticker);
};
