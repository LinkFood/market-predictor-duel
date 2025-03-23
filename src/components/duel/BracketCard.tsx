/**
 * BracketCard Component
 * Card display for a bracket on dashboard
 */
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Trophy, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle
} from "lucide-react";
import { Bracket } from "@/lib/duel/types";
import { motion } from "framer-motion";
import { format, isPast, parseISO } from "date-fns";

interface BracketCardProps {
  bracket: Bracket;
}

const BracketCard: React.FC<BracketCardProps> = ({ bracket }) => {
  // Calculate progress percentage for active brackets
  const getProgressPercentage = () => {
    if (bracket.status === 'completed') return 100;
    if (bracket.status === 'pending') return 0;
    
    const startDate = parseISO(bracket.startDate);
    const endDate = parseISO(bracket.endDate);
    const now = new Date();
    
    // If past end date, return 100%
    if (isPast(endDate)) return 100;
    
    // Calculate progress percentage
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    
    return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  };
  
  // Format timeframe as human readable
  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return timeframe;
    }
  };
  
  // Get status badge
  const getStatusBadge = () => {
    switch (bracket.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Completed</Badge>;
      default:
        return null;
    }
  };

  // Determine score display based on status
  const getScoreDisplay = () => {
    const userScore = bracket.userPoints?.toFixed(2) || '0.00';
    const aiScore = bracket.aiPoints?.toFixed(2) || '0.00';
    
    if (bracket.status === 'completed') {
      // Show winner trophy for completed brackets
      return (
        <div className="flex items-center space-x-2">
          <div className={bracket.winnerId === 'user' ? 'font-bold text-green-600' : ''}>
            You: {userScore}%
          </div>
          <div>vs</div>
          <div className={bracket.winnerId === 'ai' ? 'font-bold text-green-600' : ''}>
            AI: {aiScore}%
          </div>
          {bracket.winnerId && (
            <Trophy className={`h-4 w-4 ${bracket.winnerId === 'user' ? 'text-yellow-500' : 'text-gray-500'}`} />
          )}
        </div>
      );
    } else if (bracket.status === 'active') {
      // Show current scores for active brackets
      return (
        <div className="flex items-center space-x-2">
          <div>You: {userScore}%</div>
          <div>vs</div>
          <div>AI: {aiScore}%</div>
          <Clock className="h-4 w-4 text-blue-500" />
        </div>
      );
    } else {
      // Show just the matchup for pending brackets
      return (
        <div className="flex items-center space-x-2">
          <div>You vs {bracket.aiPersonality} AI</div>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      );
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = getProgressPercentage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/app/brackets/${bracket.id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{bracket.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(parseISO(bracket.startDate), 'MMM d')} - {format(parseISO(bracket.endDate), 'MMM d')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge()}
                  <span className="text-sm text-gray-500 mt-1">
                    {formatTimeframe(bracket.timeframe)} • {bracket.size} stocks
                  </span>
                </div>
              </div>
            </div>
            
            {/* Stock Preview */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Your Picks</div>
                <div className="text-sm font-medium">{bracket.aiPersonality} AI</div>
              </div>
              
              {/* Stock Comparison - First 3 stocks only */}
              <div className="space-y-2">
                {Array.from({ length: Math.min(3, bracket.size) }).map((_, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-mono">{bracket.userEntries[index]?.symbol}</span>
                      {bracket.userEntries[index]?.direction === 'bullish' ? (
                        <TrendingUp className="h-3 w-3 ml-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 ml-1 text-red-600" />
                      )}
                    </div>
                    <div className="text-gray-400">vs</div>
                    <div className="flex items-center">
                      <span className="font-mono">{bracket.aiEntries[index]?.symbol}</span>
                      {bracket.aiEntries[index]?.direction === 'bullish' ? (
                        <TrendingUp className="h-3 w-3 ml-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 ml-1 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* If more than 3 stocks, show indicator */}
                {bracket.size > 3 && (
                  <div className="text-center text-xs text-gray-500 mt-1">
                    +{bracket.size - 3} more stocks
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress Bar (for active brackets) */}
            {bracket.status === 'active' && (
              <div className="px-4 py-2">
                <Progress value={progressPercentage} className="h-1.5" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Started</span>
                  <span>{Math.round(progressPercentage)}% complete</span>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 border-t flex justify-between items-center">
            {getScoreDisplay()}
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default BracketCard;