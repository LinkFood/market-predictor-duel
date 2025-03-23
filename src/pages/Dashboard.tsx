
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentPredictionsSection from "@/components/dashboard/RecentPredictionsSection";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import GlobalBattleStats from "@/components/dashboard/GlobalBattleStats";
import MarketPulse from "@/components/dashboard/MarketPulse";
import HotOpportunities from "@/components/dashboard/HotOpportunities";
import ActiveBrackets from "@/components/dashboard/ActiveBrackets";
import TopPerformers from "@/components/dashboard/TopPerformers";
import CommunityStats from "@/components/dashboard/CommunityStats";
import { GlobalStats, Prediction, MarketData, User } from "@/types";
import { mockPredictions, mockStockData, mockGlobalStats, mockLeaderboard } from "@/data/mockData";
import { Bracket, Direction } from "@/lib/duel/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getUserPredictions, getUserStats, getLeaderboard } from "@/lib/prediction";
import { Trophy } from "lucide-react";
import { adaptPrediction } from "@/lib/prediction/prediction-adapter";

const mockBrackets: Bracket[] = [
  {
    id: "bracket-1",
    name: "Weekly Tech Face-off",
    status: "active" as const,
    aiPersonality: "ValueHunter" as const,
    timeframe: "weekly" as const,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    size: 3 as const,
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
    status: "pending" as const,
    aiPersonality: "GrowthSeeker" as const,
    timeframe: "monthly" as const,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
    size: 3 as const,
    userEntries: [],
    aiEntries: [],
    matches: [],
    createdAt: new Date().toISOString(),
    userPoints: 0,
    aiPoints: 0
  }
];

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
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>(mockPredictions);
  const [userRank, setUserRank] = useState<number>(42);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
          return;
        }
        
        const predictions = await getUserPredictions();
        const adaptedPredictions = predictions.slice(0, 3).map(adaptPrediction);
        setRecentPredictions(adaptedPredictions);
        
        const leaderboard = await getLeaderboard();
        
        if (userData && userData.user) {
          // Changed rank to position which exists in LeaderboardEntry
          const currentUserRank = leaderboard.find(item => item.userId === userData.user.id)?.position || 0;
          setUserRank(currentUserRank);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Could not load your data. Please try again later.");
        toast.error("Error loading data. Could not load your data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchUserData().catch(() => setIsLoading(false));
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const marketData: MarketData[] = mockStockData.map(stock => ({
    name: stock.name,
    symbol: stock.symbol,
    value: stock.price,
    change: stock.change,
    changePercent: stock.changePercent
  }));

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
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      <DashboardHeader user={mockUser} />
      
      <div className="flex justify-center my-8">
        <Link 
          to="/app/brackets/create" 
          className="btn-primary btn-lg flex items-center gap-2 animated-pulse-shadow py-3 px-6 text-lg shadow-xl"
        >
          <Trophy className="h-5 w-5" />
          Start New Duel
        </Link>
      </div>
      
      <div className="mb-8">
        <ActiveBrackets brackets={mockBrackets} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-8">
          <RecentPredictionsSection predictions={recentPredictions} />
          <UserStatsSection userRank={userRank} />
        </div>
        <div className="space-y-8">
          <GlobalBattleStats stats={mockGlobalStats} />
          <MarketPulse marketData={marketData} stockData={marketData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <HotOpportunities opportunities={mockOpportunities} />
        </div>
        <div>
          <TopPerformers />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          {/* Additional content can go here in the future */}
        </div>
        <div>
          <CommunityStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
