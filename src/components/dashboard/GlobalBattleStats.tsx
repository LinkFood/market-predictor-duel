
import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GlobalStats } from "@/types";

interface GlobalBattleStatsProps {
  stats: GlobalStats;
}

const GlobalBattleStats: React.FC<GlobalBattleStatsProps> = ({ stats }) => {
  const navigate = useNavigate();
  
  // Calculate AI vs human win rate for the progress bar
  const totalBattles = stats.humanWins + stats.aiWins;
  const humanWinPercentage = Math.round((stats.humanWins / totalBattles) * 100);
  
  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-market-blue to-indigo-800 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-300" />
              Global AI vs Humans Battle
            </h3>
            <p className="mb-3 text-indigo-100">
              Humans are currently {stats.humanWins > stats.aiWins ? (
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
                <span className="text-2xl font-bold block">{stats.humanWins}</span>
                <span className="text-xs">Human Wins</span>
              </div>
              <Separator orientation="vertical" className="h-10 bg-indigo-400/30" />
              <div className="text-center">
                <span className="text-2xl font-bold block">{stats.aiWins}</span>
                <span className="text-xs">AI Wins</span>
              </div>
              <Separator orientation="vertical" className="h-10 bg-indigo-400/30" />
              <div className="text-center">
                <span className="text-2xl font-bold block">{stats.ties}</span>
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
  );
};

export default GlobalBattleStats;
