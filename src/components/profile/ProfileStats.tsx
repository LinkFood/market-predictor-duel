
import React from "react";
import { Link } from "react-router-dom";
import DataCard from "@/components/DataCard";
import { ArrowUp, BarChart3, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DataCard 
        title="Prediction Accuracy" 
        value={`${Math.round(accuracy)}%`} 
        icon={<BarChart3 />} 
        description={`${Math.round(correctPredictions)} of ${totalPredictions} correct`}
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
  );
};

export default ProfileStats;
