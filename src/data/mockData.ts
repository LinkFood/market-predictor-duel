export const mockStockData = [
  {
    name: "S&P 500",
    value: 4393.63,
    change: 27.37,
    changePercent: 0.63,
    symbol: "SPY"
  },
  {
    name: "Nasdaq",
    value: 13638.59,
    change: 128.41,
    changePercent: 0.95,
    symbol: "QQQ"
  },
  {
    name: "Dow Jones",
    value: 34212.24,
    change: 183.56,
    changePercent: 0.54,
    symbol: "DIA"
  },
  {
    name: "Russell 2000",
    value: 1854.21,
    change: 12.87,
    changePercent: 0.70,
    symbol: "IWM"
  },
  {
    name: "VIX",
    value: 16.85,
    change: -0.52,
    changePercent: -3.00,
    symbol: "VIX"
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

export function generateMultipleRandomPredictions(count: number) {
  const predictions = [];
  for (let i = 0; i < count; i++) {
    predictions.push(generateRandomPrediction());
  }
  return predictions;
}

export const mockBrackets = [
  {
    id: "bracket-001",
    userId: "user-123",
    name: "Weekly Tech Competition",
    timeframe: "weekly",
    size: 3,
    status: "active",
    aiPersonality: "MomentumTrader",
    userEntries: [
      {
        id: "entry-001",
        symbol: "AAPL",
        name: "Apple Inc.",
        entryType: "stock",
        direction: "bullish",
        startPrice: 173.45,
        marketCap: "large",
        sector: "Technology",
        order: 1
      },
      {
        id: "entry-002",
        symbol: "MSFT",
        name: "Microsoft Corporation",
        entryType: "stock",
        direction: "bullish",
        startPrice: 310.65,
        marketCap: "large",
        sector: "Technology",
        order: 2
      },
      {
        id: "entry-003",
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        entryType: "stock",
        direction: "bullish",
        startPrice: 120.00,
        marketCap: "large",
        sector: "Technology",
        order: 3
      }
    ],
    aiEntries: [
      {
        id: "entry-004",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        entryType: "stock",
        direction: "bullish",
        startPrice: 420.00,
        marketCap: "large",
        sector: "Technology",
        order: 1
      },
      {
        id: "entry-005",
        symbol: "AMD",
        name: "Advanced Micro Devices, Inc.",
        entryType: "stock",
        direction: "bearish",
        startPrice: 110.25,
        marketCap: "large",
        sector: "Technology",
        order: 2
      },
      {
        id: "entry-006",
        symbol: "INTC",
        name: "Intel Corporation",
        entryType: "stock",
        direction: "bearish",
        startPrice: 32.50,
        marketCap: "large",
        sector: "Technology",
        order: 3
      }
    ],
    matches: [
      {
        id: "match-001",
        roundNumber: 1,
        matchNumber: 1,
        entry1Id: "entry-001",
        entry2Id: "entry-004",
        completed: false
      },
      {
        id: "match-002",
        roundNumber: 1,
        matchNumber: 2,
        entry1Id: "entry-002",
        entry2Id: "entry-005",
        completed: false
      },
      {
        id: "match-003",
        roundNumber: 1,
        matchNumber: 3,
        entry1Id: "entry-003",
        entry2Id: "entry-006",
        completed: false
      }
    ],
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userPoints: 0,
    aiPoints: 0
  },
  {
    id: "bracket-002",
    userId: "user-123",
    name: "Monthly Market Competition",
    timeframe: "monthly",
    size: 6,
    status: "pending",
    aiPersonality: "ValueHunter",
    userEntries: [
      {
        id: "entry-007",
        symbol: "SPY",
        name: "S&P 500 ETF",
        entryType: "etf",
        direction: "bullish",
        startPrice: 430.00,
        marketCap: "large",
        sector: "Market Index",
        order: 1
      },
      {
        id: "entry-008",
        symbol: "QQQ",
        name: "Nasdaq ETF",
        entryType: "etf",
        direction: "bullish",
        startPrice: 360.00,
        marketCap: "large",
        sector: "Market Index",
        order: 2
      }
    ],
    aiEntries: [],
    matches: [],
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userPoints: 0,
    aiPoints: 0
  }
];

export function createMockBracket(timeframe, size, entries, aiPersonality = "MomentumTrader") {
  const bracketId = `bracket-${Math.floor(Math.random() * 1000)}`;
  
  const userEntries = entries.map((entry, index) => ({
    id: `entry-user-${index}`,
    symbol: entry.symbol,
    name: `${entry.symbol} Inc.`,
    entryType: "stock",
    direction: entry.direction,
    startPrice: Math.random() * 500 + 50,
    marketCap: "large",
    sector: "Technology",
    order: index + 1
  }));
  
  const aiEntries = Array(size).fill(null).map((_, index) => {
    const mockSymbols = ["NVDA", "AMZN", "GOOG", "FB", "NFLX", "TSLA", "DIS", "PYPL", "CRM"];
    return {
      id: `entry-ai-${index}`,
      symbol: mockSymbols[index % mockSymbols.length],
      name: `${mockSymbols[index % mockSymbols.length]} Inc.`,
      entryType: "stock",
      direction: Math.random() > 0.5 ? "bullish" : "bearish",
      startPrice: Math.random() * 500 + 50,
      marketCap: "large",
      sector: "Technology",
      order: index + 1
    };
  });
  
  const matches = [];
  for (let i = 0; i < size; i++) {
    matches.push({
      id: `match-${i}`,
      roundNumber: 1,
      matchNumber: i + 1,
      entry1Id: userEntries[i]?.id,
      entry2Id: aiEntries[i]?.id,
      completed: false
    });
  }
  
  return {
    id: bracketId,
    userId: "user-123",
    name: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Competition`,
    timeframe,
    size,
    status: "pending",
    aiPersonality,
    userEntries,
    aiEntries,
    matches,
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (timeframe === "daily" ? 1 : timeframe === "weekly" ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    userPoints: 0,
    aiPoints: 0
  };
}
