
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LeaderboardTable from "@/components/LeaderboardTable";
import DataCard from "@/components/DataCard";
import { 
  Trophy, Users, Zap, Medal, Award, Crown, 
  TrendingUp, BrainCircuit, Target, Star,
  Calendar, BarChart3, Search, Filter, ChevronRight
} from "lucide-react";
import { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";

// Mock data for the leaderboard
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, userId: "user1", username: "MarketWizard", accuracy: 0.73, totalPredictions: 112, winRateAgainstAi: 0.67, points: 1423, avatarUrl: "" },
  { rank: 2, userId: "user2", username: "StockSage", accuracy: 0.71, totalPredictions: 89, winRateAgainstAi: 0.63, points: 1256, avatarUrl: "" },
  { rank: 3, userId: "user3", username: "BullBaron", accuracy: 0.68, totalPredictions: 134, winRateAgainstAi: 0.59, points: 1187, avatarUrl: "" },
  { rank: 4, userId: "user4", username: "TradingTitan", accuracy: 0.66, totalPredictions: 95, winRateAgainstAi: 0.61, points: 1022, avatarUrl: "" },
  { rank: 5, userId: "user5", username: "WallStWinner", accuracy: 0.64, totalPredictions: 78, winRateAgainstAi: 0.57, points: 986, avatarUrl: "" },
  { rank: 6, userId: "user6", username: "PredictionPro", accuracy: 0.63, totalPredictions: 103, winRateAgainstAi: 0.54, points: 954, avatarUrl: "" },
  { rank: 7, userId: "user7", username: "MarketMaster", accuracy: 0.61, totalPredictions: 121, winRateAgainstAi: 0.56, points: 923, avatarUrl: "" },
  { rank: 8, userId: "user8", username: "FinancePhenom", accuracy: 0.60, totalPredictions: 86, winRateAgainstAi: 0.53, points: 891, avatarUrl: "" },
  { rank: 9, userId: "user9", username: "IndexInsight", accuracy: 0.59, totalPredictions: 92, winRateAgainstAi: 0.51, points: 872, avatarUrl: "" },
  { rank: 10, userId: "user10", username: "ChartChampion", accuracy: 0.58, totalPredictions: 76, winRateAgainstAi: 0.52, points: 837, avatarUrl: "" },
  { rank: 11, userId: "user11", username: "BearishBaron", accuracy: 0.57, totalPredictions: 81, winRateAgainstAi: 0.49, points: 815, avatarUrl: "" },
  { rank: 12, userId: "user12", username: "AlphaTrade", accuracy: 0.56, totalPredictions: 105, winRateAgainstAi: 0.50, points: 798, avatarUrl: "" },
  { rank: 13, userId: "user13", username: "MarketMaven", accuracy: 0.55, totalPredictions: 97, winRateAgainstAi: 0.51, points: 782, avatarUrl: "" },
  { rank: 14, userId: "user14", username: "TickerTracker", accuracy: 0.54, totalPredictions: 72, winRateAgainstAi: 0.48, points: 756, avatarUrl: "" },
  { rank: 15, userId: "user15", username: "BullsEye", accuracy: 0.53, totalPredictions: 88, winRateAgainstAi: 0.47, points: 734, avatarUrl: "" },
];

// Mock achievement badges
const achievementBadges = [
  { 
    id: "first-blood", 
    name: "First Blood", 
    description: "Beat the AI on your first prediction", 
    icon: <Star className="h-4 w-4 text-amber-500" />,
    rarity: "common"
  },
  { 
    id: "streak-5", 
    name: "Hot Streak", 
    description: "5 correct predictions in a row", 
    icon: <Zap className="h-4 w-4 text-indigo-500" />,
    rarity: "uncommon"
  },
  { 
    id: "market-master", 
    name: "Market Master", 
    description: "Correctly predict all major indices in a week", 
    icon: <Target className="h-4 w-4 text-emerald-500" />,
    rarity: "rare"
  },
  { 
    id: "ai-nemesis", 
    name: "AI Nemesis", 
    description: "Beat AI 10 times in a row", 
    icon: <BrainCircuit className="h-4 w-4 text-rose-500" />,
    rarity: "epic"
  },
  { 
    id: "legendary", 
    name: "Legendary Analyst", 
    description: "Achieve 75%+ accuracy with 100+ predictions", 
    icon: <Crown className="h-4 w-4 text-yellow-500" />,
    rarity: "legendary"
  },
];

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week">("all");
  const [sortBy, setSortBy] = useState<"points" | "accuracy" | "vsai">("points");
  const currentUserId = "user7"; // Mock the current user ID for highlighting in the table
  
  const timeRangeLabel = {
    all: "All Time",
    month: "This Month",
    week: "This Week"
  };
  
  const sortByLabel = {
    points: "Points",
    accuracy: "Accuracy",
    vsai: "vs AI"
  };
  
  // Find the current user's rank
  const currentUserRank = mockLeaderboardData.find(user => user.userId === currentUserId)?.rank || 0;
  
  // Sort data based on the selected criteria
  const getSortedData = () => {
    const data = [...mockLeaderboardData];
    switch (sortBy) {
      case "accuracy":
        return data.sort((a, b) => b.accuracy - a.accuracy);
      case "vsai":
        return data.sort((a, b) => b.winRateAgainstAi - a.winRateAgainstAi);
      case "points":
      default:
        return data;
    }
  };

  const renderTopThree = () => {
    const topThree = getSortedData().slice(0, 3);
    
    return (
      <div className="grid grid-cols-3 gap-4 pb-2">
        {/* Second place */}
        <div className="col-start-1 row-start-1 order-1 sm:mt-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-slate-500 hover:bg-slate-600 h-6 px-2 font-medium">
                  <Medal className="h-3.5 w-3.5 mr-1" />
                  2
                </Badge>
              </div>
              <Avatar className="h-16 w-16 border-2 border-slate-300">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-700 text-white text-xl">
                  {topThree[1].username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="font-semibold mt-3 text-center text-sm">{topThree[1].username}</h3>
            <p className="text-sm text-muted-foreground mt-1">{topThree[1].points} pts</p>
          </div>
        </div>
        
        {/* First place */}
        <div className="col-start-2 row-start-1 order-0">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-500 hover:bg-amber-600 h-8 px-3 font-semibold">
                  <Crown className="h-4 w-4 mr-1" />
                  1
                </Badge>
              </div>
              <Avatar className="h-20 w-20 border-4 border-amber-300">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-white text-2xl">
                  {topThree[0].username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="font-bold mt-3 text-center">{topThree[0].username}</h3>
            <p className="text-sm font-medium mt-1">{topThree[0].points} pts</p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                Champion
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Third place */}
        <div className="col-start-3 row-start-1 order-2 sm:mt-9">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-700 hover:bg-amber-800 h-6 px-2 font-medium">
                  <Medal className="h-3.5 w-3.5 mr-1" />
                  3
                </Badge>
              </div>
              <Avatar className="h-16 w-16 border-2 border-amber-700">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-amber-700 to-amber-900 text-white text-xl">
                  {topThree[2].username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="font-semibold mt-3 text-center text-sm">{topThree[2].username}</h3>
            <p className="text-sm text-muted-foreground mt-1">{topThree[2].points} pts</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground max-w-3xl">
          See who's leading the pack in the battle against the AI. Can you make it to the top?
        </p>
      </div>

      {/* Battle stats */}
      <Card className="shadow-md border-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-200" />
                Global Humans vs AI Battle
              </h2>
              <p className="text-indigo-100 mb-4 max-w-md">
                Collectively, humans are currently <span className="font-bold text-indigo-200">winning</span> the battle against our AI! Keep making accurate predictions to help the human side.
              </p>
              
              <div className="relative pt-1 mb-2 max-w-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-indigo-200">Humans: 52%</div>
                  <div className="font-medium text-sm text-indigo-200">AI: 48%</div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-indigo-900">
                  <div 
                    style={{ width: `52%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-400"
                  ></div>
                  <div 
                    style={{ width: `48%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-400"
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className="text-center">
                  <span className="text-2xl font-bold block">27,419</span>
                  <span className="text-xs text-indigo-200">Total Predictions</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold block">14,258</span>
                  <span className="text-xs text-indigo-200">Human Wins</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold block">13,161</span>
                  <span className="text-xs text-indigo-200">AI Wins</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 min-w-[250px]">
              <h3 className="text-lg font-semibold mb-3">Your Stats</h3>
              
              {currentUserId === "user7" ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Current Rank:</span>
                    <span className="font-bold">#{currentUserRank}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Points:</span>
                    <span className="font-bold">923</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm">vs AI Win Rate:</span>
                    <span className="font-bold">56%</span>
                  </div>
                  <Button 
                    onClick={() => navigate("/profile")} 
                    className="w-full bg-white text-indigo-700 hover:bg-white/90"
                  >
                    View Full Stats
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <p className="mb-4">Login to track your stats and compete on the leaderboard!</p>
                    <Button 
                      onClick={() => navigate("/login")} 
                      className="bg-white text-indigo-700 hover:bg-white/90"
                    >
                      Sign in
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 champions section */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-2 border-b">
          <CardTitle>Top Champions</CardTitle>
          <CardDescription>
            The most successful predictors in StockDuel
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          {renderTopThree()}
        </CardContent>
      </Card>

      {/* Main leaderboard table */}
      <Card className="shadow-md border-0">
        <CardHeader className="border-b pb-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-indigo-500" />
                Leaderboard Rankings
              </CardTitle>
              <CardDescription>
                {timeRangeLabel[timeRange]} • Sorted by {sortByLabel[sortBy]}
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Tabs 
                value={timeRange} 
                onValueChange={(v) => setTimeRange(v as "all" | "month" | "week")}
                className="w-fit"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs h-7 px-2">All Time</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs h-7 px-2">Month</TabsTrigger>
                  <TabsTrigger value="week" className="text-xs h-7 px-2">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Mobile search and filter section */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <Button variant="outline" size="sm" className="gap-1 h-8">
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1 h-8">
              <Filter className="h-3.5 w-3.5" />
              <span className="text-xs">Filter</span>
            </Button>
          </div>
          
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "points" | "accuracy" | "vsai")}>
            <div className="px-4 pt-4 pb-2 hidden md:block">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="points">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Total Points
                </TabsTrigger>
                <TabsTrigger value="accuracy">
                  <Target className="h-4 w-4 mr-2" />
                  Highest Accuracy
                </TabsTrigger>
                <TabsTrigger value="vsai">
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Best vs AI
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="points" className="mt-0 border-0 p-0">
              <LeaderboardTable 
                entries={getSortedData()} 
                currentUserId={currentUserId} 
              />
            </TabsContent>
            
            <TabsContent value="accuracy" className="mt-0 border-0 p-0">
              <LeaderboardTable 
                entries={getSortedData()} 
                currentUserId={currentUserId} 
              />
            </TabsContent>
            
            <TabsContent value="vsai" className="mt-0 border-0 p-0">
              <LeaderboardTable 
                entries={getSortedData()} 
                currentUserId={currentUserId} 
              />
            </TabsContent>
          </Tabs>
          
          <div className="text-center p-4 text-sm text-muted-foreground border-t">
            Updated every hour • Last updated: 2 minutes ago
          </div>
        </CardContent>
      </Card>
      
      {/* Achievement badges */}
      <Card className="shadow-md border-0">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>
              <div className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-amber-500" />
                Achievement Badges
              </div>
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate("/achievements")}>
              View All
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <CardDescription>
            Earn special recognition for your prediction skills
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 p-4">
            {achievementBadges.map((badge) => (
              <div 
                key={badge.id}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  badge.rarity === "common" ? "bg-slate-100 dark:bg-slate-800" :
                  badge.rarity === "uncommon" ? "bg-blue-100 dark:bg-blue-900/30" :
                  badge.rarity === "rare" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                  badge.rarity === "epic" ? "bg-violet-100 dark:bg-violet-900/30" :
                  "bg-amber-100 dark:bg-amber-900/30"
                )}>
                  {badge.icon}
                </div>
                <h4 className="font-medium text-sm text-center">{badge.name}</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t py-3 flex justify-center">
          <div className="text-sm text-center text-muted-foreground">
            Make predictions and beat the AI to unlock more badges!
          </div>
        </CardFooter>
      </Card>
      
      {/* Call to action */}
      <div className="flex justify-center">
        <Button 
          onClick={() => navigate("/predict")} 
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-8"
          size="lg"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Start Making Predictions
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard;
