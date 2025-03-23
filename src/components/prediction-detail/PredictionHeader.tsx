
import React from "react";
import { 
  ArrowLeft, Target, Timer, Calendar, CheckCircle, XCircle, 
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Prediction } from "@/types";
import { isPredictionResolved } from "@/lib/prediction/prediction-adapter";

interface PredictionHeaderProps {
  prediction: Prediction;
  getTimeframeText: (timeframe: string) => string;
}

export const PredictionHeader: React.FC<PredictionHeaderProps> = ({
  prediction,
  getTimeframeText
}) => {
  const navigate = useNavigate();
  const isResolved = isPredictionResolved(prediction);
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">{prediction.targetName} Prediction</h1>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center">
          <Target className="h-4 w-4 mr-1 text-indigo-500" />
          {prediction.targetType.charAt(0).toUpperCase() + prediction.targetType.slice(1)}
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span className="inline-flex items-center">
          <Timer className="h-4 w-4 mr-1 text-indigo-500" />
          {getTimeframeText(prediction.timeframe)}
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span className="inline-flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
          {new Date(prediction.createdAt).toLocaleDateString()}
        </span>
        {isResolved && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <span className="inline-flex items-center">
              {prediction.winner === "user" || prediction.winner === "both" ? (
                <CheckCircle className="h-4 w-4 mr-1 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
              )}
              {prediction.winner === "user" || prediction.winner === "both" ? "Prediction Correct" : "Prediction Incorrect"}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
