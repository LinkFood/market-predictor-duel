
import React from "react";
import LeaderboardWidget from "@/components/LeaderboardWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { LeaderboardEntry } from "@/lib/prediction/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data to be replaced with real data
const topUsers: LeaderboardEntry[] = [
  {
    userId: "1",
    position: 1,
    username: "TradeMaster",
    avatarUrl: null,
    totalPredictions: 45,
    accuracy: 0.87,
    points: 560,
    winsAgainstAI: 24,
    joinDate: new Date().toISOString()
  },
  {
    userId: "2",
    position: 2,
    username: "InvestorGuru",
    avatarUrl: null,
    totalPredictions: 38,
    accuracy: 0.82,
    points: 480,
    winsAgainstAI: 19,
    joinDate: new Date().toISOString()
  },
  {
    userId: "3",
    position: 3,
    username: "MarketWhiz",
    avatarUrl: null,
    totalPredictions: 42,
    accuracy: 0.76,
    points: 420,
    winsAgainstAI: 16,
    joinDate: new Date().toISOString()
  }
];

interface UserRankCardProps {
  user: LeaderboardEntry;
}

const UserRankCard: React.FC<UserRankCardProps> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full font-bold text-white",
        user.position === 1 ? "bg-amber-500" : 
        user.position === 2 ? "bg-slate-400" : 
        user.position === 3 ? "bg-amber-700" : "bg-slate-600"
      )}>
        {user.position}
      </div>
      
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{user.username}</p>
          {user.position === 1 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              <Award className="h-3 w-3 mr-1" />
              Top Trader
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
            {Math.round(user.accuracy * 100)}% Win Rate
          </span>
          <span>•</span>
          <span>{user.winsAgainstAI} AI Wins</span>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">{user.points} pts</p>
        <p className="text-xs text-muted-foreground">{user.totalPredictions} predictions</p>
      </div>
    </div>
  );
};

const TopPerformers: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          Top Performers
        </CardTitle>
        <Link to="/app/leaderboard">
          <Button variant="ghost" size="sm" className="text-sm">
            <Users className="h-4 w-4 mr-1" />
            Full Leaderboard
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {topUsers.map((user) => (
            <UserRankCard key={user.userId} user={user} />
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link to="/app/leaderboard" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View All Rankings
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
