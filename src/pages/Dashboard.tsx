
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
import { GlobalStats } from "@/types";

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

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          <RecentPredictionsSection />
          <UserStatsSection />
        </div>
        <div className="space-y-6">
          <GlobalBattleStats stats={mockGlobalStats} />
          <MarketPulse />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <HotOpportunities />
        <ActiveBrackets />
      </div>
    </div>
  );
};

export default Dashboard;
