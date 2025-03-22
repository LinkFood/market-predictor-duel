
import React from "react";
import { ArrowUp, ArrowDown, BadgeCheck, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Prediction } from "@/types";

interface PredictionComparisonProps {
  prediction: Prediction;
}

const PredictionComparison: React.FC<PredictionComparisonProps> = ({ prediction }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">Your Prediction</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`flex items-center gap-2 text-xl font-bold ${
              prediction?.userPrediction === "uptrend" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
            }`}>
              {prediction?.userPrediction === "uptrend" ? (
                <ArrowUp className="h-6 w-6" />
              ) : (
                <ArrowDown className="h-6 w-6" />
              )}
              {prediction?.userPrediction === "uptrend" ? "Bullish" : "Bearish"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              You predict {prediction?.targetName} will 
              {prediction?.userPrediction === "uptrend" ? " increase " : " decrease "} 
              in value over the next {prediction?.timeframe === "1d" ? "day" : 
              prediction?.timeframe === "1w" ? "week" : "month"}.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">AI Prediction</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`flex items-center gap-2 text-xl font-bold ${
              prediction?.aiPrediction === "uptrend" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
            }`}>
              {prediction?.aiPrediction === "uptrend" ? (
                <ArrowUp className="h-6 w-6" />
              ) : (
                <ArrowDown className="h-6 w-6" />
              )}
              {prediction?.aiPrediction === "uptrend" ? "Bullish" : "Bearish"}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div 
                    key={star} 
                    className={`w-2 h-4 rounded-sm ${
                      star <= (prediction?.aiConfidence || 0) 
                        ? "bg-indigo-500" 
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-sm font-medium ml-1">{prediction?.aiConfidence}/10</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agreement/Disagreement banner */}
      <Alert className={`border-0 ${
        prediction.userPrediction === prediction.aiPrediction
          ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
          : "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      }`}>
        {prediction.userPrediction === prediction.aiPrediction ? (
          <BadgeCheck className="h-5 w-5 mr-2" />
        ) : (
          <BellRing className="h-5 w-5 mr-2" />
        )}
        <AlertDescription className="font-medium">
          {prediction.userPrediction === prediction.aiPrediction
            ? "You and the AI agree on this prediction! This increases your chance of success."
            : "You and the AI disagree on this prediction. One of you will be right...who will it be?"}
        </AlertDescription>
      </Alert>
    </>
  );
};

export default PredictionComparison;
