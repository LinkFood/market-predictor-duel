
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalStats } from "@/types";
import { Progress } from "@/components/ui/progress";
import { User, Users, Brain, Zap, TrendingUp } from "lucide-react";

interface GlobalBattleStatsProps {
  stats: GlobalStats;
}

const GlobalBattleStats: React.FC<GlobalBattleStatsProps> = ({ stats }) => {
  // Calculate win percentages
  const humanWinPercent = (stats.humanWins / stats.totalPredictions) * 100;
  const aiWinPercent = (stats.aiWins / stats.totalPredictions) * 100;
  const tiePercent = (stats.ties / stats.totalPredictions) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Humans vs. AI Battle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-blue-500" />
                <span className="text-sm font-medium">Humans</span>
              </div>
              <span className="text-sm">{humanWinPercent.toFixed(1)}%</span>
            </div>
            <Progress value={humanWinPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {stats.humanWins.toLocaleString()} wins
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-1.5 text-purple-500" />
                <span className="text-sm font-medium">AI</span>
              </div>
              <span className="text-sm">{aiWinPercent.toFixed(1)}%</span>
            </div>
            <Progress value={aiWinPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {stats.aiWins.toLocaleString()} wins
            </p>
          </div>

          <div className="pt-2 text-sm border-t">
            <div className="flex justify-between items-center">
              <span>Total Predictions</span>
              <span className="font-medium">{stats.totalPredictions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Ties</span>
              <span>{stats.ties.toLocaleString()} ({tiePercent.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="pt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs text-muted-foreground">Market</p>
              <p className="font-medium">{stats.marketPredictions.toLocaleString()}</p>
            </div>
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs text-muted-foreground">Sector</p>
              <p className="font-medium">{stats.sectorPredictions.toLocaleString()}</p>
            </div>
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="font-medium">{stats.stockPredictions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalBattleStats;
