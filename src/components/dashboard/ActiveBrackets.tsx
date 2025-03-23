import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, GitFork, Trophy, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Bracket } from "@/lib/duel/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Progress } from "@/components/ui/progress";

interface ActiveBracketsProps {
  brackets: Bracket[];
}

const ActiveBrackets: React.FC<ActiveBracketsProps> = ({ brackets }) => {
  if (!brackets || brackets.length === 0) {
    return (
      <motion.section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="title-sm">Active Brackets</h3>
          <Link to="/app/brackets" className="btn-ghost caption text-[hsl(var(--muted-foreground))]">
            View All <ChevronRight className="h-3 w-3 inline-block" />
          </Link>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <GitFork className="h-8 w-8 text-[hsl(var(--muted-foreground))] mb-3" />
          <p className="font-medium mb-1">No active brackets</p>
          <p className="caption text-[hsl(var(--muted-foreground))] mb-4">Create a bracket to start competing</p>
          <Link to="/app/brackets/create" className="btn-primary btn-sm">
            Create Bracket
          </Link>
        </div>
      </motion.section>
    );
  }

  // Get brackets that are active or pending, sorted by created date (newest first)
  const activeBrackets = brackets
    .filter(b => b.status === 'active' || b.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Limit to three brackets for display
  const displayBrackets = activeBrackets.slice(0, 3);

  return (
    <motion.section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="title-sm">Active Brackets</h3>
        <Link to="/app/brackets" className="btn-ghost caption text-[hsl(var(--muted-foreground))]">
          View All <ChevronRight className="h-3 w-3 inline-block" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {displayBrackets.map((bracket) => (
          <Link
            key={bracket.id}
            to={`/app/brackets/${bracket.id}`}
            className="glass-card p-4 flex flex-col touch-scale"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="title-sm">{bracket.name.split(' ')[0]}</p>
                  <span className="badge badge-sm badge-primary">{bracket.size} stocks</span>
                </div>
                <p className="caption text-[hsl(var(--muted-foreground))]">vs {bracket.aiPersonality} AI</p>
              </div>
              
              {bracket.status === 'active' ? (
                <span className="badge badge-sm badge-success flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Active
                </span>
              ) : (
                <span className="badge badge-sm badge-warning flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              )}
            </div>
            
            {/* Show some stock preview */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="caption text-[hsl(var(--muted-foreground))]">Your Picks</p>
                <p className="caption font-medium truncate">
                  {bracket.userEntries.slice(0, 2).map(e => e.symbol).join(', ')}
                  {bracket.userEntries.length > 2 && '...'}
                </p>
              </div>
              <div>
                <p className="caption text-[hsl(var(--muted-foreground))]">AI Picks</p>
                <p className="caption font-medium truncate">
                  {bracket.aiEntries.slice(0, 2).map(e => e.symbol).join(', ')}
                  {bracket.aiEntries.length > 2 && '...'}
                </p>
              </div>
            </div>
            
            {/* Show progress for active brackets */}
            {bracket.status === 'active' && (
              <div className="mb-3">
                <Progress value={calculateProgress(bracket)} className="h-1.5" />
                <p className="caption text-right mt-1">
                  Ends {formatDistanceToNow(parseISO(bracket.endDate), { addSuffix: true })}
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-[hsl(var(--warning))]" />
                <p className="caption">
                  {bracket.status === 'active' 
                    ? getCurrentStanding(bracket) 
                    : `Starts ${formatDistanceToNow(parseISO(bracket.startDate), { addSuffix: true })}`}
                </p>
              </div>
              <div className="text-[hsl(var(--primary))] flex items-center">
                <span className="caption font-medium">View</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

// Helper function to calculate progress percentage
function calculateProgress(bracket: Bracket): number {
  const startDate = parseISO(bracket.startDate);
  const endDate = parseISO(bracket.endDate);
  const now = new Date();
  
  // If past end date, return 100%
  if (now > endDate) return 100;
  
  // Calculate progress percentage
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = now.getTime() - startDate.getTime();
  
  return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
}

// Helper function to get current standing text
function getCurrentStanding(bracket: Bracket): string {
  const userPoints = bracket.userPoints || 0;
  const aiPoints = bracket.aiPoints || 0;
  
  if (userPoints > aiPoints) {
    return `Leading by ${(userPoints - aiPoints).toFixed(2)}%`;
  } else if (aiPoints > userPoints) {
    return `Trailing by ${(aiPoints - userPoints).toFixed(2)}%`;
  } else {
    return "Tied with AI";
  }
}

export default ActiveBrackets;