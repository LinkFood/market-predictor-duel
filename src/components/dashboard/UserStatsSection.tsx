
import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { User } from "@/types";

interface UserStatsSectionProps {
  currentUser: User;
  userRank: number;
}

const UserStatsSection: React.FC<UserStatsSectionProps> = ({ currentUser, userRank }) => {
  // Calculate win rate
  const userWinRate = Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100);
  
  return (
    <motion.section className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="title-md">Welcome back, {currentUser.username}</h3>
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
          <p className="numeric-md">{currentUser.points}</p>
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
