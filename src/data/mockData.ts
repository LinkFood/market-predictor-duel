export const mockMarketData = [
  {
    name: "S&P 500",
    value: 4393.63,
    change: 27.37,
    changePercent: 0.63
  },
  {
    name: "Nasdaq",
    value: 13638.59,
    change: 128.41,
    changePercent: 0.95
  },
  {
    name: "Dow Jones",
    value: 34212.24,
    change: 183.56,
    changePercent: 0.54
  },
  {
    name: "Russell 2000",
    value: 1854.21,
    change: 12.87,
    changePercent: 0.70
  },
  {
    name: "VIX",
    value: 16.85,
    change: -0.52,
    changePercent: -3.00
  }
];

export const mockLeaderboard = [
  {
    userId: "user-001",
    username: "MarketMaster",
    avatarUrl: "/avatars/avatar-1.jpg",
    points: 12450,
    totalPredictions: 142,
    accuracy: 0.78,
    winRateAgainstAi: 0.65,
    rank: 1
  },
  {
    userId: "user-002",
    username: "TradingPro",
    avatarUrl: "/avatars/avatar-2.jpg",
    points: 10820,
    totalPredictions: 119,
    accuracy: 0.72,
    winRateAgainstAi: 0.61,
    rank: 2
  },
  {
    userId: "user-003",
    username: "StockWhisperer",
    avatarUrl: "/avatars/avatar-3.jpg",
    points: 9760,
    totalPredictions: 103,
    accuracy: 0.75,
    winRateAgainstAi: 0.58,
    rank: 3
  },
  {
    userId: "user-004",
    username: "BullishBeliever",
    avatarUrl: "/avatars/avatar-4.jpg",
    points: 8940,
    totalPredictions: 98,
    accuracy: 0.68,
    winRateAgainstAi: 0.55,
    rank: 4
  },
  {
    userId: "user-005",
    username: "MarketMaven",
    avatarUrl: "/avatars/avatar-5.jpg",
    points: 7820,
    totalPredictions: 87,
    accuracy: 0.71,
    winRateAgainstAi: 0.52,
    rank: 5
  }
];

export const mockStockData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 173.45,
    change: 2.21,
    changePercent: 1.29,
    marketCap: 2700000000000,
    volume: 56789000,
    pe: 28.2,
    high52Week: 179.64,
    low52Week: 124.17,
    avgVolume: 62345000,
    yield: 0.006,
    beta: 1.21,
    datetime: new Date().toISOString(),
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp",
    price: 338.11,
    change: 3.57,
    changePercent: 1.07,
    marketCap: 2500000000000,
    volume: 34567000,
    pe: 36.5,
    high52Week: 349.67,
    low52Week: 211.43,
    avgVolume: 32109000,
    yield: 0.008,
    beta: 0.98,
    datetime: new Date().toISOString(),
    sector: "Technology"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc",
    price: 131.94,
    change: 1.29,
    changePercent: 0.99,
    marketCap: 1300000000000,
    volume: 45678000,
    pe: 98.7,
    high52Week: 146.57,
    low52Week: 81.30,
    avgVolume: 78912000,
    yield: null,
    beta: 1.15,
    datetime: new Date().toISOString(),
    sector: "Consumer Discretionary"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc",
    price: 131.86,
    change: 1.74,
    changePercent: 1.34,
    marketCap: 1600000000000,
    volume: 23456000,
    pe: 25.4,
    high52Week: 132.39,
    low52Week: 83.34,
    avgVolume: 21098000,
    yield: null,
    beta: 1.05,
    datetime: new Date().toISOString(),
    sector: "Technology"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc",
    price: 183.25,
    change: -4.34,
    changePercent: -2.31,
    marketCap: 600000000000,
    volume: 67890000,
    pe: 67.8,
    high52Week: 314.67,
    low52Week: 101.81,
    avgVolume: 89012000,
    yield: null,
    beta: 1.87,
    datetime: new Date().toISOString(),
    sector: "Consumer Discretionary"
  }
];

export const mockPredictions = [
  {
    id: "pred-001",
    userId: "user-001",
    targetType: "stock",
    targetName: "Apple Inc.",
    ticker: "AAPL",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 0.75,
    aiAnalysis: {
      supporting: ["Strong earnings", "New product launch"],
      counter: ["Market volatility"],
      reasoning: "Based on recent performance and upcoming events."
    },
    timeframe: "1w",
    startingValue: 170.50,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    resolvesAt: new Date(Date.now() + 604800000).toISOString(),
    status: "pending",
    stockName: "Apple Inc.",
    startPrice: 170.50,
    endPrice: 175.00,
    user_prediction: "bullish",
    ai_prediction: "bullish",
    ai_confidence: 0.75,
    target_name: "Apple Inc.",
    starting_value: 170.50,
    final_value: 175.00,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    resolved_at: new Date(Date.now() + 604800000).toISOString(),
    prediction_type: "trend"
  },
  {
    id: "pred-002",
    userId: "user-002",
    targetType: "market",
    targetName: "S&P 500",
    ticker: "SPX",
    predictionType: "trend",
    userPrediction: "bearish",
    aiPrediction: "bearish",
    aiConfidence: 0.60,
    aiAnalysis: {
      supporting: ["Rising interest rates", "Inflation concerns"],
      counter: ["Strong employment data"],
      reasoning: "Economic indicators suggest a potential downturn."
    },
    timeframe: "1m",
    startingValue: 4400.00,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    resolvesAt: new Date(Date.now() + 2592000000).toISOString(),
    status: "pending",
    stockName: "S&P 500",
    startPrice: 4400.00,
    endPrice: 4350.00,
    user_prediction: "bearish",
    ai_prediction: "bearish",
    ai_confidence: 0.60,
    target_name: "S&P 500",
    starting_value: 4400.00,
    final_value: 4350.00,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    resolved_at: new Date(Date.now() + 2592000000).toISOString(),
    prediction_type: "trend"
  },
  {
    id: "pred-003",
    userId: "user-001",
    targetType: "stock",
    targetName: "Tesla Inc.",
    ticker: "TSLA",
    predictionType: "price",
    userPrediction: "bullish",
    aiPrediction: "bearish",
    aiConfidence: 0.80,
    aiAnalysis: {
      supporting: ["Production increase", "New Gigafactory"],
      counter: ["Competition", "Supply chain issues"],
      reasoning: "Despite challenges, Tesla's growth potential remains high."
    },
    timeframe: "1w",
    startingValue: 180.00,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    resolvesAt: new Date(Date.now() + 604800000).toISOString(),
    status: "pending",
    stockName: "Tesla Inc.",
    startPrice: 180.00,
    endPrice: 185.00,
    user_prediction: "bullish",
    ai_prediction: "bearish",
    ai_confidence: 0.80,
    target_name: "Tesla Inc.",
    starting_value: 180.00,
    final_value: 185.00,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    resolved_at: new Date(Date.now() + 604800000).toISOString(),
    prediction_type: "price"
  },
  {
    id: "pred-004",
    userId: "user-003",
    targetType: "sector",
    targetName: "Technology",
    ticker: "XLK",
    predictionType: "trend",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 0.65,
    aiAnalysis: {
      supporting: ["Innovation", "Digital transformation"],
      counter: ["Regulatory scrutiny"],
      reasoning: "The tech sector continues to drive market growth."
    },
    timeframe: "1m",
    startingValue: 150.00,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    resolvesAt: new Date(Date.now() + 2592000000).toISOString(),
    status: "pending",
    stockName: "Technology",
    startPrice: 150.00,
    endPrice: 155.00,
    user_prediction: "bullish",
    ai_prediction: "bullish",
    ai_confidence: 0.65,
    target_name: "Technology",
    starting_value: 150.00,
    final_value: 155.00,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    resolved_at: new Date(Date.now() + 2592000000).toISOString(),
    prediction_type: "trend"
  },
  {
    id: "pred-005",
    userId: "user-002",
    targetType: "stock",
    targetName: "Microsoft Corp",
    ticker: "MSFT",
    predictionType: "price",
    userPrediction: "bearish",
    aiPrediction: "bullish",
    aiConfidence: 0.70,
    aiAnalysis: {
      supporting: ["High valuation", "Market correction"],
      counter: ["Cloud growth"],
      reasoning: "A market correction could impact high-value stocks."
    },
    timeframe: "1w",
    startingValue: 340.00,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    resolvesAt: new Date(Date.now() + 604800000).toISOString(),
    status: "pending",
    stockName: "Microsoft Corp",
    startPrice: 340.00,
    endPrice: 335.00,
    user_prediction: "bearish",
    ai_prediction: "bullish",
    ai_confidence: 0.70,
    target_name: "Microsoft Corp",
    starting_value: 340.00,
    final_value: 335.00,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    resolved_at: new Date(Date.now() + 604800000).toISOString(),
    prediction_type: "price"
  }
];

// Function to create a mock bracket
export function createMockBracket(
  timeframe: any,
  size: any,
  entries: any[],
  aiPersonality: any = "MomentumTrader"
): any {
  const now = new Date();
  const endDate = new Date();
  
  if (timeframe === "daily") {
    endDate.setDate(now.getDate() + 1);
  } else if (timeframe === "weekly") {
    endDate.setDate(now.getDate() + 7);
  } else {
    endDate.setDate(now.getDate() + 30);
  }
  
  // Create user entries from the provided entries
  const userEntries = entries.map((entry, index) => ({
    id: `user-entry-${index + 1}`,
    symbol: entry.symbol,
    name: entry.symbol, // We don't have the name in the input
    entryType: "stock",
    direction: entry.direction,
    startPrice: 100 + Math.random() * 200, // Random price
    marketCap: "large",
    sector: "Technology", // Default sector
    order: index + 1
  }));
  
  // Create AI entries (random stocks)
  const aiEntries = Array.from({ length: size }).map((_, index) => ({
    id: `ai-entry-${index + 1}`,
    symbol: ["GOOG", "MSFT", "AMZN", "META", "TSLA", "NVDA", "AMD", "INTC", "IBM", "ORCL"][index % 10],
    name: ["Google", "Microsoft", "Amazon", "Meta", "Tesla", "NVIDIA", "AMD", "Intel", "IBM", "Oracle"][index % 10],
    entryType: "stock",
    direction: Math.random() > 0.5 ? "bullish" : "bearish",
    startPrice: 100 + Math.random() * 200,
    marketCap: "large",
    sector: "Technology",
    order: index + 1
  }));
  
  // Create initial matches
  const matches = [];
  for (let i = 0; i < size; i++) {
    matches.push({
      id: `match-${i + 1}`,
      roundNumber: 1,
      matchNumber: i + 1,
      entry1Id: userEntries[i].id,
      entry2Id: aiEntries[i].id,
      completed: false
    });
  }
  
  return {
    id: `bracket-${Date.now()}`,
    userId: "user-123",
    name: `${aiPersonality} Bracket`,
    timeframe: timeframe,
    size: size,
    status: "pending",
    aiPersonality: aiPersonality,
    userEntries: userEntries,
    aiEntries: aiEntries,
    matches: matches,
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    createdAt: now.toISOString(),
    userPoints: 0,
    aiPoints: 0
  };
}
