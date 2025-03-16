
import React from "react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Prediction } from "@/types";

interface PredictionCardsProps {
  prediction: Prediction;
}

export const PredictionCards: React.FC<PredictionCardsProps> = ({ prediction }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
      <Card className={cn(
        "border-2 shadow-sm relative overflow-hidden",
        prediction.userPrediction === "bullish"
          ? "border-emerald-200 dark:border-emerald-800"
          : "border-red-200 dark:border-red-800"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          prediction.userPrediction === "bullish"
            ? "bg-emerald-500"
            : "bg-red-500"
        )} />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Your Prediction
            {prediction.resolved && prediction.status === "correct" && (
              <Badge className="bg-emerald-500 text-xs">Correct</Badge>
            )}
            {prediction.resolved && prediction.status === "incorrect" && (
              <Badge className="bg-red-500 text-xs">Incorrect</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className={cn(
            "flex items-center gap-2 text-xl font-bold",
            prediction.userPrediction === "bullish" 
              ? "text-emerald-600 dark:text-emerald-500" 
              : "text-red-600 dark:text-red-500"
          )}>
            {prediction.userPrediction === "bullish" ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {prediction.userPrediction === "bullish" ? "Bullish" : "Bearish"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            You predicted that {prediction.targetName} would 
            {prediction.userPrediction === "bullish" ? " rise " : " fall "} 
            in value over {prediction.timeframe === "1d" ? "a day" : 
                          prediction.timeframe === "1w" ? "a week" : "a month"}.
          </p>
        </CardContent>
      </Card>
      
      <Card className={cn(
        "border-2 shadow-sm relative overflow-hidden",
        prediction.aiPrediction === "bullish"
          ? "border-emerald-200 dark:border-emerald-800"
          : "border-red-200 dark:border-red-800"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          prediction.aiPrediction === "bullish"
            ? "bg-emerald-500"
            : "bg-red-500"
        )} />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            AI Prediction
            {prediction.resolved && prediction.aiPrediction === prediction.actualResult && (
              <Badge className="bg-emerald-500 text-xs">Correct</Badge>
            )}
            {prediction.resolved && prediction.aiPrediction !== prediction.actualResult && (
              <Badge className="bg-red-500 text-xs">Incorrect</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className={cn(
            "flex items-center gap-2 text-xl font-bold",
            prediction.aiPrediction === "bullish" 
              ? "text-emerald-600 dark:text-emerald-500" 
              : "text-red-600 dark:text-red-500"
          )}>
            {prediction.aiPrediction === "bullish" ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-sm text-muted-foreground">Confidence:</div>
            <div className="flex items-center flex-1 gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
                <div 
                  key={dot} 
                  className={`w-2 h-3 rounded-sm ${
                    dot <= prediction.aiConfidence 
                      ? (prediction.aiPrediction === "bullish" ? "bg-emerald-500" : "bg-red-500")
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                ></div>
              ))}
            </div>
            <div className="font-medium text-sm">{prediction.aiConfidence}/10</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
