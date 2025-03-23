
import React from "react";
import { useParams } from "react-router-dom";
import { mockStockData } from "@/data/mockData";
import { usePredictionData } from "@/hooks/usePredictionData";
import LoadingScreen from "@/components/LoadingScreen";
import { PredictionDetailView } from "@/components/prediction-detail/PredictionDetailView";
import { mockPredictions } from "@/data/mockData";

const PredictionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { prediction, timeRemaining, isLoading, error } = usePredictionData(id);

  if (isLoading) {
    return <LoadingScreen message="Loading prediction details..." />;
  }

  if (error || !prediction) {
    return <LoadingScreen error={error || "Prediction not found"} />;
  }

  return (
    <PredictionDetailView
      prediction={prediction}
      timeRemaining={timeRemaining}
      marketData={mockStockData}
      similarPredictions={mockPredictions}
    />
  );
};

export default PredictionDetail;
