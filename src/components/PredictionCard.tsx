
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Clock, CheckCircle, XCircle } from "lucide-react";
import { Prediction } from "@/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PredictionCardProps {
  prediction: Prediction;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case "1d":
        return "1 Day";
      case "1w":
        return "1 Week";
      case "1m":
        return "1 Month";
      default:
        return timeframe;
    }
  };

  const getStatusBadge = () => {
    if (!prediction.resolved) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    }
    
    if (prediction.status === "correct") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Correct</span>
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        <span>Incorrect</span>
      </Badge>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{prediction.targetName}</CardTitle>
            <CardDescription>
              {prediction.targetType.charAt(0).toUpperCase() + prediction.targetType.slice(1)} • {getTimeframeText(prediction.timeframe)}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Your Prediction</div>
            <div className={cn(
              "flex items-center gap-2 font-semibold",
              prediction.userPrediction === "bullish" ? "bullish" : "bearish"
            )}>
              {prediction.userPrediction === "bullish" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {prediction.userPrediction === "bullish" ? "Bullish" : "Bearish"}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">AI Prediction</div>
            <div className={cn(
              "flex items-center gap-2 font-semibold",
              prediction.aiPrediction === "bullish" ? "bullish" : "bearish"
            )}>
              {prediction.aiPrediction === "bullish" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"}
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Created: </span>
          {formatDate(prediction.createdAt)}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Resolves: </span>
          {formatDate(prediction.resolvesAt)}
        </div>
        {prediction.resolved && prediction.actualResult && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-1">Result:</div>
            <div className={cn(
              "flex items-center gap-2 font-semibold",
              prediction.actualResult === "bullish" ? "bullish" : "bearish"
            )}>
              {prediction.actualResult === "bullish" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {prediction.actualResult === "bullish" ? "Bullish" : "Bearish"} 
              {prediction.percentChange !== undefined && (
                <span>({prediction.percentChange >= 0 ? "+" : ""}{prediction.percentChange.toFixed(2)}%)</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/predictions/${prediction.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictionCard;
