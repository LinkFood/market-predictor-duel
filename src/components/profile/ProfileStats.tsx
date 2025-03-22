
import React from "react";
import { Link } from "react-router-dom";
import DataCard from "@/components/DataCard";
import { ArrowUp, BarChart3, Trophy, TrendingUp, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileStatsProps {
  accuracy: number;
  totalPredictions: number;
  correctPredictions: number;
  winsAgainstAI: number;
  lossesAgainstAI: number;
  ties: number;
  currentStreak: number;
  bestStreak: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ 
  accuracy, 
  totalPredictions, 
  correctPredictions,
  winsAgainstAI,
  lossesAgainstAI,
  ties,
  currentStreak,
  bestStreak
}) => {
  // If user has no predictions yet, show the empty state
  if (totalPredictions === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-6 text-center space-y-4">
        <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">No Prediction Stats Yet</h3>
        <p className="text-muted-foreground">
          Make your first prediction to start building your stats and compete with AI!
        </p>
        <Button asChild className="mt-2">
          <Link to="/app/predict">Make a Prediction</Link>
        </Button>
      </div>
    );
  }

  // Helper to avoid NaN for division with zero
  const calculateWinRate = () => {
    const total = winsAgainstAI + lossesAgainstAI + ties;
    if (total === 0) return 0;
    return Math.round((winsAgainstAI / total) * 100);
  };

  // Calculate performance badges
  const getAccuracyBadge = () => {
    if (accuracy >= 75) return "Expert";
    if (accuracy >= 60) return "Advanced";
    if (accuracy >= 45) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard 
          title="Prediction Accuracy" 
          value={`${Math.round(accuracy)}%`} 
          icon={<BarChart3 />} 
          description={`${correctPredictions} of ${totalPredictions} correct`}
          trend={accuracy > 50 ? "up" : accuracy < 50 ? "down" : "neutral"}
        />
        <DataCard 
          title="Record vs. AI" 
          value={`${winsAgainstAI}W - ${lossesAgainstAI}L - ${ties}T`} 
          icon={<Trophy />} 
          description={`${calculateWinRate()}% win rate against AI`}
          trend={winsAgainstAI > lossesAgainstAI ? "up" : winsAgainstAI < lossesAgainstAI ? "down" : "neutral"}
        />
        <DataCard 
          title="Current Streak" 
          value={currentStreak.toString()} 
          icon={<ArrowUp />} 
          description={`Best streak: ${bestStreak}`}
          trend={currentStreak > 0 ? "up" : "neutral"}
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>{getAccuracyBadge()} Analyst</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Based on your prediction accuracy of {Math.round(accuracy)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {bestStreak >= 3 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  <span>{bestStreak >= 7 ? "Hot" : "Consistent"} Streak</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You've achieved a streak of {bestStreak} correct predictions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {winsAgainstAI > lossesAgainstAI && totalPredictions >= 5 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  <span>AI Challenger</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You're outperforming the AI with a {calculateWinRate()}% win rate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;
