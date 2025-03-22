
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Sparkles, Clock, Zap, CalendarIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mockMarketData, mockGlobalStats } from "@/data/mockData";
import useAnimations from "@/hooks/useAnimations";
import { getUserPredictions, getUserStats, getLeaderboard } from "@/lib/prediction";
import { Prediction, LeaderboardEntry } from "@/lib/prediction/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Component imports
import AlertBanner from "@/components/dashboard/AlertBanner";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import AiVsHumansBattle from "@/components/dashboard/AiVsHumansBattle";
import TopMarkets from "@/components/dashboard/TopMarkets";
import PredictionOpportunities from "@/components/dashboard/PredictionOpportunities";
import RecentPredictionsSection from "@/components/dashboard/RecentPredictionsSection";
import CommunityStats from "@/components/dashboard/CommunityStats";
import AIPredictionInsights from "@/components/dashboard/AIPredictionInsights";

// Dashboard Component
const Dashboard: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true);
  const { containerVariants, itemVariants } = useAnimations();
  
  // State for real data
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user predictions
        const predictions = await getUserPredictions();
        setRecentPredictions(predictions.slice(0, 3));
        
        // Get leaderboard to determine user rank
        const leaderboard = await getLeaderboard();
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const currentUserRank = leaderboard.find(item => item.userId === userData.user.id)?.rank || 0;
          setUserRank(currentUserRank);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Generate opportunities with smart suggestions
  const opportunities = [
    { 
      name: "NVIDIA",  
      symbol: "NVDA", 
      type: "Stock",
      confidence: 89, 
      trend: 'up' as const, 
      reason: "Earnings release tomorrow",
      aiSentiment: "Strongly Bullish",
      icon: <Sparkles className="h-4 w-4 text-[hsl(var(--warning))]" />
    },
    { 
      name: "S&P 500", 
      symbol: "SPY", 
      type: "Index",
      confidence: 76, 
      trend: 'down' as const, 
      reason: "Fed announcement impact",
      aiSentiment: "Bearish",
      icon: <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
    },
    { 
      name: "Bitcoin", 
      symbol: "BTC", 
      type: "Crypto",
      confidence: 83, 
      trend: 'up' as const, 
      reason: "Technical breakout pattern",
      aiSentiment: "Bullish",
      icon: <Zap className="h-4 w-4 text-[hsl(var(--success))]" />
    },
    { 
      name: "Retail ETF", 
      symbol: "XRT", 
      type: "Sector",
      confidence: 71, 
      trend: 'up' as const, 
      reason: "Consumer data release",
      aiSentiment: "Moderately Bullish",
      icon: <CalendarIcon className="h-4 w-4 text-[hsl(var(--primary))]" />
    }
  ];

  return (
    <>
      {/* Main page content with animation */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-1 pb-10 space-y-6 max-w-md mx-auto"
      >
        {/* Alert banner */}
        <AnimatePresence>
          {showAlert && <AlertBanner onDismiss={() => setShowAlert(false)} />}
        </AnimatePresence>
        
        {/* User Stats Section */}
        <motion.div variants={itemVariants}>
          <UserStatsSection userRank={userRank} />
        </motion.div>
        
        {/* AI vs Humans Battle Stats */}
        <motion.div variants={itemVariants}>
          <AiVsHumansBattle stats={mockGlobalStats} />
        </motion.div>
        
        {/* Market Overview */}
        <motion.div variants={itemVariants}>
          <TopMarkets markets={mockMarketData} />
        </motion.div>
        
        {/* Market Opportunities */}
        <motion.div variants={itemVariants}>
          <PredictionOpportunities opportunities={opportunities} />
        </motion.div>
      
        {/* Recent Predictions */}
        <motion.div variants={itemVariants}>
          <RecentPredictionsSection predictions={recentPredictions} />
        </motion.div>
        
        {/* Community Stats */}
        <motion.div variants={itemVariants}>
          <CommunityStats />
        </motion.div>
        
        {/* AI Learning Insights */}
        <motion.div variants={itemVariants}>
          <AIPredictionInsights />
        </motion.div>
      </motion.div>

      {/* Floating Action Button */}
      <Link to="/app/predict" className="fab right-6 bottom-24">
        <TrendingUp className="h-6 w-6" />
      </Link>
    </>
  );
};

export default Dashboard;
