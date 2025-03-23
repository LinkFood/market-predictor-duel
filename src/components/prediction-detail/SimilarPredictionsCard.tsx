
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { Prediction } from "@/types";
import { cn } from "@/lib/utils";

interface SimilarPredictionsCardProps {
  prediction: Prediction;
  similarPredictions: Prediction[];
  getTimeframeText: (timeframe: string) => string;
}

export const SimilarPredictionsCard: React.FC<SimilarPredictionsCardProps> = ({
  prediction,
  similarPredictions,
  getTimeframeText
}) => {
  // Filter similar predictions (same target or similar timeframe)
  const filtered = similarPredictions
    .filter(p => p.id !== prediction.id && (
      p.targetName === prediction.targetName || 
      p.timeframe === prediction.timeframe
    ))
    .slice(0, 3);
  
  if (filtered.length === 0) {
    return null;
  }

  // Function to determine prediction result icon and color based on status and winner
  const getPredictionResultClass = (prediction: Prediction) => {
    // Map "complete" or "completed" to result based on winner
    if (prediction.status === "complete" || prediction.status === "completed") {
      if (prediction.winner === "user") {
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      } else if (prediction.winner === "ai") {
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      } else {
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      }
    }
    
    // Default for pending predictions
    return "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  };

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <CardTitle className="text-base font-semibold flex items-center">
          <Archive className="h-4 w-4 mr-2 text-indigo-500" />
          Similar Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {filtered.map(p => (
          <Link 
            key={p.id} 
            to={`/app/predictions/${p.id}`} 
            className="block py-3 hover:bg-gray-50 dark:hover:bg-gray-900/10 -mx-6 px-6 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{p.targetName}</div>
                <div className="text-xs text-muted-foreground">{getTimeframeText(p.timeframe)}</div>
              </div>
              <div className={cn("px-2 py-1 text-xs rounded-full border", getPredictionResultClass(p))}>
                {p.status === "complete" || p.status === "completed" 
                  ? (p.winner === "user" ? "Correct" : p.winner === "ai" ? "Incorrect" : "Tie") 
                  : "Pending"}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
