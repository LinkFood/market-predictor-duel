
/**
 * BracketVisualizer Component
 * Visual display of a stock bracket tournament
 */
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bracket, BracketEntry, BracketMatch, BracketSize } from "@/lib/duel/types";
import { TrendingUp, TrendingDown, Trophy, Zap, AlertTriangle } from "lucide-react";

interface BracketVisualizerProps {
  bracket: Bracket;
}

const BracketVisualizer: React.FC<BracketVisualizerProps> = ({ bracket }) => {
  // Organize entries by player
  const userEntries = bracket.userEntries;
  const aiEntries = bracket.aiEntries;
  
  // Helper to get entry details by ID
  const getEntryById = (id?: string): BracketEntry | undefined => {
    if (!id) return undefined;
    return [...userEntries, ...aiEntries].find(entry => entry.id === id);
  };

  // Generate rounds based on bracket size
  const rounds = generateRounds(bracket.size, bracket.matches, userEntries, aiEntries);
  
  // Get maximum rounds for layout
  const maxRounds = rounds.length;
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <div className="flex justify-center mb-6 space-x-12">
          <div className="text-center">
            <h3 className="text-lg font-bold">Your Picks</h3>
            <p className="text-sm text-gray-500">Total: {bracket.userPoints?.toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold">{bracket.aiPersonality} AI Picks</h3>
            <p className="text-sm text-gray-500">Total: {bracket.aiPoints?.toFixed(2)}%</p>
          </div>
        </div>
      
        <div className="flex justify-around" style={{ minHeight: '400px' }}>
          {rounds.map((round, roundIndex) => (
            <div 
              key={`round-${roundIndex}`} 
              className="flex flex-col justify-around"
              style={{ 
                width: `${100/maxRounds}%`, 
                margin: '0 4px'
              }}
            >
              <h3 className="text-center font-medium mb-4">
                {roundIndex === 0 ? 'First Round' : 
                roundIndex === rounds.length - 1 ? 'Final Round' : 
                `Round ${roundIndex + 1}`}
              </h3>
              
              {round.map((match, matchIndex) => (
                <div key={`match-${roundIndex}-${matchIndex}`} className="mb-6">
                  <MatchCard 
                    match={match} 
                    roundIndex={roundIndex} 
                    matchIndex={matchIndex}
                    isCompleted={bracket.status === 'completed'}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {bracket.status === 'completed' && bracket.winnerId && (
          <motion.div 
            className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold mb-1">
              {bracket.winnerId === 'user' ? 'You Won!' : 'AI Wins This Round'}
            </h2>
            <p className="text-white/80">
              {bracket.winnerId === 'user' 
                ? `Congratulations! Your picks outperformed the ${bracket.aiPersonality} AI!` 
                : `The ${bracket.aiPersonality} AI had better picks this time - challenge it again!`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Component for individual match cards
interface MatchCardProps {
  match: {
    entry1?: BracketEntry;
    entry2?: BracketEntry;
    winnerId?: string;
    completed: boolean;
  };
  roundIndex: number;
  matchIndex: number;
  isCompleted: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  roundIndex, 
  matchIndex,
  isCompleted 
}) => {
  const { entry1, entry2, winnerId, completed } = match;
  
  // Calculate performance
  const entry1Performance = entry1?.percentChange 
    ? (entry1.direction === 'bearish' ? -entry1.percentChange : entry1.percentChange)
    : undefined;
    
  const entry2Performance = entry2?.percentChange
    ? (entry2.direction === 'bearish' ? -entry2.percentChange : entry2.percentChange)
    : undefined;
  
  // Determine if there's an active match
  const hasMatch = entry1 && entry2;
  
  // Determine if entry1 won (if completed)
  const entry1Won = isCompleted && completed && winnerId === entry1?.id;
  const entry2Won = isCompleted && completed && winnerId === entry2?.id;
  
  return (
    <Card className="overflow-hidden border-2 hover:shadow-md transition-shadow">
      <div className="divide-y">
        {/* Entry 1 */}
        <div className={`p-3 ${entry1Won ? 'bg-green-50' : ''}`}>
          {entry1 ? (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center">
                  {entry1.symbol}
                  {entry1.direction === 'bullish' 
                    ? <TrendingUp className="w-4 h-4 ml-1 text-green-600" /> 
                    : <TrendingDown className="w-4 h-4 ml-1 text-red-600" />}
                </div>
                <div className="text-xs text-gray-500">{entry1.name}</div>
              </div>
              
              {isCompleted && entry1Performance !== undefined && (
                <Badge variant={entry1Performance >= 0 ? "default" : "destructive"}>
                  {entry1Performance >= 0 ? '+' : ''}{entry1Performance.toFixed(2)}%
                </Badge>
              )}
              
              {entry1Won && (
                <Badge variant="outline" className="bg-green-100 border-green-300">
                  <Zap className="w-3 h-3 mr-1" />
                  Winner
                </Badge>
              )}
            </div>
          ) : (
            <div className="h-12 flex items-center justify-center text-gray-400 italic">
              {roundIndex === 0 ? (
                <div className="text-sm">Waiting for selection</div>
              ) : (
                <div className="text-sm">Awaiting earlier round</div>
              )}
            </div>
          )}
        </div>
        
        {/* VS divider */}
        {hasMatch && (
          <div className="py-1 px-3 bg-gray-100 text-center text-xs font-medium text-gray-600">
            VS
          </div>
        )}
        
        {/* Entry 2 */}
        <div className={`p-3 ${entry2Won ? 'bg-green-50' : ''}`}>
          {entry2 ? (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center">
                  {entry2.symbol}
                  {entry2.direction === 'bullish' 
                    ? <TrendingUp className="w-4 h-4 ml-1 text-green-600" /> 
                    : <TrendingDown className="w-4 h-4 ml-1 text-red-600" />}
                </div>
                <div className="text-xs text-gray-500">{entry2.name}</div>
              </div>
              
              {isCompleted && entry2Performance !== undefined && (
                <Badge variant={entry2Performance >= 0 ? "default" : "destructive"}>
                  {entry2Performance >= 0 ? '+' : ''}{entry2Performance.toFixed(2)}%
                </Badge>
              )}
              
              {entry2Won && (
                <Badge variant="outline" className="bg-green-100 border-green-300">
                  <Zap className="w-3 h-3 mr-1" />
                  Winner
                </Badge>
              )}
            </div>
          ) : (
            <div className="h-12 flex items-center justify-center text-gray-400 italic">
              {roundIndex === 0 ? (
                <div className="text-sm">Waiting for selection</div>
              ) : (
                <div className="text-sm">Awaiting earlier round</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Helper to generate bracket rounds
function generateRounds(
  size: BracketSize, 
  matches: BracketMatch[],
  userEntries: BracketEntry[],
  aiEntries: BracketEntry[]
) {
  const rounds: Array<Array<{
    entry1?: BracketEntry;
    entry2?: BracketEntry;
    winnerId?: string;
    completed: boolean;
  }>> = [];
  
  // For size 3, there's just one round with direct matchups
  if (size === 3) {
    const round1: any[] = [];
    
    // Each user entry vs matching AI entry
    for (let i = 0; i < 3; i++) {
      const match = matches.find(m => m.roundNumber === 1 && m.matchNumber === i + 1) || { completed: false };
      
      // Add match with proper type that includes winnerId property
      round1.push({
        entry1: userEntries[i],
        entry2: aiEntries[i],
        winnerId: match.winnerId,
        completed: match.completed || false,
      });
    }
    
    rounds.push(round1);
    return rounds;
  }
  
  // For size 6
  if (size === 6) {
    // Round 1: Three matches with initial pairings
    const round1: any[] = [];
    for (let i = 0; i < 3; i++) {
      const match = matches.find(m => m.roundNumber === 1 && m.matchNumber === i + 1) || { completed: false };
      
      round1.push({
        entry1: userEntries[i],
        entry2: aiEntries[i],
        winnerId: match.winnerId,
        completed: match.completed || false,
      });
    }
    rounds.push(round1);
    
    // Round 2: Final with winners
    const round2: any[] = [];
    const finalMatch = matches.find(m => m.roundNumber === 2 && m.matchNumber === 1) || { completed: false };
    
    // Get entries for final based on winners from first round
    const finalEntry1 = finalMatch.entry1Id 
      ? [...userEntries, ...aiEntries].find(e => e.id === finalMatch.entry1Id)
      : undefined;
      
    const finalEntry2 = finalMatch.entry2Id
      ? [...userEntries, ...aiEntries].find(e => e.id === finalMatch.entry2Id)
      : undefined;
    
    round2.push({
      entry1: finalEntry1,
      entry2: finalEntry2,
      winnerId: finalMatch.winnerId,
      completed: finalMatch.completed || false,
    });
    
    rounds.push(round2);
    return rounds;
  }
  
  // For size 9
  if (size === 9) {
    // Round 1: Four matches (8 entries compete, 1 gets a bye)
    const round1: any[] = [];
    for (let i = 0; i < 4; i++) {
      const match = matches.find(m => m.roundNumber === 1 && m.matchNumber === i + 1) || { completed: false };
      
      // Determine which entries are in this match
      const entry1Index = i;
      const entry2Index = i;
      
      round1.push({
        entry1: userEntries[entry1Index],
        entry2: aiEntries[entry2Index],
        winnerId: match.winnerId,
        completed: match.completed || false,
      });
    }
    rounds.push(round1);
    
    // Round 2: Two semifinals
    const round2: any[] = [];
    for (let i = 0; i < 2; i++) {
      const match = matches.find(m => m.roundNumber === 2 && m.matchNumber === i + 1) || { completed: false };
      
      // Get entries for semifinal based on winners from first round
      const semifinalEntry1 = match.entry1Id 
        ? [...userEntries, ...aiEntries].find(e => e.id === match.entry1Id)
        : undefined;
        
      const semifinalEntry2 = match.entry2Id
        ? [...userEntries, ...aiEntries].find(e => e.id === match.entry2Id)
        : undefined;
      
      round2.push({
        entry1: semifinalEntry1,
        entry2: semifinalEntry2,
        winnerId: match.winnerId,
        completed: match.completed || false,
      });
    }
    rounds.push(round2);
    
    // Round 3: Final match
    const round3: any[] = [];
    const finalMatch = matches.find(m => m.roundNumber === 3 && m.matchNumber === 1) || { completed: false };
    
    // Get entries for final based on winners from semifinals
    const finalEntry1 = finalMatch.entry1Id 
      ? [...userEntries, ...aiEntries].find(e => e.id === finalMatch.entry1Id)
      : undefined;
      
    const finalEntry2 = finalMatch.entry2Id
      ? [...userEntries, ...aiEntries].find(e => e.id === finalMatch.entry2Id)
      : undefined;
    
    round3.push({
      entry1: finalEntry1,
      entry2: finalEntry2,
      winnerId: finalMatch.winnerId,
      completed: finalMatch.completed || false,
    });
    
    rounds.push(round3);
    return rounds;
  }
  
  // Default fallback, should not reach here
  return [[]];
}

export default BracketVisualizer;
