
import React from "react";
import { Award, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Prediction } from "@/lib/prediction/types";

interface PredictionResultsProps {
  prediction: Prediction;
  formatDate: (dateString: string) => string;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({ 
  prediction, 
  formatDate 
}) => {
  if (!prediction.status || 
    (prediction.status !== "complete" && prediction.status !== "completed") || 
    !prediction.endValue) {
    return null;
  }

  const resolvedAtDate = prediction.resolvedAt || "";
  const percentChange = prediction.percentChange !== undefined ? prediction.percentChange :
    ((prediction.endValue - prediction.startingValue) / prediction.startingValue) * 100;
  
  const actualResult = prediction.actualResult || 
    (percentChange >= 0 ? "uptrend" : "downtrend");
  
  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="h-5 w-5 mr-2 text-indigo-500" />
          Prediction Results
        </CardTitle>
        <CardDescription>
          This prediction was resolved on {formatDate(resolvedAtDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Starting Value</div>
            <div className="text-lg font-mono font-medium">${prediction.startingValue.toFixed(2)}</div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Final Value</div>
            <div className="text-lg font-mono font-medium">${prediction.endValue.toFixed(2)}</div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Change</div>
            <div className={cn(
              "text-lg font-mono font-medium flex items-center",
              percentChange >= 0 
                ? "text-emerald-600 dark:text-emerald-500" 
                : "text-red-600 dark:text-red-500"
            )}>
              {percentChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {percentChange >= 0 ? "+" : ""}
              {percentChange.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              actualResult === "uptrend" || actualResult === "bullish"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            )}>
              {actualResult === "uptrend" || actualResult === "bullish" ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <TrendingDown className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Actual Result</div>
              <div className={cn(
                "text-xl font-bold",
                actualResult === "uptrend" || actualResult === "bullish"
                  ? "text-emerald-600 dark:text-emerald-500" 
                  : "text-red-600 dark:text-red-500"
              )}>
                {actualResult === "uptrend" || actualResult === "bullish" ? "Bullish" : "Bearish"}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-end">
            <div className="text-sm font-medium text-muted-foreground">Winner</div>
            <div className="mt-1">
              {prediction.outcome === "user_win" && (
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-base px-3 py-1">
                  🏆 You Beat the AI!
                </Badge>
              )}
              {prediction.outcome === "ai_win" && (
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-base px-3 py-1">
                  🤖 AI Won This Round
                </Badge>
              )}
              {prediction.outcome === "tie" && (
                <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-base px-3 py-1">
                  ✓ Both Correct
                </Badge>
              )}
              {!prediction.outcome && (
                <Badge className="bg-slate-600 hover:bg-slate-700 text-base px-3 py-1">
                  ✗ Result Unavailable
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
