
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FEATURES } from "@/lib/config";
import { Prediction } from "@/types";
import { PredictionComparison } from "./PredictionComparison";
import { AIAnalysisSection } from "./AIAnalysisSection";
import { NextStepsSection } from "./NextStepsSection";

interface PredictionResultProps {
  prediction: Prediction | null;
  onNewPrediction: () => void;
  onSavePrediction: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ 
  prediction,
  onNewPrediction,
  onSavePrediction
}) => {
  if (!prediction) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>Error loading prediction results</AlertDescription>
          </Alert>
          <Button onClick={onNewPrediction}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  console.log("Rendering prediction result:", prediction);
  
  return (
    <Card className="w-full animate-scale-in shadow-md border-0">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle>Prediction Analysis</CardTitle>
          <Badge variant="outline" className="font-normal bg-white dark:bg-slate-800">
            {prediction?.timeframe === "1d" ? "1 Day" : 
            prediction?.timeframe === "1w" ? "1 Week" : "1 Month"}
          </Badge>
        </div>
        <CardDescription>
          {prediction?.targetType === "market" ? "Market" : 
          prediction?.targetType === "sector" ? "Sector" : "Stock"}: <span className="font-medium">{prediction?.targetName}</span> starting at ${prediction?.startingValue?.toFixed(2)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-6 space-y-8">
          {/* Predictions comparison */}
          <PredictionComparison prediction={prediction} />

          {/* AI Analysis */}
          {prediction.aiAnalysis && FEATURES.enableAIAnalysis && (
            <AIAnalysisSection prediction={prediction} />
          )}
          
          {/* What happens next */}
          <NextStepsSection prediction={prediction} />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 border-t bg-slate-50 dark:bg-slate-900">
        <Button variant="outline" onClick={onNewPrediction}>
          Make Another Prediction
        </Button>
        <Button onClick={onSavePrediction} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
          Save Prediction
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictionResult;
