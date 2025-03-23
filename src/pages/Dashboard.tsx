
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentPredictionsSection from "@/components/dashboard/RecentPredictionsSection";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import GlobalBattleStats from "@/components/dashboard/GlobalBattleStats";
import MarketPulse from "@/components/dashboard/MarketPulse";
import HotOpportunities from "@/components/dashboard/HotOpportunities";
import ActiveBrackets from "@/components/dashboard/ActiveBrackets";
import { GlobalStats, Prediction, MarketData, User } from "@/types";
import { mockPredictions, mockStockData, mockGlobalStats } from "@/data/mockData";
import { Bracket, Direction } from "@/lib/duel/types";

// Create mocked brackets with fully typed data
const mockBrackets: Bracket[] = [
  {
    id: "bracket-1",
    name: "Weekly Tech Face-off",
    status: "active",
    aiPersonality: "ValueHunter",
    timeframe: "weekly",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    size: 3,
    userEntries: [],
    aiEntries: [],
    matches: [],
    createdAt: new Date().toISOString(),
    userPoints: 0,
    aiPoints: 0
  },
  {
    id: "bracket-2",
    name: "Monthly Growth Stars",
    status: "pending",
    aiPersonality: "GrowthSeeker",
    timeframe: "monthly",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    size: 3,
    userEntries: [],
    aiEntries: [],
    matches: [],
    createdAt: new Date().toISOString(),
    userPoints: 0,
    aiPoints: 0
  }
];

// Define Opportunity type for HotOpportunities component
interface Opportunity {
  symbol: string;
  name: string;
  sector: string;
  signal: string;
  confidence: number;
  timeframe: string;
  description: string;
  movement: "bullish" | "bearish" | "volatile";
  icon: string;
}

// Mock opportunities data with required fields
const mockOpportunities: Opportunity[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    signal: "bullish",
    confidence: 0.85,
    timeframe: "1w",
    description: "Strong technical indicators",
    movement: "bullish",
    icon: "trending-up"
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    signal: "bullish",
    confidence: 0.92,
    timeframe: "1w",
    description: "Earnings beat expectations",
    movement: "bullish",
    icon: "trending-up"
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financial Services",
    signal: "bearish",
    confidence: 0.78,
    timeframe: "1w",
    description: "Sector facing headwinds",
    movement: "bearish",
    icon: "trending-down"
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock user rank data - using number
  const userRank = 42;

  // Convert mockStockData to MarketData format
  const marketData: MarketData[] = mockStockData.map(stock => ({
    name: stock.name,
    symbol: stock.symbol,
    value: stock.price,
    change: stock.change,
    changePercent: stock.changePercent
  }));

  // Create a mock user with required properties
  const mockUser: User = {
    id: user?.id || "mock-user-id",
    username: user?.username || "Guest User",
    totalPredictions: 42,
    correctPredictions: 28,
    winsAgainstAi: 25,
    lossesAgainstAi: 15,
    ties: 2,
    currentStreak: 3,
    bestStreak: 7,
    points: 350,
    createdAt: new Date().toISOString(),
    email: user?.email || "guest@example.com",
    avatarUrl: user?.avatarUrl
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <DashboardHeader user={mockUser} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          <RecentPredictionsSection predictions={mockPredictions as Prediction[]} />
          <UserStatsSection userRank={userRank} />
        </div>
        <div className="space-y-6">
          <GlobalBattleStats stats={mockGlobalStats} />
          <MarketPulse marketData={marketData} stockData={mockStockData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <HotOpportunities opportunities={mockOpportunities} />
        <ActiveBrackets brackets={mockBrackets} />
      </div>
    </div>
  );
};

export default Dashboard;
