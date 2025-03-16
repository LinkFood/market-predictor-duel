
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Activity, TrendingUp, Trophy, Users, BarChart3, BrainCircuit, 
  ChevronRight, Sparkles, Bell, Clock, Calendar, DollarSign, 
  Podcast, Flame, Lightbulb, Zap, Award 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import DataCard from "@/components/DataCard";
import MarketDataTable from "@/components/MarketDataTable";
import PredictionCard from "@/components/PredictionCard";
import PerformanceChart from "@/components/PerformanceChart";
import { mockMarketData, mockPredictions, mockStockData, currentUser, mockGlobalStats, mockLeaderboard } from "@/data/mockData";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const recentPredictions = mockPredictions.slice(0, 3);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Calculate AI vs human win rate for the progress bar
  const totalBattles = mockGlobalStats.humanWins + mockGlobalStats.aiWins;
  const humanWinPercentage = Math.round((mockGlobalStats.humanWins / totalBattles) * 100);
  
  const stats = [
    {
      title: "Predictions",
      value: currentUser.totalPredictions,
      icon: <Activity className="text-indigo-500" />,
      description: `${currentUser.correctPredictions} correct (${Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100)}%)`
    },
    {
      title: "vs AI",
      value: `${currentUser.winsAgainstAi} W / ${currentUser.lossesAgainstAi} L`,
      icon: <BrainCircuit className="text-cyan-500" />,
      description: `${currentUser.ties} ties`
    },
    {
      title: "Streak",
      value: currentUser.currentStreak,
      icon: <Flame className="text-amber-500" />,
      description: `Best: ${currentUser.bestStreak}`
    },
    {
      title: "Points",
      value: currentUser.points,
      icon: <Award className="text-violet-500" />,
      description: `Rank: #${mockLeaderboard.find(item => item.userId === currentUser.id)?.rank || '-'}`
    }
  ];

  // Hot prediction opportunities
  const hotOpportunities = [
    { 
      name: "NVIDIA (NVDA)", 
      description: "Earnings tomorrow", 
      confidence: 89, 
      movement: "volatile",
      icon: <Sparkles className="h-4 w-4 text-amber-500" /> 
    },
    { 
      name: "S&P 500", 
      description: "Fed announcement", 
      confidence: 76, 
      movement: "bearish",
      icon: <Clock className="h-4 w-4 text-sky-500" /> 
    },
    { 
      name: "Retail Sector", 
      description: "Consumer data release", 
      confidence: 82, 
      movement: "bullish",
      icon: <Calendar className="h-4 w-4 text-emerald-500" /> 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header with welcome and action buttons */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, <span className="text-indigo-600 dark:text-indigo-400">{currentUser.username}</span>!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to challenge the AI today?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/profile")} className="flex items-center">
            <Trophy className="mr-2 h-4 w-4 text-amber-500" />
            My Stats
          </Button>
          <Button onClick={() => navigate("/predict")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
            <TrendingUp className="mr-2 h-4 w-4" />
            Make Prediction
          </Button>
        </div>
      </div>

      {/* Global AI vs Humans battle stats */}
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-market-blue to-indigo-800 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                Global AI vs Humans Battle
              </h3>
              <p className="mb-3 text-indigo-100">
                Humans are currently {mockGlobalStats.humanWins > mockGlobalStats.aiWins ? (
                  <span className="font-bold text-emerald-300">winning</span>
                ) : (
                  <span className="font-bold text-red-300">losing</span>
                )} against the AI!
              </p>
              
              <div className="relative pt-1 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-indigo-200">Humans: {humanWinPercentage}%</div>
                  <div className="font-medium text-sm text-indigo-200">AI: {100 - humanWinPercentage}%</div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-indigo-900">
                  <div 
                    style={{ width: `${humanWinPercentage}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-400"
                  ></div>
                  <div 
                    style={{ width: `${100 - humanWinPercentage}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-400"
                  ></div>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-center md:justify-start space-x-4">
                <div className="text-center">
                  <span className="text-2xl font-bold block">{mockGlobalStats.humanWins}</span>
                  <span className="text-xs">Human Wins</span>
                </div>
                <Separator orientation="vertical" className="h-10 bg-indigo-400/30" />
                <div className="text-center">
                  <span className="text-2xl font-bold block">{mockGlobalStats.aiWins}</span>
                  <span className="text-xs">AI Wins</span>
                </div>
                <Separator orientation="vertical" className="h-10 bg-indigo-400/30" />
                <div className="text-center">
                  <span className="text-2xl font-bold block">{mockGlobalStats.ties}</span>
                  <span className="text-xs">Ties</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate("/leaderboard")}
                className="bg-white text-market-blue hover:bg-white/90"
              >
                <Users className="mr-2 h-4 w-4" />
                View Leaderboard
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/predict")}
                className="bg-indigo-700/50 border-indigo-400 hover:bg-indigo-700 text-white"
              >
                <Lightbulb className="mr-2 h-4 w-4 text-yellow-300" />
                Join the Battle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DataCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      {/* Market overview and recent predictions */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent predictions column */}
        <div className="md:col-span-1">
          <Card className="h-full shadow-sm border-0 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Recent Predictions</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/predictions/history")} className="h-8 text-xs">
                  View All
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentPredictions.map((prediction) => (
                  <div key={prediction.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate(`/predictions/${prediction.id}`)}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Badge className={prediction.userPrediction === "bullish" ? "bg-emerald-500" : "bg-red-500"}>
                          {prediction.userPrediction === "bullish" ? "Bullish" : "Bearish"}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          {prediction.timeframe === "1d" ? "1 Day" : prediction.timeframe === "1w" ? "1 Week" : "1 Month"}
                        </span>
                      </div>
                      <Badge variant={prediction.status === "correct" ? "success" : prediction.status === "incorrect" ? "destructive" : "outline"}>
                        {prediction.status === "pending" ? "Pending" : prediction.status === "correct" ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{prediction.targetName}</h4>
                    <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                      <span>AI: {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"} ({prediction.aiConfidence}/10)</span>
                      {prediction.resolved && prediction.winner && (
                        <span className={`font-medium ${
                          prediction.winner === "user" ? "text-emerald-600 dark:text-emerald-400" : 
                          prediction.winner === "ai" ? "text-red-600 dark:text-red-400" : 
                          prediction.winner === "both" ? "text-blue-600 dark:text-blue-400" : ""
                        }`}>
                          {prediction.winner === "user" ? "You won!" : 
                           prediction.winner === "ai" ? "AI won" : 
                           prediction.winner === "both" ? "Both correct" : "Neither correct"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t py-3">
              <Button variant="default" onClick={() => navigate("/predict")} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <TrendingUp className="mr-2 h-4 w-4" />
                Make New Prediction
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Market pulse and performance column */}
        <div className="md:col-span-2">
          <div className="grid gap-6">
            {/* Market overview card */}
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Market Pulse</CardTitle>
                  <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-fit">
                    <TabsList className="h-8">
                      <TabsTrigger value="daily" className="text-xs h-7 px-2">Today</TabsTrigger>
                      <TabsTrigger value="weekly" className="text-xs h-7 px-2">Week</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs h-7 px-2">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  <MarketDataTable data={mockMarketData} title="Major Indices" />
                  <MarketDataTable data={mockStockData.slice(0, 5)} title="Popular Stocks" />
                </div>
              </CardContent>
            </Card>
            
            {/* Hot prediction opportunities */}
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                    Hot Opportunities
                  </CardTitle>
                </div>
                <CardDescription>
                  High-confidence prediction opportunities detected by our AI
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {hotOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate("/predict")}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          {opportunity.icon}
                          <h4 className="font-semibold ml-2">{opportunity.name}</h4>
                        </div>
                        <Badge variant={opportunity.movement === "bullish" ? "success" : opportunity.movement === "bearish" ? "destructive" : "outline"} className="capitalize">
                          {opportunity.movement}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{opportunity.description}</span>
                        <div className="flex items-center">
                          <span className="text-xs font-medium mr-2">{opportunity.confidence}% Confidence</span>
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                opportunity.confidence > 85 ? "bg-emerald-500" : 
                                opportunity.confidence > 70 ? "bg-amber-500" : "bg-sky-500"
                              }`} 
                              style={{ width: `${opportunity.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t py-3">
                <Button variant="outline" onClick={() => navigate("/predict")} className="w-full">
                  View All Opportunities
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Performance chart */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Your Performance</CardTitle>
            <Tabs defaultValue="weekly" className="w-fit">
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs h-7 px-2">Day</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs h-7 px-2">Week</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs h-7 px-2">Month</TabsTrigger>
                <TabsTrigger value="allTime" className="text-xs h-7 px-2">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <PerformanceChart />
        </CardContent>
      </Card>

      {/* Top Performers Preview */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")} className="h-8 text-xs">
              Full Leaderboard
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockLeaderboard.slice(0, 3).map((user, index) => (
              <div key={user.userId} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index === 0 ? "bg-amber-100 text-amber-700" : 
                    index === 1 ? "bg-slate-100 text-slate-700" : 
                    "bg-amber-50 text-amber-800"
                  }`}>
                    {index === 0 ? (
                      <Trophy className="h-4 w-4 text-amber-500" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Win rate: {Math.round(user.accuracy * 100)}% ({user.totalPredictions} predictions)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{user.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
