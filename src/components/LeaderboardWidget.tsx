
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, ChevronRight, Crown, ArrowUp, Medal } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardEntry } from "@/lib/prediction/types";
import { getLeaderboard } from "@/lib/prediction/leaderboard";
import { useAuth } from "@/lib/auth-context";

interface LeaderboardWidgetProps {
  limit?: number;
  showFooter?: boolean;
  className?: string;
  hideHeader?: boolean;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ 
  limit = 3, 
  showFooter = true,
  className = "",
  hideHeader = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data.slice(0, limit));
        
        // Find current user's rank
        if (user) {
          const userEntry = data.findIndex(entry => entry.userId === user.id);
          if (userEntry !== -1) {
            setUserRank(userEntry + 1);
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [limit, user]);
  
  // Get icon based on position
  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="h-4 w-4 text-amber-500" />;
    if (position === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (position === 3) return <Medal className="h-4 w-4 text-amber-700" />;
    return <span>{position}</span>;
  };
  
  return (
    <Card className={`shadow-sm border-0 ${className}`}>
      {!hideHeader && (
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Top Performers
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/app/leaderboard")} 
              className="h-8 text-xs"
            >
              Full Leaderboard
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={hideHeader ? "pt-4" : "p-0"}>
        {loading ? (
          <div className="p-4 space-y-4">
            {Array(limit).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No leaderboard data yet</p>
            <p className="text-sm mt-1">Make predictions to join the leaderboard!</p>
          </div>
        ) : (
          <div className={hideHeader ? "space-y-4" : "divide-y"}>
            {leaderboard.map((user) => (
              <div key={user.userId} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    user.position === 1 ? "bg-amber-100 text-amber-700" : 
                    user.position === 2 ? "bg-slate-100 text-slate-700" : 
                    "bg-amber-50 text-amber-800"
                  }`}>
                    {getPositionIcon(user.position)}
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatarUrl || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Win rate: {Math.round(user.accuracy * 100)}% ({user.totalPredictions} predictions)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{user.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showFooter && user && userRank && userRank > limit && (
          <CardFooter className="py-3 px-4 border-t bg-muted/30">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <span className="text-primary text-xs font-medium">#{userRank}</span>
                </div>
                <span>Your Rank</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/app/predict")}>
                <ArrowUp className="mr-2 h-3 w-3" />
                Improve Rank
              </Button>
            </div>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
