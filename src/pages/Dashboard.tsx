
import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, TrendingUp, Trophy, Users, BarChart3, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/DataCard";
import MarketDataTable from "@/components/MarketDataTable";
import PredictionCard from "@/components/PredictionCard";
import PerformanceChart from "@/components/PerformanceChart";
import { mockMarketData, mockPredictions, mockStockData, currentUser, mockGlobalStats } from "@/data/mockData";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const recentPredictions = mockPredictions.slice(0, 2);
  
  const stats = [
    {
      title: "Total Predictions",
      value: currentUser.totalPredictions,
      icon: <Activity />,
      description: `${currentUser.correctPredictions} correct (${Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100)}%)`
    },
    {
      title: "Win/Loss vs AI",
      value: `${currentUser.winsAgainstAi} / ${currentUser.lossesAgainstAi}`,
      icon: <BrainCircuit />,
      description: `${currentUser.ties} ties`
    },
    {
      title: "Current Streak",
      value: currentUser.currentStreak,
      icon: <Trophy />,
      description: `Best: ${currentUser.bestStreak}`
    },
    {
      title: "Points",
      value: currentUser.points,
      icon: <BarChart3 />,
      description: `Rank: 3rd of ${mockGlobalStats.totalPredictions} users`
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.username}!
          </p>
        </div>
        <Button onClick={() => navigate("/predict")}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Make Prediction
        </Button>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Predictions</h2>
          <div className="grid gap-4">
            {recentPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
            <Button variant="outline" onClick={() => navigate("/predictions/history")}>
              View All Predictions
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Market Pulse</h2>
          <div className="space-y-6">
            <MarketDataTable data={mockMarketData} title="Major Indices" />
            <MarketDataTable data={mockStockData.slice(0, 3)} title="Popular Stocks" />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <PerformanceChart />
      </div>

      <div className="rounded-lg bg-market-blue p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Global AI vs Humans Battle</h3>
            <p>
              Humans are currently {mockGlobalStats.humanWins > mockGlobalStats.aiWins ? "winning" : "losing"} against the AI!
            </p>
            <div className="mt-2">
              <span className="text-2xl font-bold">
                {mockGlobalStats.humanWins} - {mockGlobalStats.aiWins}
              </span>
              <span className="text-sm ml-2">({mockGlobalStats.ties} ties)</span>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate("/leaderboard")}
            className="bg-white text-market-blue hover:bg-white/90"
          >
            <Users className="mr-2 h-4 w-4" />
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
