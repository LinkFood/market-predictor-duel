
import React from "react";
import { Sparkles, Clock, Calendar } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import GlobalBattleStats from "@/components/dashboard/GlobalBattleStats";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentPredictions from "@/components/dashboard/RecentPredictions";
import MarketPulse from "@/components/dashboard/MarketPulse";
import HotOpportunities from "@/components/dashboard/HotOpportunities";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopPerformers from "@/components/dashboard/TopPerformers";
import { mockMarketData, mockPredictions, mockStockData, currentUser, mockGlobalStats, mockLeaderboard } from "@/data/mockData";

const Dashboard: React.FC = () => {
  const recentPredictions = mockPredictions.slice(0, 3);
  
  // Find user rank on the leaderboard
  const userRank = mockLeaderboard.find(item => item.userId === currentUser.id)?.rank;
  
  // Hot prediction opportunities
  const hotOpportunities = [
    { 
      name: "NVIDIA (NVDA)", 
      description: "Earnings tomorrow", 
      confidence: 89, 
      movement: "volatile" as const,
      icon: <Sparkles className="h-4 w-4 text-amber-500" /> 
    },
    { 
      name: "S&P 500", 
      description: "Fed announcement", 
      confidence: 76, 
      movement: "bearish" as const,
      icon: <Clock className="h-4 w-4 text-sky-500" /> 
    },
    { 
      name: "Retail Sector", 
      description: "Consumer data release", 
      confidence: 82, 
      movement: "bullish" as const,
      icon: <Calendar className="h-4 w-4 text-emerald-500" /> 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header with welcome and action buttons */}
      <DashboardHeader user={currentUser} />

      {/* Global AI vs Humans battle stats */}
      <GlobalBattleStats stats={mockGlobalStats} />
      
      {/* Stats cards */}
      <StatsCard currentUser={currentUser} userRank={userRank} />

      {/* Main dashboard layout */}
      <div className="grid gap-5 lg:grid-cols-4">
        {/* Main content - 3/4 width on large screens */}
        <div className="lg:col-span-3 space-y-5">
          {/* Market overview card */}
          <MarketPulse marketData={mockMarketData} stockData={mockStockData} />
          
          {/* Performance chart */}
          <PerformanceCard />
          
          {/* Top Performers Preview */}
          <TopPerformers leaderboard={mockLeaderboard} />
        </div>

        {/* Sidebar content - 1/4 width on large screens */}
        <div className="lg:col-span-1 space-y-5">
          {/* Recent predictions */}
          <RecentPredictions predictions={recentPredictions} />
          
          {/* Hot prediction opportunities */}
          <HotOpportunities opportunities={hotOpportunities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
