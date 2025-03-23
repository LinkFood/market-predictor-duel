import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Sparkles, Clock, Zap, CalendarIcon, Shuffle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mockGlobalStats } from "@/data/mockData";
import useAnimations from "@/hooks/useAnimations";
import { getUserPredictions, getUserStats, getLeaderboard } from "@/lib/prediction";
import { Prediction, LeaderboardEntry } from "@/lib/prediction/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Feature components
import AlertBanner from "@/components/dashboard/AlertBanner";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import AiVsHumansBattle from "@/components/dashboard/AiVsHumansBattle";
import TopMarkets from "@/components/dashboard/TopMarkets";
import PredictionOpportunities from "@/components/dashboard/PredictionOpportunities";
import RecentPredictionsSection from "@/components/dashboard/RecentPredictionsSection";
import CommunityStats from "@/components/dashboard/CommunityStats";
import AIPredictionInsights from "@/components/dashboard/AIPredictionInsights";
import ActiveBrackets from "@/components/dashboard/ActiveBrackets";

// Dashboard Component
const Dashboard: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true);
  const { containerVariants, itemVariants } = useAnimations();
  
  // State for real data
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);
  const [activeBrackets, setActiveBrackets] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch real user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData || !userData.user) {
          return;
        }
        
        // Get user predictions
        const predictions = await getUserPredictions();
        setRecentPredictions(predictions.slice(0, 3));
        
        // Get leaderboard to determine user rank
        const leaderboard = await getLeaderboard();
        
        if (userData && userData.user) {
          const currentUserRank = leaderboard.find(item => item.userId === userData.user.id)?.rank || 0;
          setUserRank(currentUserRank);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Could not load your data. Please try again later.");
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible" 
      className="space-y-4"
    >
      {/* Alert banner */}
      <AnimatePresence>
        {showAlert && <AlertBanner onDismiss={() => setShowAlert(false)} />}
      </AnimatePresence>
      
      {/* User Stats Summary */}
      <motion.div variants={itemVariants}>
        <UserStatsSection userRank={userRank} />
      </motion.div>
      
      {/* Feature Tabs - Mobile First Design */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="brackets">AI Battles</TabsTrigger>
          </TabsList>
          
          {/* Predictions Tab Content */}
          <TabsContent value="predictions" className="space-y-4 mt-0">
            {/* Top Market Movers - Always Visible for Context */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <TopMarkets />
              </CardContent>
            </Card>
            
            {/* Opportunities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Prediction Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <PredictionOpportunities opportunities={opportunities} />
              </CardContent>
            </Card>
            
            {/* Recent Predictions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RecentPredictionsSection predictions={recentPredictions} />
              </CardContent>
            </Card>
            
            {/* AI Learning Insights */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">AI Prediction Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <AIPredictionInsights />
              </CardContent>
            </Card>
            
            {/* Community Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Community Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CommunityStats />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Brackets/AI Battles Tab Content */}
          <TabsContent value="brackets" className="space-y-4 mt-0">
            {/* AI vs Humans Battle Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Humans vs AI Battle</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <AiVsHumansBattle stats={mockGlobalStats} />
              </CardContent>
            </Card>
            
            {/* Active Brackets Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Active Brackets</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ActiveBrackets brackets={[]} />
              </CardContent>
            </Card>
            
            {/* Quick Start a Bracket */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Start a New Battle</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-[hsl(var(--primary))]" />
                      <h4 className="font-medium">Daily Challenge</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Pick 3 stocks for a 1-day battle</p>
                    <div className="text-xs bg-muted inline-block px-2 py-1 rounded">Quick Play</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Shuffle className="h-4 w-4 text-[hsl(var(--primary))]" />
                      <h4 className="font-medium">Weekly Duel</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Pick 5 stocks for a week-long battle</p>
                    <div className="text-xs bg-muted inline-block px-2 py-1 rounded">Popular</div>
                  </div>
                </div>
                
                <Link to="/app/brackets/create">
                  <Button className="w-full">Create Custom Bracket</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Floating Action Button - Always present */}
      <Link 
        to="/app/predict" 
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-30 bg-[hsl(var(--primary))] text-white rounded-full shadow-lg p-4 flex items-center justify-center"
      >
        <TrendingUp className="h-6 w-6" />
      </Link>
    </motion.div>
  );
};

export default Dashboard;