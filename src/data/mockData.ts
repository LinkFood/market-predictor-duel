// Global stats for AI vs humans battle
export const mockGlobalStats = {
  totalDuels: 1568,
  humansWon: 847,
  aiWon: 721,
  humanWinRate: 54,
  humanTrendAccuracy: 62,
  aiTrendAccuracy: 59,
  recentHumanAdvantage: 3,
  topHumanScore: 156,
  topAiScore: 142
};

// Mock leaderboard data
export const mockLeaderboard = [
  { 
    userId: "user-001", 
    name: "TradeMaster", 
    avatar: "👑", 
    score: 1250, 
    rank: 1, 
    winRate: 76, 
    streakCount: 5 
  },
  { 
    userId: "user-002", 
    name: "MarketWizard", 
    avatar: "🧙‍♂️", 
    score: 980, 
    rank: 2, 
    winRate: 68, 
    streakCount: 3 
  },
  { 
    userId: "user-003", 
    name: "StockWhisperer", 
    avatar: "🐘", 
    score: 870, 
    rank: 3, 
    winRate: 64, 
    streakCount: 0 
  },
  { 
    userId: "user-004", 
    name: "BullRider", 
    avatar: "🐂", 
    score: 740, 
    rank: 4, 
    winRate: 59, 
    streakCount: 2 
  },
  { 
    userId: "user-005", 
    name: "AlphaCatcher", 
    avatar: "🦊", 
    score: 690, 
    rank: 5, 
    winRate: 57, 
    streakCount: 1 
  }
];

// Mock market data for landing page
export const mockMarketData = [
  {
    name: "S&P 500",
    ticker: "SPY",
    price: 5192.24,
    change: 38.52,
    changePercent: 0.75,
    volume: 2874523
  },
  {
    name: "Nasdaq",
    ticker: "QQQ",
    price: 16298.87,
    change: 156.32,
    changePercent: 0.97,
    volume: 3874521
  },
  {
    name: "Dow Jones",
    ticker: "DIA",
    price: 38675.42,
    change: 214.76,
    changePercent: 0.56,
    volume: 1987452
  },
  {
    name: "Bitcoin",
    ticker: "BTC-USD",
    price: 69842.18,
    change: 1587.34,
    changePercent: 2.33,
    volume: 4587621
  }
];

export const mockStockData = [
  {
    symbol: "SPY",
    name: "S&P 500",
    value: 4393.63,
    change: 27.37,
    changePercent: 0.63
  },
  {
    symbol: "QQQ",
    name: "Nasdaq",
    value: 13638.59,
    change: 128.41,
    changePercent: 0.95
  },
  {
    symbol: "DIA",
    name: "Dow Jones",
    value: 34212.24,
    change: 183.56,
    changePercent: 0.54
  },
  {
    symbol: "IWM",
    name: "Russell 2000",
    value: 1854.21,
    change: 12.87,
    changePercent: 0.70
  },
  {
    symbol: "VXX",
    name: "VIX",
    value: 16.85,
    change: -0.52,
    changePercent: -3.00
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    value: 182.56,
    change: 2.34,
    changePercent: 1.30
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    value: 334.78,
    change: 5.67,
    changePercent: 1.72
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    value: 138.92,
    change: 2.15,
    changePercent: 1.57
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    value: 145.24,
    change: 3.42,
    changePercent: 2.41
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    value: 246.83,
    change: -5.29,
    changePercent: -2.10
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    value: 318.45,
    change: 6.78,
    changePercent: 2.18
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    value: 437.53,
    change: 12.45,
    changePercent: 2.93
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    value: 179.96,
    change: 0.87,
    changePercent: 0.49
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    value: 270.37,
    change: 1.45,
    changePercent: 0.54
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    value: 156.32,
    change: -0.98,
    changePercent: -0.62
  }
];

export const mockMarketNews = [
  {
    title: "Tech Stocks Lead Market Rally",
    source: "Bloomberg",
    date: "2023-07-24",
    url: "https://www.bloomberg.com/news/articles/2023-07-24/tech-stocks-lead-market-rally"
  },
  {
    title: "Oil Prices Surge on Supply Concerns",
    source: "Reuters",
    date: "2023-07-24",
    url: "https://www.reuters.com/markets/commodities/oil-prices-surge-supply-concerns-2023-07-24/"
  },
  {
    title: "Fed Expected to Raise Rates This Week",
    source: "The Wall Street Journal",
    date: "2023-07-23",
    url: "https://www.wsj.com/articles/fed-expected-to-raise-rates-this-week-b9a8a5a0"
  }
];

export function generateRandomStockData(name: string) {
  const value = Math.random() * 200 + 50; // Random value between 50 and 250
  const change = Math.random() * 10 - 5; // Random change between -5 and 5
  const changePercent = (change / value) * 100;
  
  return {
    name: name,
    value: value,
    change: change,
    changePercent: changePercent
  };
}

export function generateMultipleStockData(names: string[], count: number) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    data.push(generateRandomStockData(name));
  }
  return data;
}

// Update mockPredictions to include ticker and predictionType fields
export const mockPredictions = [
  {
    id: "pred-001",
    userId: "user-123",
    targetType: "market",
    targetName: "S&P 500",
    ticker: "SPY",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bearish",
    aiConfidence: 8,
    aiAnalysis: {
      supporting: [
        "Technical indicators suggest a bullish trend",
        "Recent market sentiment is positive",
        "Economic data shows growth"
      ],
      counter: [
        "Market may be overvalued",
        "Rising interest rates could limit growth",
        "Geopolitical risks remain"
      ],
      reasoning: "While economic indicators suggest continued growth, there are significant headwinds from monetary policy tightening that may impact market performance."
    },
    timeframe: "1w",
    startingValue: 4372.85,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending"
  },
  {
    id: "pred-002",
    userId: "user-123",
    targetType: "sector",
    targetName: "Technology",
    ticker: "XLK",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 9,
    aiAnalysis: {
      supporting: [
        "Tech companies showing strong earnings",
        "Innovation in AI driving growth",
        "Consumer demand for tech remains high"
      ],
      counter: [
        "Regulatory challenges ahead",
        "Valuation concerns for some companies",
        "Competition intensifying"
      ],
      reasoning: "The technology sector continues to demonstrate strong fundamental growth drivers, particularly in artificial intelligence and cloud services, which should drive positive performance in the near term."
    },
    timeframe: "1m",
    startingValue: 184.29,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending"
  },
  {
    id: "pred-003",
    userId: "user-123",
    targetType: "stock",
    targetName: "Apple Inc.",
    ticker: "AAPL",
    predictionType: "trend",
    userPrediction: "bearish",
    aiPrediction: "bullish",
    aiConfidence: 7,
    aiAnalysis: {
      supporting: [
        "New product launch imminent",
        "Service revenue growing",
        "Strong balance sheet"
      ],
      counter: [
        "Supply chain constraints",
        "Consumer spending tightening",
        "Increased competition"
      ],
      reasoning: "Despite some near-term headwinds from supply chains, Apple's product ecosystem and services growth continue to create a strong foundation for positive stock performance."
    },
    timeframe: "1d",
    startingValue: 173.45,
    endValue: 181.21,
    percentChange: 4.47,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "uptrend",
    winner: "ai",
    resolvedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "ai_win"
  },
  {
    id: "pred-004",
    userId: "user-123",
    targetType: "market",
    targetName: "Dow Jones",
    ticker: "DIA",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 8,
    aiAnalysis: {
      supporting: [
        "Industrial sector recovery",
        "Infrastructure spending increasing",
        "Value stocks performing well"
      ],
      counter: [
        "Inflation concerns",
        "Labor market constraints",
        "Energy price volatility"
      ],
      reasoning: "Economic reopening and increased infrastructure spending are providing strong tailwinds for the industrial and value-oriented companies that make up much of the Dow Jones index."
    },
    timeframe: "1w",
    startingValue: 34123.45,
    endValue: 35213.12,
    percentChange: 3.19,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "uptrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 50
  },
  {
    id: "pred-005",
    userId: "user-123",
    targetType: "stock",
    targetName: "Microsoft Corporation",
    ticker: "MSFT",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 9,
    aiAnalysis: {
      supporting: [
        "Cloud business growing rapidly",
        "Strong enterprise adoption",
        "AI investments paying off"
      ],
      counter: [
        "High valuation metrics",
        "Potential regulatory scrutiny",
        "Competitive threats in cloud"
      ],
      reasoning: "Microsoft's Azure cloud platform and AI investments continue to drive substantial growth, providing a strong foundation for continued positive stock performance."
    },
    timeframe: "1m",
    startingValue: 310.65,
    endValue: 334.23,
    percentChange: 7.59,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "uptrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 100
  },
  {
    id: "pred-006",
    userId: "user-123",
    targetType: "stock",
    targetName: "Tesla Inc",
    ticker: "TSLA",
    predictionType: "trend",
    userPrediction: "bearish",
    aiPrediction: "bearish",
    aiConfidence: 6,
    aiAnalysis: {
      supporting: [
        "Production numbers are still high",
        "Demand is still strong",
        "Stock is still overvalued"
      ],
      counter: [
        "Competition is increasing",
        "Elon Musk is a wild card",
        "Valuation is unsustainable"
      ],
      reasoning: "Tesla is still a very volatile stock, and it is hard to predict what will happen in the future."
    },
    timeframe: "1w",
    startingValue: 250.00,
    endValue: 240.00,
    percentChange: -4.00,
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "downtrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 75
  },
  {
    id: "pred-007",
    userId: "user-123",
    targetType: "market",
    targetName: "FTSE 100",
    ticker: "FTSE",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 7,
    aiAnalysis: {
      supporting: [
        "UK economy is recovering",
        "Inflation is under control",
        "Unemployment is falling"
      ],
      counter: [
        "Brexit is still a risk",
        "Global economy is slowing",
        "Political uncertainty"
      ],
      reasoning: "The UK economy is recovering, but there are still some risks that could derail the recovery."
    },
    timeframe: "1m",
    startingValue: 7500.00,
    endValue: 7600.00,
    percentChange: 1.33,
    createdAt: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "uptrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 25
  },
  {
    id: "pred-008",
    userId: "user-123",
    targetType: "sector",
    targetName: "Financial Services",
    ticker: "XLF",
    predictionType: "trend",
    userPrediction: "bearish",
    aiPrediction: "bearish",
    aiConfidence: 8,
    aiAnalysis: {
      supporting: [
        "Interest rates are rising",
        "Inflation is falling",
        "Banks are well capitalized"
      ],
      counter: [
        "Recession is a risk",
        "Global economy is slowing",
        "Political uncertainty"
      ],
      reasoning: "The financial sector is well capitalized, but there are still some risks that could derail the recovery."
    },
    timeframe: "1w",
    startingValue: 35.00,
    endValue: 34.00,
    percentChange: -2.86,
    createdAt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "downtrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 100
  },
  {
    id: "pred-009",
    userId: "user-123",
    targetType: "stock",
    targetName: "Google",
    ticker: "GOOGL",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 9,
    aiAnalysis: {
      supporting: [
        "Advertising revenue is growing",
        "Cloud business is expanding",
        "AI investments are paying off"
      ],
      counter: [
        "Regulatory scrutiny is increasing",
        "Competition is intensifying",
        "Valuation is high"
      ],
      reasoning: "Google is still a very strong company, and it is expected to continue to grow in the future."
    },
    timeframe: "1m",
    startingValue: 120.00,
    endValue: 130.00,
    percentChange: 8.33,
    createdAt: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "uptrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 50
  },
  {
    id: "pred-010",
    userId: "user-123",
    targetType: "market",
    targetName: "Nikkei 225",
    ticker: "N225",
    predictionType: "trend",
    userPrediction: "bearish",
    aiPrediction: "bearish",
    aiConfidence: 6,
    aiAnalysis: {
      supporting: [
        "Japanese economy is slowing",
        "Inflation is rising",
        "Political uncertainty"
      ],
      counter: [
        "Government is providing stimulus",
        "Exports are still strong",
        "Corporate profits are rising"
      ],
      reasoning: "The Japanese economy is slowing, but there are still some factors that could support the market."
    },
    timeframe: "1w",
    startingValue: 27000.00,
    endValue: 26000.00,
    percentChange: -3.70,
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    resolvesAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    actualResult: "downtrend",
    winner: "both",
    resolvedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "tie",
    points: 75
  }
];

// Function to generate a random prediction
function generateRandomPrediction() {
  const targetTypes = ["market", "sector", "stock"];
  const timeframes = ["1d", "1w", "1m"];
  const directions = ["bullish", "bearish"];
  const statuses = ["pending", "completed"];
  
  const targetType = targetTypes[Math.floor(Math.random() * targetTypes.length)];
  const targetName = targetType === "market" ? "S&P 500" : 
                    targetType === "sector" ? "Technology" : "Apple Inc.";
  const ticker = targetType === "market" ? "SPY" : 
                targetType === "sector" ? "XLK" : "AAPL";
  
  return {
    id: `pred-${Math.floor(Math.random() * 1000)}`,
    userId: "user-123",
    targetType,
    targetName,
    ticker,
    predictionType: "trend",
    userPrediction: directions[Math.floor(Math.random() * directions.length)],
    aiPrediction: directions[Math.floor(Math.random() * directions.length)],
    aiConfidence: Math.floor(Math.random() * 10) + 1,
    timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
    startingValue: Math.random() * 500 + 100,
    createdAt: new Date().toISOString(),
    resolvesAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  };
}

// Function to generate multiple random predictions
export function generateMultipleRandomPredictions(count: number) {
  const predictions = [];
  for (let i = 0; i < count; i++) {
    predictions.push(generateRandomPrediction());
  }
  return predictions;
}
