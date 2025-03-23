
import React from "react";
import { useParams } from "react-router-dom";
import { usePredictionData } from "@/hooks/usePredictionData";
import LoadingScreen from "@/components/LoadingScreen";
import { PredictionDetailView } from "@/components/prediction-detail/PredictionDetailView";
import { mockPredictions, mockStockData } from "@/data/mockData";
import { Prediction, MarketData } from "@/types";

const PredictionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { prediction, timeRemaining, isLoading, error } = usePredictionData(id);

  if (isLoading) {
    return <LoadingScreen message="Loading prediction details..." />;
  }

  if (error || !prediction) {
    return <LoadingScreen error={error || "Prediction not found"} />;
  }

  // Convert mockStockData to MarketData format
  const marketData: MarketData[] = mockStockData.map(stock => ({
    name: stock.name,
    symbol: stock.symbol || stock.name.substring(0, 4).toUpperCase(),
    value: stock.price || 150,
    change: (stock.price || 150) * (stock.changePercent / 100),
    changePercent: stock.changePercent
  }));

  // Ensure mockPredictions conform to the Prediction type
  const typedPredictions: Prediction[] = mockPredictions.map(pred => ({
    ...pred,
    targetType: pred.targetType as any,
    userPrediction: pred.userPrediction as any,
    aiPrediction: pred.aiPrediction as any,
    status: pred.status as any,
    winner: pred.winner as any
  }));

  return (
    <PredictionDetailView
      prediction={prediction}
      timeRemaining={timeRemaining}
      marketData={marketData}
      similarPredictions={typedPredictions}
    />
  );
};

export default PredictionDetail;
