
import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Prediction } from "@/types";
import { cn } from "@/lib/utils";
import { PredictionHeader } from "@/components/prediction-detail/PredictionHeader";
import { PredictionSummaryCard } from "@/components/prediction-detail/PredictionSummaryCard";
import { PredictionDetailsCard } from "@/components/prediction-detail/PredictionDetailsCard";
import { MarketDataCard } from "@/components/prediction-detail/MarketDataCard";
import { SimilarPredictionsCard } from "@/components/prediction-detail/SimilarPredictionsCard";
import { formatDate, getTimeframeText } from "@/lib/prediction/formatting";
import { MarketData } from "@/types";

interface PredictionDetailViewProps {
  prediction: Prediction;
  timeRemaining: string;
  marketData: MarketData[];
  similarPredictions: Prediction[];
}

export const PredictionDetailView: React.FC<PredictionDetailViewProps> = ({
  prediction,
  timeRemaining,
  marketData,
  similarPredictions
}) => {
  const getStatusBadge = () => {
    if (prediction.status === "pending") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 font-normal bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    }
    
    if (prediction.status === "complete" || prediction.status === "completed") {
      if (prediction.winner === "user" || prediction.winner === "both") {
        return (
          <Badge variant="outline" className="flex items-center gap-1 font-normal bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="h-3 w-3" />
            <span>Correct</span>
          </Badge>
        );
      }
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 font-normal bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
        <XCircle className="h-3 w-3" />
        <span>Incorrect</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <PredictionHeader 
        prediction={prediction} 
        getTimeframeText={getTimeframeText} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PredictionSummaryCard 
            prediction={{
              ...prediction,
              ticker: prediction.ticker || prediction.targetName || "",
              predictionType: prediction.predictionType || "trend"
            }}
            timeRemaining={timeRemaining}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
          />
        </div>

        <div className="space-y-6">
          <PredictionDetailsCard 
            prediction={{
              ...prediction,
              ticker: prediction.ticker || prediction.targetName || "",
              predictionType: prediction.predictionType || "trend"
            }}
            formatDate={formatDate}
            getTimeframeText={getTimeframeText}
          />
          
          <MarketDataCard 
            prediction={prediction}
            marketData={marketData}
          />
          
          <SimilarPredictionsCard 
            prediction={prediction}
            similarPredictions={similarPredictions}
            getTimeframeText={getTimeframeText}
          />
        </div>
      </div>
    </div>
  );
};
