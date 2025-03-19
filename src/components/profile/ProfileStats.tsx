
import React from "react";
import DataCard from "@/components/DataCard";
import { ArrowUp, BarChart3, Trophy } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DataCard 
        title="Prediction Accuracy" 
        value={`${accuracy}%`} 
        icon={<BarChart3 />} 
        description={`${correctPredictions} of ${totalPredictions} correct`}
        trend="up"
      />
      <DataCard 
        title="Record vs. AI" 
        value={`${winsAgainstAI}W - ${lossesAgainstAI}L - ${ties}T`} 
        icon={<Trophy />} 
        description={`${Math.round((winsAgainstAI / (winsAgainstAI + lossesAgainstAI + ties)) * 100)}% win rate against AI`}
      />
      <DataCard 
        title="Current Streak" 
        value={currentStreak.toString()} 
        icon={<ArrowUp />} 
        description={`Best streak: ${bestStreak}`}
        trend="up"
      />
    </div>
  );
};

export default ProfileStats;
