
import React from "react";
import { Link } from "react-router-dom";
import { Info, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const CommunityStats: React.FC = () => {
  return (
    <motion.section className="glass-card p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="title-sm">Community Stats</h3>
        <div className="btn-icon btn-secondary">
          <Info className="h-4 w-4" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">Active Users</p>
          <p className="numeric-md">1,248</p>
        </div>
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">Predictions Today</p>
          <p className="numeric-md">387</p>
        </div>
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">Top Human Win Rate</p>
          <p className="numeric-md">78%</p>
        </div>
        <div>
          <p className="caption text-[hsl(var(--muted-foreground))]">AI Win Rate</p>
          <p className="numeric-md">51%</p>
        </div>
      </div>
      
      <Link to="/app/leaderboard" className="btn-secondary btn-md w-full">
        <Trophy className="h-4 w-4 mr-2" />
        View Leaderboard
      </Link>
    </motion.section>
  );
};

export default CommunityStats;
