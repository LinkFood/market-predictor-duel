
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { getUserStats } from "@/lib/prediction";
import { supabase } from "@/integrations/supabase/client";

interface UserStatsSectionProps {
  userRank: number;
}

const UserStatsSection: React.FC<UserStatsSectionProps> = ({ userRank }) => {
  const [userStats, setUserStats] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user stats
        const stats = await getUserStats();
        setUserStats(stats);
        
        // Fetch user profile info
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userData.user.id)
            .single();
            
          if (profileData) {
            setUsername(profileData.username);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <motion.section className="glass-card p-5 animate-pulse">
        <div className="h-40 bg-gray-100 rounded-lg"></div>
      </motion.section>
    );
  }

  if (!userStats) {
    return <div>No stats available</div>;
  }
  
  // Calculate win rate
  const userWinRate = Math.round(userStats.winRate);
  
  return (
    <motion.section className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="title-md">Welcome back, {username}</h3>
        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-[hsl(var(--surface-2))] flex items-center justify-center">
          <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">Win Rate</p>
          <p className="numeric-md">{userWinRate}%</p>
        </div>
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">Score</p>
          <p className="numeric-md">{userStats.totalPoints}</p>
        </div>
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">Rank</p>
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-[hsl(var(--warning))] mr-1" />
            <p className="numeric-md">#{userRank}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Link to="/app/predict" className="btn-primary btn-md w-full">
          <TrendingUp className="h-4 w-4 mr-2" />
          Make a Prediction
        </Link>
        <Link to="/app/predictions/history" className="btn-secondary btn-md w-full">
          View Your History
        </Link>
      </div>
    </motion.section>
  );
};

export default UserStatsSection;
