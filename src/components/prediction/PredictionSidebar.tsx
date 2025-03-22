
import React from "react";
import { Trophy, Sparkles, Calendar, ChevronRight, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarketInfoDisplay from "@/components/MarketInfoDisplay";
import { mockLeaderboard } from "@/data/mockData";

const PredictionSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Market info display */}
      <MarketInfoDisplay />
      
      {/* Hot prediction opportunities */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
              Hot Opportunities
            </CardTitle>
          </div>
          <CardDescription>
            High-confidence predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <h4 className="font-semibold ml-2">NVIDIA (NVDA)</h4>
                </div>
                <Badge variant="outline" className="capitalize bg-amber-50 text-amber-700 border-amber-200">
                  Volatile
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Earnings report tomorrow</p>
            </div>
            <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <h4 className="font-semibold ml-2">S&P 500</h4>
                </div>
                <Badge variant="outline" className="capitalize bg-red-50 text-red-700 border-red-200">
                  Bearish
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Fed announcement expected</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Leaderboard preview */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold">Top Forecasters</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              View All
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1">
            {mockLeaderboard.slice(0, 3).map((user, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                    index === 0 ? "bg-amber-100 text-amber-800" : 
                    index === 1 ? "bg-slate-100 text-slate-800" : 
                    "bg-orange-50 text-orange-800"
                  } text-xs font-bold`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">{Math.round(user.accuracy * 100)}%</span>
                  <span className="text-xs text-muted-foreground">accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t p-3 flex justify-center">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm">
            <Trophy className="h-4 w-4 mr-1.5" />
            <span className="font-medium">Make predictions to join the leaderboard</span>
          </div>
        </CardFooter>
      </Card>
      
      {/* Tip card */}
      <Card className="border-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Prediction Tip</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Consider technical indicators, news events, and broader market trends when making your prediction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionSidebar;
