
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Shield, Users, Zap, Award } from "lucide-react";
import { GlobalStats } from "@/types";

interface GlobalBattleStatsProps {
  stats: GlobalStats;
}

const GlobalBattleStats: React.FC<GlobalBattleStatsProps> = ({ stats }) => {
  // Calculate human win rate
  const humanWinRate = stats.totalPredictions > 0 
    ? Math.round((stats.humanWins / stats.totalPredictions) * 100)
    : 0;
    
  // Calculate AI win rate
  const aiWinRate = stats.totalPredictions > 0
    ? Math.round((stats.aiWins / stats.totalPredictions) * 100) 
    : 0;
    
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Global Battle Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium">Traders</span>
            </div>
            <span className="text-sm font-medium">{humanWinRate}% win rate</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-sm font-medium">AI</span>
            </div>
            <span className="text-sm font-medium">{aiWinRate}% win rate</span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Total Predictions</span>
              <span className="text-xs font-medium">{stats.totalPredictions.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Humans vs AI</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-blue-600">{stats.humanWins.toLocaleString()}</span>
                <span className="text-xs">:</span>
                <span className="text-xs font-medium text-purple-600">{stats.aiWins.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalBattleStats;
