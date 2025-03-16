
import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, ChevronRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/types";

interface TopPerformersProps {
  leaderboard: LeaderboardEntry[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({ leaderboard }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")} className="h-8 text-xs">
            Full Leaderboard
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div key={user.userId} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  index === 0 ? "bg-amber-100 text-amber-700" : 
                  index === 1 ? "bg-slate-100 text-slate-700" : 
                  "bg-amber-50 text-amber-800"
                }`}>
                  {index === 0 ? (
                    <Trophy className="h-4 w-4 text-amber-500" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {user.username.substring(0, 2).toUpperCase()}
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
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
