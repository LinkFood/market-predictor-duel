
import React from "react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Prediction } from "@/lib/prediction/types";

interface PredictionCardsProps {
  prediction: Prediction;
}

export const PredictionCards: React.FC<PredictionCardsProps> = ({ prediction }) => {
  // Helper to determine if a prediction is "bullish/uptrend" or "bearish/downtrend"
  const isBullish = (pred: string) => 
    pred === "bullish" || pred === "uptrend";
  
  // Helper to determine if a prediction was correct
  const wasCorrect = (actualTrend: string | undefined, predictedTrend: string) => {
    if (!actualTrend) return false;
    
    const actualBullish = actualTrend === "uptrend" || actualTrend === "bullish";
    const predictionBullish = isBullish(predictedTrend);
    
    return actualBullish === predictionBullish;
  };
  
  const actualResult = prediction.actualResult || 
    ((prediction.status === "complete" || prediction.status === "completed") && 
    prediction.endValue && prediction.startingValue &&
    prediction.endValue > prediction.startingValue ? "uptrend" : "downtrend");
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
      <Card className={cn(
        "border-2 shadow-sm relative overflow-hidden",
        isBullish(prediction.userPrediction)
          ? "border-emerald-200 dark:border-emerald-800"
          : "border-red-200 dark:border-red-800"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          isBullish(prediction.userPrediction)
            ? "bg-emerald-500"
            : "bg-red-500"
        )} />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Your Prediction
            {(prediction.status === "complete" || prediction.status === "completed") && wasCorrect(actualResult, prediction.userPrediction) && (
              <Badge className="bg-emerald-500 text-xs">Correct</Badge>
            )}
            {(prediction.status === "complete" || prediction.status === "completed") && !wasCorrect(actualResult, prediction.userPrediction) && (
              <Badge className="bg-red-500 text-xs">Incorrect</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className={cn(
            "flex items-center gap-2 text-xl font-bold",
            isBullish(prediction.userPrediction) 
              ? "text-emerald-600 dark:text-emerald-500" 
              : "text-red-600 dark:text-red-500"
          )}>
            {isBullish(prediction.userPrediction) ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {isBullish(prediction.userPrediction) ? "Bullish" : "Bearish"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            You predicted that {prediction.targetName} would 
            {isBullish(prediction.userPrediction) ? " rise " : " fall "} 
            in value over {prediction.timeframe === "1d" ? "a day" : 
                          prediction.timeframe === "1w" ? "a week" : "a month"}.
          </p>
        </CardContent>
      </Card>
      
      <Card className={cn(
        "border-2 shadow-sm relative overflow-hidden",
        isBullish(prediction.aiPrediction)
          ? "border-emerald-200 dark:border-emerald-800"
          : "border-red-200 dark:border-red-800"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          isBullish(prediction.aiPrediction)
            ? "bg-emerald-500"
            : "bg-red-500"
        )} />
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            AI Prediction
            {(prediction.status === "complete" || prediction.status === "completed") && wasCorrect(actualResult, prediction.aiPrediction) && (
              <Badge className="bg-emerald-500 text-xs">Correct</Badge>
            )}
            {(prediction.status === "complete" || prediction.status === "completed") && !wasCorrect(actualResult, prediction.aiPrediction) && (
              <Badge className="bg-red-500 text-xs">Incorrect</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className={cn(
            "flex items-center gap-2 text-xl font-bold",
            isBullish(prediction.aiPrediction) 
              ? "text-emerald-600 dark:text-emerald-500" 
              : "text-red-600 dark:text-red-500"
          )}>
            {isBullish(prediction.aiPrediction) ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {isBullish(prediction.aiPrediction) ? "Bullish" : "Bearish"}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-sm text-muted-foreground">Confidence:</div>
            <div className="flex items-center flex-1 gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
                <div 
                  key={dot} 
                  className={`w-2 h-3 rounded-sm ${
                    dot <= prediction.aiConfidence 
                      ? (isBullish(prediction.aiPrediction) ? "bg-emerald-500" : "bg-red-500")
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
