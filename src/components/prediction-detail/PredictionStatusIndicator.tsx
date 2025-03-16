
import React from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Prediction } from "@/types";

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
  const percentComplete = prediction.resolved
    ? 100
    : Math.min(
        100,
        ((now.getTime() - new Date(prediction.createdAt).getTime()) /
          (resolveDate.getTime() - new Date(prediction.createdAt).getTime())) *
          100
      );
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-medium">Status:</span>
        </div>
        {prediction.resolved ? (
          <Badge variant="outline" className={cn(
            "font-normal", 
            prediction.status === "correct" 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" 
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          )}>
            {prediction.status === "correct" ? "Correct" : "Incorrect"}
          </Badge>
        ) : (
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{timeRemaining}</span>
        )}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
          <div 
            style={{ width: `${percentComplete}%` }} 
            className={cn(
              "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-500",
              prediction.resolved
                ? prediction.status === "correct"
                  ? "bg-emerald-500"
                  : "bg-red-500"
                : "bg-indigo-500"
            )}
          ></div>
        </div>
      </div>
    </div>
  );
};
