import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, GitFork, Trophy, Clock, ArrowUpRight, Swords, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Bracket } from "@/lib/duel/types";
import { formatDistanceToNow, parseISO, differenceInDays } from "date-fns";
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
    <motion.section className="glass-panel p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Swords className="h-5 w-5 text-[hsl(var(--primary))]" />
          Active Duels
        </h3>
        <Link to="/app/brackets" className="btn-primary btn-sm flex items-center gap-1">
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      
      {displayBrackets.length === 0 ? (
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <GitFork className="h-10 w-10 text-[hsl(var(--muted-foreground))] mb-3" />
          <p className="font-medium text-lg mb-1">No active duels</p>
          <p className="text-[hsl(var(--muted-foreground))] mb-5">Create a bracket to start competing against AI</p>
          <Link to="/app/brackets/create" className="btn-primary flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Create Your First Duel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayBrackets.map((bracket) => (
            <Link
              key={bracket.id}
              to={`/app/brackets/${bracket.id}`}
              className="glass-card p-5 flex flex-col touch-scale hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-semibold">{bracket.name}</p>
                    <span className="badge badge-sm badge-primary">{bracket.size} stocks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[hsl(var(--muted-foreground))]">vs</p>
                    <p className="font-medium text-[hsl(var(--primary))]">{bracket.aiPersonality} AI</p>
                  </div>
                </div>
                
                {bracket.status === 'active' ? (
                  <span className="badge badge-success flex items-center gap-1 px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    Active
                  </span>
                ) : (
                  <span className="badge badge-warning flex items-center gap-1 px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    Starting Soon
                  </span>
                )}
              </div>
              
              {/* Visual Bracket Preview */}
              <div className="relative bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 bg-white dark:bg-slate-800 rounded-full px-3 py-1 shadow-sm">
                  <p className="text-xs font-semibold">Stock Matchups</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
                    <p className="text-xs uppercase text-center mb-1 font-medium">Your Picks</p>
                    <div className="space-y-1.5">
                      {bracket.userEntries.slice(0, 3).map((entry, i) => (
                        <div key={`user-${i}`} className="bg-white dark:bg-slate-800 rounded-md px-2 py-1 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold">{entry?.symbol || '—'}</span>
                          {entry?.direction === 'bullish' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                      ))}
                      {bracket.userEntries.length === 0 && (
                        <div className="text-center text-xs py-1">No picks yet</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-2 rounded-lg">
                    <p className="text-xs uppercase text-center mb-1 font-medium">AI Picks</p>
                    <div className="space-y-1.5">
                      {bracket.aiEntries.slice(0, 3).map((entry, i) => (
                        <div key={`ai-${i}`} className="bg-white dark:bg-slate-800 rounded-md px-2 py-1 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold">{entry?.symbol || '—'}</span>
                          {entry?.direction === 'bullish' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                      ))}
                      {bracket.aiEntries.length === 0 && (
                        <div className="text-center text-xs py-1">Waiting...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tournament Progress */}
              <div className="mb-4">
                {bracket.status === 'active' ? (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Tournament Progress</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {Math.round(calculateProgress(bracket))}% complete
                      </p>
                    </div>
                    <Progress value={calculateProgress(bracket)} className="h-2 mb-1" />
                    <p className="text-xs text-right text-[hsl(var(--muted-foreground))]">
                      Ends {formatDistanceToNow(parseISO(bracket.endDate), { addSuffix: true })}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Starting Soon</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {differenceInDays(parseISO(bracket.startDate), new Date()) <= 0 
                          ? 'Today' 
                          : `In ${differenceInDays(parseISO(bracket.startDate), new Date())} days`}
                      </p>
                    </div>
                    <Progress value={0} className="h-2 mb-1" />
                    <p className="text-xs text-right text-[hsl(var(--muted-foreground))]">
                      Duration: {differenceInDays(parseISO(bracket.endDate), parseISO(bracket.startDate))} days
                    </p>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4.5 w-4.5 text-amber-500" />
                  <p className="font-medium">
                    {bracket.status === 'active' 
                      ? getCurrentStanding(bracket) 
                      : `Starts ${formatDistanceToNow(parseISO(bracket.startDate), { addSuffix: true })}`}
                  </p>
                </div>
                <div className="btn-primary btn-sm flex items-center gap-1.5">
                  <span>View Duel</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {displayBrackets.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Link to="/app/brackets/create" className="btn-outline flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Create New Duel
          </Link>
        </div>
      )}
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