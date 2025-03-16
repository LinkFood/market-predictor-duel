
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
    <div className="animate-fade-in pb-12 space-y-6">
      {/* Header with welcome and action buttons */}
      <DashboardHeader user={currentUser} />

      {/* Global AI vs Humans battle stats - the gamification element */}
      <div className="app-card p-4">
        <GlobalBattleStats stats={mockGlobalStats} />
      </div>
      
      {/* Main dashboard content */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-8">
        {/* Stats cards - responsive cards that stack on mobile */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="app-card h-full p-4 focus-effect">
            <StatsCard currentUser={currentUser} userRank={userRank} />
          </div>
        </div>
        
        {/* Hot prediction opportunities - swiping cards on mobile */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="app-card h-full p-4 focus-effect">
            <HotOpportunities opportunities={hotOpportunities} />
          </div>
        </div>
        
        {/* Recent predictions */}
        <div className="md:col-span-2 lg:col-span-4">
          <div className="app-card h-full p-4 focus-effect">
            <RecentPredictions predictions={recentPredictions} />
          </div>
        </div>
        
        {/* Market overview - full width on all screens */}
        <div className="lg:col-span-full">
          <div className="app-card p-5 focus-effect">
            <MarketPulse marketData={mockMarketData} stockData={mockStockData} />
          </div>
        </div>
        
        {/* Performance chart - 2/3 width */}
        <div className="lg:col-span-5">
          <div className="app-card p-4 focus-effect">
            <PerformanceCard />
          </div>
        </div>
        
        {/* Top Performers Preview - 1/3 width */}
        <div className="lg:col-span-3">
          <div className="app-card p-4 focus-effect">
            <TopPerformers leaderboard={mockLeaderboard} />
          </div>
        </div>
      </div>
      
      {/* Floating action button - only visible on mobile */}
      <div className="fixed right-6 bottom-20 md:hidden z-10">
        <Link to="/app/predict">
          <button className="ios-button-primary h-14 w-14 shadow-lg">
            <TrendingUp className="h-6 w-6" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
