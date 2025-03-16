
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
    <div className="text-white bg-gradient-to-br from-primary/90 to-primary-foreground/20 rounded-2xl backdrop-blur-md">
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
              <Zap className="h-5 w-5 text-yellow-300" />
              Global AI vs Humans Battle
            </h3>
            <p className="mb-2 text-sm">
              Humans are currently {stats.humanWins > stats.aiWins ? (
                <span className="font-bold text-emerald-300">winning</span>
              ) : (
                <span className="font-bold text-red-300">losing</span>
              )} against the AI!
            </p>
            
            <div className="relative mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-medium text-xs opacity-90">Humans: {humanWinPercentage}%</div>
                <div className="font-medium text-xs opacity-90">AI: {100 - humanWinPercentage}%</div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-white/10 relative">
                <div 
                  style={{ width: `${humanWinPercentage}%` }} 
                  className="shadow-inner flex flex-col text-center whitespace-nowrap justify-center bg-emerald-400 transition-all duration-500"
                ></div>
                <div 
                  style={{ width: `${100 - humanWinPercentage}%` }} 
                  className="shadow-inner flex flex-col text-center whitespace-nowrap justify-center bg-red-400 transition-all duration-500"
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold sf-nums">{stats.humanWins}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70">Human Wins</span>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold sf-nums">{stats.aiWins}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70">AI Wins</span>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold sf-nums">{stats.ties}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70">Ties</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-row md:flex-col mt-4 md:mt-0 gap-3">
            <Button 
              onClick={() => navigate("/app/leaderboard")}
              className="rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium py-2 px-4 text-sm flex items-center"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Leaderboard
            </Button>
            <Button 
              onClick={() => navigate("/app/predict")}
              className="ios-button-primary"
            >
              <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-yellow-200" />
              Join Battle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalBattleStats;
