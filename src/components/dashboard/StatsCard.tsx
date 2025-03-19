
import React, { useEffect, useState } from "react";
import DataCard from "@/components/DataCard";
import { Activity, BrainCircuit, Flame, Award } from "lucide-react";
import { getUserStats } from "@/lib/prediction";

interface StatsCardProps {
  userRank?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ userRank }) => {
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await getUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!userStats) {
    return <div>No stats available</div>;
  }

  const stats = [
    {
      title: "Predictions",
      value: userStats.totalPredictions,
      icon: <Activity className="text-indigo-500" />,
      description: userStats.totalPredictions > 0 
        ? `${userStats.userVictories} correct (${Math.round(userStats.winRate)}%)`
        : "No predictions yet"
    },
    {
      title: "vs AI",
      value: `${userStats.userVictories} W / ${userStats.aiVictories} L`,
      icon: <BrainCircuit className="text-cyan-500" />,
      description: `${userStats.ties} ties`
    },
    {
      title: "Streak",
      value: userStats.winStreak,
      icon: <Flame className="text-amber-500" />,
      description: `Best: ${userStats.bestWinStreak}`
    },
    {
      title: "Points",
      value: userStats.totalPoints,
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
