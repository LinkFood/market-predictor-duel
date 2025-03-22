
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  CheckCircle, XCircle, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockPredictions, mockStockData } from "@/data/mockData";
import { Prediction } from "@/lib/prediction/types";
import { cn } from "@/lib/utils";
import { PredictionHeader } from "@/components/prediction-detail/PredictionHeader";
import { PredictionSummaryCard } from "@/components/prediction-detail/PredictionSummaryCard";
import { PredictionDetailsCard } from "@/components/prediction-detail/PredictionDetailsCard";
import { MarketDataCard } from "@/components/prediction-detail/MarketDataCard";
import { SimilarPredictionsCard } from "@/components/prediction-detail/SimilarPredictionsCard";

const PredictionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const found = mockPredictions.find(p => p.id === id);
    if (found) {
      // Need to adapt mockPredictions format to lib/prediction/types.Prediction format
      // This is only needed because this is mock data in a transitional phase
      setPrediction(found as unknown as Prediction);
    }
  }, [id]);

  useEffect(() => {
    if (!prediction || prediction.status === 'complete' || prediction.status === 'completed') return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const resolveDate = new Date(prediction.resolvesAt);
      const diff = resolveDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining("Resolving...");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [prediction]);

  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case "1d": return "1 Day";
      case "1w": return "1 Week";
      case "1m": return "1 Month";
      default: return timeframe;
    }
  };

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
      if (prediction.outcome === "user_win") {
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
            prediction={prediction}
            timeRemaining={timeRemaining}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
          />
        </div>

        <div className="space-y-6">
          <PredictionDetailsCard 
            prediction={prediction}
            formatDate={formatDate}
            getTimeframeText={getTimeframeText}
          />
          
          <MarketDataCard 
            prediction={prediction}
            marketData={mockStockData}
          />
          
          <SimilarPredictionsCard 
            prediction={prediction}
            similarPredictions={mockPredictions}
            getTimeframeText={getTimeframeText}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;
