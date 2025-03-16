
import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TimeframeSelector from "./TimeframeSelector";

interface TrendPredictionProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
  trendPrediction: 'uptrend' | 'downtrend' | null;
  setTrendPrediction: (value: 'uptrend' | 'downtrend' | null) => void;
}

const TrendPrediction: React.FC<TrendPredictionProps> = ({ 
  timeframe, 
  setTimeframe, 
  trendPrediction, 
  setTrendPrediction 
}) => {
  return (
    <div className="space-y-4">
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Your trend prediction</label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            onClick={() => setTrendPrediction("uptrend")}
            className={cn(
              "h-20",
              trendPrediction === "uptrend"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className={cn("h-6 w-6", trendPrediction === "uptrend" ? "text-white" : "text-green-600")} />
              <span>Uptrend</span>
            </div>
          </Button>
          <Button
            type="button"
            onClick={() => setTrendPrediction("downtrend")}
            className={cn(
              "h-20",
              trendPrediction === "downtrend"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <TrendingDown className={cn("h-6 w-6", trendPrediction === "downtrend" ? "text-white" : "text-red-600")} />
              <span>Downtrend</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrendPrediction;
