
import { 
  User, 
  Prediction, 
  LeaderboardEntry, 
  MarketData, 
  GlobalStats,
  PredictionDirection
} from "../types";

// Mock current user
export const currentUser: User = {
  id: "u1",
  username: "marketMaster",
  email: "user@example.com",
  avatarUrl: "",
  totalPredictions: 42,
  correctPredictions: 27,
  winsAgainstAi: 22,
  lossesAgainstAi: 15,
  ties: 5,
  currentStreak: 3,
  bestStreak: 7,
  points: 850,
  createdAt: "2023-10-15T12:00:00Z",
  lastLogin: "2023-12-01T09:30:00Z"
};

// Generate a random date in the future (1-30 days)
const randomFutureDate = () => {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
  return futureDate.toISOString();
};

// Generate a random past date (1-30 days ago)
const randomPastDate = () => {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30) - 1);
  return pastDate.toISOString();
};

// Mock predictions
export const mockPredictions: Prediction[] = [
  {
    id: "p1",
    userId: "u1",
    targetType: "market",
    targetName: "S&P 500",
    userPrediction: "bullish",
    aiPrediction: "bearish",
    aiConfidence: 7,
    aiAnalysis: {
      supporting: [
        "Strong corporate earnings reports",
        "Federal Reserve signaling pause in rate hikes",
        "Decreasing inflation data"
      ],
      counter: [
        "Geopolitical tensions rising",
        "Tech sector showing weakness",
        "Inverted yield curve suggesting recession risk"
      ],
      reasoning: "While there are positive economic indicators, recent technical analysis and market sentiment suggest a near-term correction is likely."
    },
    timeframe: "1w",
    startingValue: 4765.98,
    createdAt: randomPastDate(),
    resolvesAt: randomFutureDate(),
    resolved: false,
    status: "pending"
  },
  {
    id: "p2",
    userId: "u1",
    targetType: "sector",
    targetName: "Technology",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 8,
    aiAnalysis: {
      supporting: [
        "AI innovation driving tech valuations",
        "Strong consumer demand for new devices",
        "Recent correction making valuations more attractive"
      ],
      counter: [
        "Regulatory challenges in EU and US",
        "Supply chain constraints still present",
        "Rising interest rates pressuring growth stocks"
      ],
      reasoning: "The technology sector appears positioned for growth despite challenges, with AI and cloud computing driving significant revenue opportunities."
    },
    timeframe: "1m",
    startingValue: 2832.45,
    createdAt: "2023-11-20T14:30:00Z",
    resolvesAt: "2023-12-20T14:30:00Z",
    resolved: false,
    status: "pending"
  },
  {
    id: "p3",
    userId: "u1",
    targetType: "stock",
    targetName: "AAPL",
    userPrediction: "bearish",
    aiPrediction: "bullish",
    aiConfidence: 6,
    aiAnalysis: {
      supporting: [
        "Recent product launches below expectations",
        "Declining market share in key regions",
        "Production issues affecting supply"
      ],
      counter: [
        "Strong cash position and buyback program",
        "Services revenue growing consistently",
        "Loyal customer base with high retention"
      ],
      reasoning: "While there are short-term challenges, Apple's ecosystem and services growth provide resilience not fully appreciated by the market."
    },
    timeframe: "1d",
    startingValue: 187.65,
    createdAt: "2023-11-25T09:15:00Z",
    resolvesAt: "2023-11-26T09:15:00Z",
    resolved: true,
    finalValue: 191.24,
    percentChange: 1.91,
    actualResult: "bullish",
    winner: "ai",
    resolvedAt: "2023-11-26T09:15:00Z",
    status: "incorrect"
  },
  {
    id: "p4",
    userId: "u1",
    targetType: "market",
    targetName: "NASDAQ",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 9,
    aiAnalysis: {
      supporting: [
        "Tech earnings beating expectations",
        "Reduced inflation pressures",
        "Positive market sentiment from central bank policy"
      ],
      counter: [
        "Possible tech sector overvaluation",
        "Rising bond yields",
        "Increased regulatory scrutiny"
      ],
      reasoning: "Strong corporate earnings and improving macroeconomic conditions suggest continued upward movement for tech-heavy NASDAQ."
    },
    timeframe: "1w",
    startingValue: 14932.53,
    createdAt: "2023-11-18T10:00:00Z",
    resolvesAt: "2023-11-25T10:00:00Z",
    resolved: true,
    finalValue: 15982.01,
    percentChange: 7.03,
    actualResult: "bullish",
    winner: "both",
    resolvedAt: "2023-11-25T10:00:00Z",
    status: "correct"
  },
  {
    id: "p5",
    userId: "u1",
    targetType: "stock",
    targetName: "MSFT",
    userPrediction: "bullish",
    aiPrediction: "bullish",
    aiConfidence: 8,
    aiAnalysis: {
      supporting: [
        "Cloud business growing rapidly",
        "AI integration driving new product adoption",
        "Strong enterprise demand for Microsoft services"
      ],
      counter: [
        "Increasing competition in cloud space",
        "Potential economic slowdown affecting IT spending",
        "Regulatory challenges in EU markets"
      ],
      reasoning: "Microsoft's diversified business model and dominant position in enterprise software provide resilience and growth potential."
    },
    timeframe: "1m",
    startingValue: 378.92,
    createdAt: "2023-10-30T11:30:00Z",
    resolvesAt: "2023-11-30T11:30:00Z",
    resolved: true,
    finalValue: 395.18,
    percentChange: 4.29,
    actualResult: "bullish",
    winner: "both",
    resolvedAt: "2023-11-30T11:30:00Z",
    status: "correct"
  }
];

// Mock market data
export const mockMarketData: MarketData[] = [
  {
    name: "S&P 500",
    value: 4783.45,
    change: 28.32,
    changePercent: 0.59
  },
  {
    name: "NASDAQ",
    value: 16729.84,
    change: 185.92,
    changePercent: 1.12
  },
  {
    name: "Dow Jones",
    value: 38245.12,
    change: -48.76,
    changePercent: -0.13
  },
  {
    name: "Russell 2000",
    value: 2193.75,
    change: 12.63,
    changePercent: 0.58
  }
];

// Mock sector data
export const mockSectorData: MarketData[] = [
  {
    name: "Technology",
    value: 3265.47,
    change: 45.28,
    changePercent: 1.41
  },
  {
    name: "Healthcare",
    value: 1653.82,
    change: -12.36,
    changePercent: -0.74
  },
  {
    name: "Financials",
    value: 857.43,
    change: 2.18,
    changePercent: 0.25
  },
  {
    name: "Energy",
    value: 742.91,
    change: -8.53,
    changePercent: -1.14
  },
  {
    name: "Consumer Discretionary",
    value: 1423.65,
    change: 18.72,
    changePercent: 1.33
  }
];

// Mock popular stocks
export const mockStockData: MarketData[] = [
  {
    name: "AAPL",
    value: 191.45,
    change: 2.35,
    changePercent: 1.24
  },
  {
    name: "MSFT",
    value: 397.58,
    change: 5.82,
    changePercent: 1.49
  },
  {
    name: "GOOGL",
    value: 142.32,
    change: 1.87,
    changePercent: 1.33
  },
  {
    name: "AMZN",
    value: 176.76,
    change: 3.24,
    changePercent: 1.87
  },
  {
    name: "TSLA",
    value: 242.89,
    change: -3.45,
    changePercent: -1.40
  }
];

// Mock leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "u2",
    username: "stockGuru",
    avatarUrl: "",
    points: 1250,
    totalPredictions: 65,
    accuracy: 0.78,
    winRateAgainstAi: 0.68,
    rank: 1
  },
  {
    userId: "u3",
    username: "bullMarket",
    avatarUrl: "",
    points: 1120,
    totalPredictions: 58,
    accuracy: 0.76,
    winRateAgainstAi: 0.62,
    rank: 2
  },
  {
    userId: "u1",
    username: "marketMaster",
    avatarUrl: "",
    points: 850,
    totalPredictions: 42,
    accuracy: 0.64,
    winRateAgainstAi: 0.59,
    rank: 3
  },
  {
    userId: "u4",
    username: "tradingPro",
    avatarUrl: "",
    points: 780,
    totalPredictions: 40,
    accuracy: 0.65,
    winRateAgainstAi: 0.55,
    rank: 4
  },
  {
    userId: "u5",
    username: "investorElite",
    avatarUrl: "",
    points: 720,
    totalPredictions: 38,
    accuracy: 0.63,
    winRateAgainstAi: 0.53,
    rank: 5
  }
];

// Mock global stats
export const mockGlobalStats: GlobalStats = {
  totalPredictions: 12485,
  aiWins: 5872,
  humanWins: 6113,
  ties: 500,
  marketPredictions: 4562,
  sectorPredictions: 3821,
  stockPredictions: 4102
};

// Function to generate random prediction data for a specific target
export const generatePrediction = (
  targetType: 'market' | 'sector' | 'stock',
  targetName: string,
  timeframe: '1d' | '1w' | '1m',
  userPrediction: PredictionDirection
): Prediction => {
  // Generate random AI prediction and confidence
  const aiPrediction: PredictionDirection = Math.random() > 0.5 ? 'bullish' : 'bearish';
  const aiConfidence = Math.floor(Math.random() * 5) + 5; // 5-10 range
  
  // Random starting value based on target type
  let startingValue = 0;
  if (targetType === 'market') {
    startingValue = 4000 + Math.random() * 1000;
  } else if (targetType === 'sector') {
    startingValue = 1000 + Math.random() * 2000;
  } else {
    startingValue = 50 + Math.random() * 200;
  }
  
  // Generate supporting and counter arguments
  const bullishPoints = [
    "Recent positive earnings reports",
    "Technical indicators showing bullish pattern",
    "Favorable economic conditions",
    "Positive analyst sentiment",
    "Increased institutional buying"
  ];
  
  const bearishPoints = [
    "Signs of market overvaluation",
    "Technical indicators showing bearish pattern",
    "Economic headwinds developing",
    "Negative analyst revisions",
    "Institutional selling pressure"
  ];
  
  // Select random points based on the AI prediction
  const supporting = aiPrediction === 'bullish' 
    ? bullishPoints.sort(() => 0.5 - Math.random()).slice(0, 3)
    : bearishPoints.sort(() => 0.5 - Math.random()).slice(0, 3);
    
  const counter = aiPrediction === 'bullish'
    ? bearishPoints.sort(() => 0.5 - Math.random()).slice(0, 3)
    : bullishPoints.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Create reasoning based on AI prediction
  const reasoning = aiPrediction === 'bullish'
    ? `Based on technical and fundamental analysis, ${targetName} shows strong potential for upward movement in the ${timeframe === '1d' ? 'short' : timeframe === '1w' ? 'medium' : 'long'} term.`
    : `Analysis indicates ${targetName} may face downward pressure in the ${timeframe === '1d' ? 'short' : timeframe === '1w' ? 'medium' : 'long'} term due to several concerning factors.`;
  
  return {
    id: `p${Math.floor(Math.random() * 10000)}`,
    userId: "u1",
    targetType,
    targetName,
    userPrediction,
    aiPrediction,
    aiConfidence,
    aiAnalysis: {
      supporting,
      counter,
      reasoning
    },
    timeframe,
    startingValue: Math.round(startingValue * 100) / 100,
    createdAt: new Date().toISOString(),
    resolvesAt: randomFutureDate(),
    resolved: false,
    status: "pending"
  };
};
