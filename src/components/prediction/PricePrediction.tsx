
import React from "react";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import TimeframeSelector from "./TimeframeSelector";

interface PricePredictionProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
  pricePrediction: string;
  setPricePrediction: (value: string) => void;
  currentPrice?: number;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ 
  timeframe, 
  setTimeframe, 
  pricePrediction, 
  setPricePrediction,
  currentPrice
}) => {
  return (
    <div className="space-y-4">
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Your price prediction</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="number"
            placeholder="Enter your price prediction"
            value={pricePrediction}
            onChange={(e) => setPricePrediction(e.target.value)}
            className="pl-10"
            step="0.01"
            min="0"
          />
        </div>
        {currentPrice !== undefined && (
          <p className="text-xs text-gray-500">
            Current price: ${currentPrice.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricePrediction;
