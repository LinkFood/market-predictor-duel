
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { GlobalStats } from "@/types";

interface AiVsHumansBattleProps {
  stats: GlobalStats;
}

const AiVsHumansBattle: React.FC<AiVsHumansBattleProps> = ({ stats }) => {
  return (
    <motion.section className="glass-card-raised overflow-hidden">
      <div className="p-5 pb-4 gradient-blue">
        <div className="flex justify-between items-center mb-2 text-white">
          <h3 className="title-sm">AI vs Humans Battle</h3>
          <Link to="/app/leaderboard" className="btn-ghost rounded-full px-2 py-1 caption">
            Leaderboard <ChevronRight className="h-3 w-3 inline-block" />
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3 text-white">
          <div>
            <p className="caption opacity-80">Humans</p>
            <p className="numeric-md">{stats.humanWins}</p>
          </div>
          <div>
            <p className="caption opacity-80">AI</p>
            <p className="numeric-md">{stats.aiWins}</p>
          </div>
          <div>
            <p className="caption opacity-80">Ties</p>
            <p className="numeric-md">{stats.ties}</p>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-[hsl(var(--surface-2))]">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1.5">
            <p className="caption opacity-80">Humans: {Math.round((stats.humanWins / (stats.humanWins + stats.aiWins)) * 100)}%</p>
            <p className="caption opacity-80">AI: {Math.round((stats.aiWins / (stats.humanWins + stats.aiWins)) * 100)}%</p>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill gradient-green"
              style={{ width: `${(stats.humanWins / (stats.humanWins + stats.aiWins)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="caption">{stats.totalPredictions} total predictions</p>
          <Link 
            to="/app/predict" 
            className="btn-primary btn-sm"
          >
            Join Battle
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default AiVsHumansBattle;
