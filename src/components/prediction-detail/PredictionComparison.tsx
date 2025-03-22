
import React from "react";
import { Flame, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Prediction } from "@/lib/prediction/types";

interface PredictionComparisonProps {
  prediction: Prediction;
}

export const PredictionComparison: React.FC<PredictionComparisonProps> = ({ prediction }) => {
  return (
    <Alert className={cn(
      "border-0",
      prediction.userPrediction === prediction.aiPrediction
        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
        : "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
    )}>
      {prediction.userPrediction === prediction.aiPrediction ? (
        <Flame className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
      )}
      <AlertDescription className="font-medium">
        {prediction.userPrediction === prediction.aiPrediction
          ? "You and the AI are aligned on this prediction! This is often a strong signal."
          : "You and the AI have different outlooks. Only one can be right - who will win?"}
      </AlertDescription>
    </Alert>
  );
};
