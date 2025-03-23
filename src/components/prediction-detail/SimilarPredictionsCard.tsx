
import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Prediction } from "@/types";
import { isPredictionResolved } from "@/lib/prediction/prediction-adapter";

interface SimilarPredictionsCardProps {
  prediction: Prediction;
  similarPredictions: Prediction[];
  getTimeframeText: (timeframe: string) => string;
}

export const SimilarPredictionsCard: React.FC<SimilarPredictionsCardProps> = ({
  prediction,
  similarPredictions,
  getTimeframeText
}) => {
  const navigate = useNavigate();
  
  // Helper function to determine prediction status badge
  const getStatusBadge = (pred: Prediction) => {
    if (pred.status === "pending") {
      return (
        <Badge variant="outline" className="text-xs">
          Pending
        </Badge>
      );
    }
    
    if (isPredictionResolved(pred)) {
      if (pred.winner === "user" || pred.winner === "both") {
        return (
          <Badge className="text-xs">
            Correct
          </Badge>
        );
      } else {
        return (
          <Badge variant="destructive" className="text-xs">
            Incorrect
          </Badge>
        );
      }
    }
    
    return (
      <Badge variant="outline" className="text-xs">
        {pred.status}
      </Badge>
    );
  };
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <CardTitle className="text-base font-semibold flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
          Similar Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {similarPredictions
            .filter(p => p.id !== prediction.id && p.targetType === prediction.targetType)
            .slice(0, 2)
            .map((pred) => (
              <div 
                key={pred.id} 
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => navigate(`/predictions/${pred.id}`)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{pred.targetName}</span>
                  {getStatusBadge(pred)}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{getTimeframeText(pred.timeframe)}</span>
                  <span>{new Date(pred.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          }
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t p-3">
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => navigate("/predictions/history")}>
          View All Your Predictions
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};
