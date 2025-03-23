
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Shield, Users, Zap, Trophy } from "lucide-react";
import { GlobalStats } from "@/types";
import { motion } from "framer-motion";

interface GlobalBattleStatsProps {
  stats: GlobalStats;
}

const GlobalBattleStats: React.FC<GlobalBattleStatsProps> = ({ stats }) => {
  // Get human win rate from stats or calculate it
  const humanWinRate = stats.humanWinRate || (stats.totalPredictions > 0 
    ? Math.round((stats.humanWins / stats.totalPredictions) * 100)
    : 0);
    
  // Calculate AI win rate
  const aiWinRate = stats.totalPredictions > 0
    ? Math.round((stats.aiWins / stats.totalPredictions) * 100) 
    : 0;
    
  return (
    <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
          Global Battle Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-5">
          {/* Win Rate Visualization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Traders</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{humanWinRate}%</span>
            </div>
            
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${humanWinRate}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                <span className="text-sm font-medium">AI</span>
              </div>
              <span className="text-sm font-bold text-purple-600">{aiWinRate}%</span>
            </div>
            
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${aiWinRate}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Total Predictions</div>
              <div className="text-lg font-bold text-slate-800">{stats.totalPredictions.toLocaleString()}</div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Win Ratio (H:AI)</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-blue-600">{stats.humanWins.toLocaleString()}</span>
                <span className="text-lg font-bold text-slate-400">:</span>
                <span className="text-lg font-bold text-purple-600">{stats.aiWins.toLocaleString()}</span>
              </div>
            </div>
            
            {stats.totalDuels > 0 && (
              <>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Total Duels</div>
                  <div className="text-lg font-bold text-slate-800">{stats.totalDuels.toLocaleString()}</div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Duel Victories</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-blue-600">{stats.humansWon?.toLocaleString() || 0}</span>
                    <span className="text-lg font-bold text-slate-400">:</span>
                    <span className="text-lg font-bold text-purple-600">{stats.aiWon?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Current Champion */}
          {stats.currentChampion && (
            <div className="flex items-center justify-between mt-2 bg-gradient-to-r from-amber-50 to-amber-100 p-2 rounded-lg">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-amber-500" />
                <span className="text-xs text-amber-800">Current Champion</span>
              </div>
              <span className="text-xs font-bold text-amber-800">{stats.currentChampion}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalBattleStats;
