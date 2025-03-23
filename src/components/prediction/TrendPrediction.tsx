
import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendPredictionProps {
  value: string;
  onChange: (value: string) => void;
}

const TrendPrediction: React.FC<TrendPredictionProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your trend prediction</label>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          onClick={() => onChange("bullish")}
          className={cn(
            "h-20",
            value === "bullish"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className={cn("h-6 w-6", value === "bullish" ? "text-white" : "text-green-600")} />
            <span>Bullish</span>
          </div>
        </Button>
        <Button
          type="button"
          onClick={() => onChange("bearish")}
          className={cn(
            "h-20",
            value === "bearish"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <TrendingDown className={cn("h-6 w-6", value === "bearish" ? "text-white" : "text-red-600")} />
            <span>Bearish</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TrendPrediction;
