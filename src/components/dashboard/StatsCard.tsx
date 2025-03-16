
import React from "react";
import DataCard from "@/components/DataCard";
import { Activity, BrainCircuit, Flame, Award } from "lucide-react";
import { User, LeaderboardEntry } from "@/types";

interface StatsCardProps {
  currentUser: User;
  userRank?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ currentUser, userRank }) => {
  const stats = [
    {
      title: "Predictions",
      value: currentUser.totalPredictions,
      icon: <Activity className="text-indigo-500" />,
      description: `${currentUser.correctPredictions} correct (${Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100)}%)`
    },
    {
      title: "vs AI",
      value: `${currentUser.winsAgainstAi} W / ${currentUser.lossesAgainstAi} L`,
      icon: <BrainCircuit className="text-cyan-500" />,
      description: `${currentUser.ties} ties`
    },
    {
      title: "Streak",
      value: currentUser.currentStreak,
      icon: <Flame className="text-amber-500" />,
      description: `Best: ${currentUser.bestStreak}`
    },
    {
      title: "Points",
      value: currentUser.points,
      icon: <Award className="text-violet-500" />,
      description: `Rank: #${userRank || '-'}`
    }
  ];

  return (
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
  );
};

export default StatsCard;
