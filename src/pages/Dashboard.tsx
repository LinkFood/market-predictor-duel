
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
import { GlobalStats, Prediction, MarketData } from "@/types";
import { mockPredictions, mockStockData } from "@/data/mockData";

// Mock global stats for dashboard
const mockGlobalStats: GlobalStats = {
  totalPredictions: 124823,
  aiWins: 58932,
  humanWins: 61284,
  ties: 4607,
  marketPredictions: 34278,
  sectorPredictions: 29871,
  stockPredictions: 60674
};

// Mock market data
const mockMarketDataList: MarketData[] = mockStockData.map(stock => ({
  name: stock.name,
  symbol: stock.symbol || stock.name.substring(0, 4).toUpperCase(),
  value: stock.price || 150,
  change: (stock.price || 150) * (stock.changePercent / 100),
  changePercent: stock.changePercent
}));

// Mock user rank data
const mockUserRank = {
  rank: 42,
  total: 1250,
  percentile: 3.36
};

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

  // Mock bracket data
  const mockBrackets = [
    {
      id: "bracket-1",
      name: "Weekly Tech Face-off",
      status: "active",
      aiPersonality: "ValueHunter",
      timeframe: "weekly",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "bracket-2",
      name: "Monthly Growth Stars",
      status: "pending",
      aiPersonality: "GrowthSeeker",
      timeframe: "monthly",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Mock opportunities data
  const mockOpportunities = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      signal: "bullish",
      confidence: 0.85,
      timeframe: "1w"
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      sector: "Technology",
      signal: "bullish",
      confidence: 0.92,
      timeframe: "1w"
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase & Co.",
      sector: "Financial Services",
      signal: "bearish",
      confidence: 0.78,
      timeframe: "1w"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <DashboardHeader user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          <RecentPredictionsSection predictions={mockPredictions as Prediction[]} />
          <UserStatsSection userRank={mockUserRank} />
        </div>
        <div className="space-y-6">
          <GlobalBattleStats stats={mockGlobalStats} />
          <MarketPulse marketData={mockMarketDataList} stockData={mockStockData} />
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
