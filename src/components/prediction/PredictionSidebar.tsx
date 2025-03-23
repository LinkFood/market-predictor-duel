
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Trophy, Flame } from "lucide-react";

// Mock leaderboard data
const mockLeaderboard = [
  {
    userId: "user-1",
    username: "PredictionPro",
    avatarUrl: "",
    points: 3250,
    accuracy: 78.5,
    rank: 1
  },
  {
    userId: "user-2",
    username: "MarketGuru",
    avatarUrl: "",
    points: 2980,
    accuracy: 75.2,
    rank: 2
  },
  {
    userId: "user-3",
    username: "StockNinja",
    avatarUrl: "",
    points: 2845,
    accuracy: 72.1,
    rank: 3
  },
  {
    userId: "user-4",
    username: "TradingWizard",
    avatarUrl: "",
    points: 2690,
    accuracy: 69.5,
    rank: 4
  },
  {
    userId: "user-5",
    username: "InvestorX",
    avatarUrl: "",
    points: 2510,
    accuracy: 68.3,
    rank: 5
  }
];

const PredictionSidebar: React.FC = () => {
  return (
    <div className="space-y-6 pb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            {mockLeaderboard.map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center font-medium text-muted-foreground">
                    {index === 0 ? (
                      <Award className="h-5 w-5 text-amber-500" />
                    ) : index === 1 ? (
                      <Award className="h-5 w-5 text-slate-400" />
                    ) : index === 2 ? (
                      <Award className="h-5 w-5 text-amber-700" />
                    ) : (
                      user.rank
                    )}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-slate-100 text-slate-500">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{user.username}</div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {user.points.toLocaleString()} pts
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-1">
                    {user.accuracy}% acc
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Hot Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-md">
              <div className="font-medium">Apple Inc. (AAPL)</div>
              <div className="text-sm text-muted-foreground mt-1">
                76% of users are bullish for next week
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <div className="font-medium">S&P 500 Index</div>
              <div className="text-sm text-muted-foreground mt-1">
                65% of users predict a rally this month
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <div className="font-medium">Technology Sector</div>
              <div className="text-sm text-muted-foreground mt-1">
                82% AI confidence in upward trend
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionSidebar;
