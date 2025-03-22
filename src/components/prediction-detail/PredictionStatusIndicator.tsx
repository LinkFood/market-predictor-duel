
import React from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Prediction } from "@/lib/prediction/types";

interface PredictionStatusIndicatorProps {
  prediction: Prediction;
  timeRemaining: string;
}

export const PredictionStatusIndicator: React.FC<PredictionStatusIndicatorProps> = ({
  prediction,
  timeRemaining
}) => {
  const resolveDate = new Date(prediction.resolvesAt);
  const now = new Date();
  const percentComplete = prediction.status === "complete" || prediction.status === "completed"
    ? 100
    : Math.min(
        100,
        ((now.getTime() - new Date(prediction.createdAt).getTime()) /
          (resolveDate.getTime() - new Date(prediction.createdAt).getTime())) *
          100
      );
  
  const getStatusBadge = () => {
    if (prediction.status === "pending") {
      return (
        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
          {timeRemaining ? timeRemaining : "Pending resolution"}
        </span>
      );
    } else if (prediction.status === "complete" || prediction.status === "completed") {
      if (prediction.outcome === "user_win") {
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
            You Won!
          </Badge>
        );
      } else if (prediction.outcome === "ai_win") {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            AI Won
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            Tie
          </Badge>
        );
      }
    }
    
    return (
      <Badge variant="outline">
        {prediction.status}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-medium">Status:</span>
        </div>
        {getStatusBadge()}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
          <div 
            style={{ width: `${percentComplete}%` }} 
            className={cn(
              "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-500",
              prediction.status === "complete" || prediction.status === "completed"
                ? prediction.outcome === "user_win"
                  ? "bg-emerald-500"
                  : prediction.outcome === "ai_win"
                  ? "bg-red-500"
                  : "bg-blue-500"
                : "bg-indigo-500"
            )}
          ></div>
        </div>
      </div>
    </div>
  );
};
