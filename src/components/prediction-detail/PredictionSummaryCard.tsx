
import React from "react";
import { FileText, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PredictionStatusIndicator } from "./PredictionStatusIndicator";
import { PredictionCards } from "./PredictionCards";
import { PredictionComparison } from "./PredictionComparison";
import { PredictionResults } from "./PredictionResults";
import { AIAnalysisCard } from "./AIAnalysisCard";
import { Prediction } from "@/types";
import { isPredictionResolved } from "@/lib/prediction/prediction-adapter";
import { adaptPrediction } from "@/lib/prediction/prediction-adapter";

interface PredictionSummaryCardProps {
  prediction: any; // Allow any prediction type that will be adapted
  timeRemaining: string;
  getStatusBadge: () => JSX.Element;
  formatDate: (dateString: string) => string;
}

export const PredictionSummaryCard: React.FC<PredictionSummaryCardProps> = ({
  prediction,
  timeRemaining,
  getStatusBadge,
  formatDate
}) => {
  const navigate = useNavigate();
  
  // Convert prediction to standard format
  const adaptedPrediction = adaptPrediction(prediction);
  
  // Check if prediction is resolved
  const isResolved = isPredictionResolved(adaptedPrediction);
  
  return (
    <Card className="shadow-md border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-500" />
            Prediction Summary
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          <PredictionStatusIndicator 
            prediction={{
              ...adaptedPrediction,
              resolvedAt: adaptedPrediction.resolvedAt
            }} 
            timeRemaining={timeRemaining} 
          />
          
          <PredictionCards prediction={adaptedPrediction} />
          
          <PredictionComparison prediction={adaptedPrediction} />
          
          {isResolved && adaptedPrediction.endValue && (
            <PredictionResults 
              prediction={adaptedPrediction} 
              formatDate={formatDate} 
            />
          )}
          
          <AIAnalysisCard prediction={adaptedPrediction} />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 border-t bg-slate-50 dark:bg-slate-900">
        <Button variant="outline" onClick={() => navigate("/app/predictions/history")}>
          View All Predictions
        </Button>
        <Button onClick={() => navigate("/app/predict")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
          <TrendingUp className="mr-2 h-4 w-4" />
          Make New Prediction
        </Button>
      </CardFooter>
    </Card>
  );
};
