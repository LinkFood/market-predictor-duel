
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LeaderboardTable from "@/components/LeaderboardTable";
import DataCard from "@/components/DataCard";
import { Trophy, Users, Zap } from "lucide-react";
import { LeaderboardEntry } from "@/types";

// Transform mock data to match the LeaderboardEntry type
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, userId: "user1", username: "MarketWizard", accuracy: 0.73, totalPredictions: 112, winRateAgainstAi: 0.67, points: 1423 },
  { rank: 2, userId: "user2", username: "StockSage", accuracy: 0.71, totalPredictions: 89, winRateAgainstAi: 0.63, points: 1256 },
  { rank: 3, userId: "user3", username: "BullBaron", accuracy: 0.68, totalPredictions: 134, winRateAgainstAi: 0.59, points: 1187 },
  { rank: 4, userId: "user4", username: "TradingTitan", accuracy: 0.66, totalPredictions: 95, winRateAgainstAi: 0.61, points: 1022 },
  { rank: 5, userId: "user5", username: "WallStWinner", accuracy: 0.64, totalPredictions: 78, winRateAgainstAi: 0.57, points: 986 },
  { rank: 6, userId: "user6", username: "PredictionPro", accuracy: 0.63, totalPredictions: 103, winRateAgainstAi: 0.54, points: 954 },
  { rank: 7, userId: "user7", username: "MarketMaster", accuracy: 0.61, totalPredictions: 121, winRateAgainstAi: 0.56, points: 923 },
  { rank: 8, userId: "user8", username: "FinancePhenom", accuracy: 0.60, totalPredictions: 86, winRateAgainstAi: 0.53, points: 891 },
  { rank: 9, userId: "user9", username: "IndexInsight", accuracy: 0.59, totalPredictions: 92, winRateAgainstAi: 0.51, points: 872 },
  { rank: 10, userId: "user10", username: "ChartChampion", accuracy: 0.58, totalPredictions: 76, winRateAgainstAi: 0.52, points: 837 },
];

const Leaderboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week">("all");
  const currentUserId = "user1"; // Mock current user for highlighting in the table

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard 
          title="Top Predictor" 
          value="MarketWizard" 
          icon={<Trophy />} 
          description="73% accuracy rate"
        />
        <DataCard 
          title="Active Users" 
          value="1,247" 
          icon={<Users />} 
          description="112 new this week"
        />
        <DataCard 
          title="Human vs AI" 
          value="49% vs 51%" 
          icon={<Zap />} 
          description="AI slightly ahead overall"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Top Predictors</CardTitle>
              <CardDescription>Users with the highest prediction accuracy</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={timeRange === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setTimeRange("all")}
              >
                All Time
              </Button>
              <Button 
                variant={timeRange === "month" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setTimeRange("month")}
              >
                This Month
              </Button>
              <Button 
                variant={timeRange === "week" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setTimeRange("week")}
              >
                This Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="points">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="points">Total Points</TabsTrigger>
              <TabsTrigger value="accuracy">Highest Accuracy</TabsTrigger>
              <TabsTrigger value="vsai">Best vs AI</TabsTrigger>
            </TabsList>
            <TabsContent value="points">
              <LeaderboardTable entries={mockLeaderboardData} currentUserId={currentUserId} />
            </TabsContent>
            <TabsContent value="accuracy">
              <LeaderboardTable entries={[...mockLeaderboardData].sort((a, b) => b.accuracy - a.accuracy)} currentUserId={currentUserId} />
            </TabsContent>
            <TabsContent value="vsai">
              <LeaderboardTable entries={[...mockLeaderboardData].sort((a, b) => 
                b.winRateAgainstAi - a.winRateAgainstAi
              )} currentUserId={currentUserId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
