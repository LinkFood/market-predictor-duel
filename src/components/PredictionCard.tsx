
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, Trophy, AlertCircle, 
  TrendingUp, TrendingDown, ArrowRight, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Prediction } from "@/lib/prediction/types";

interface PredictionCardProps {
  prediction: Prediction;
  compact?: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, compact = false }) => {
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
      case "2w":
        return "2 Weeks";
      case "1m":
        return "1 Month";
      case "3m":
        return "3 Months";
      default:
        return timeframe;
    }
  };

  const getStatusBadge = () => {
    if (prediction.status === "pending") {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    }
    
    if (prediction.outcome === "user_win") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          <span>You Won!</span>
        </Badge>
      );
    } else if (prediction.outcome === "ai_win") {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>AI Won</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <ArrowRight className="h-3 w-3" />
          <span>Tie</span>
        </Badge>
      );
    }
  };

  const renderPredictionValue = (value: string, type: string) => {
    if (type === 'price') {
      return (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span>{value}</span>
        </div>
      );
    } else {
      if (value === 'uptrend' || value === 'bullish') {
        return (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>Uptrend</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="h-4 w-4" />
            <span>Downtrend</span>
          </div>
        );
      }
    }
  };

  return (
    <Card className={cn("h-full", compact ? "overflow-hidden" : "")}>
      <CardHeader className={compact ? "p-3 pb-2" : "pb-2"}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={cn("line-clamp-1", compact ? "text-base" : "text-lg")}>
              {prediction.targetName}
            </CardTitle>
            <CardDescription>
              {prediction.ticker} • {getTimeframeText(prediction.timeframe)}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className={compact ? "p-3 pt-0" : ""}>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Your Prediction</div>
            <div className="font-medium">
              {renderPredictionValue(prediction.userPrediction, prediction.predictionType)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">AI Prediction</div>
            <div className="font-medium">
              {renderPredictionValue(prediction.aiPrediction, prediction.predictionType)}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <div>Created: {formatDate(prediction.createdAt)}</div>
          {(prediction.status === "completed" || prediction.status === "complete") && prediction.resolvedAt && (
            <div>Resolved: {formatDate(prediction.resolvedAt)}</div>
          )}
        </div>
        
        {(prediction.status === "completed" || prediction.status === "complete") && prediction.endValue && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-1">Final Price:</div>
            <div className="font-medium flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {Number(prediction.endValue).toFixed(2)}
              <span className={cn(
                "text-xs",
                Number(prediction.startingValue) < Number(prediction.endValue) ? "text-green-600" : "text-red-600"
              )}>
                ({Number(prediction.startingValue) < Number(prediction.endValue) ? "+" : ""}
                {(((Number(prediction.endValue) - Number(prediction.startingValue)) / Number(prediction.startingValue)) * 100).toFixed(2)}%)
              </span>
            </div>
            
            {prediction.points !== undefined && (
              <div className="mt-1 text-xs">
                <span className="text-muted-foreground">Points earned: </span>
                <span className="font-medium text-indigo-600">+{prediction.points}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {!compact && (
        <CardFooter className={compact ? "p-3 pt-0" : ""}>
          <Button 
            variant="outline" 
            className="w-full" 
            asChild
            size={compact ? "sm" : "default"}
          >
            <Link to={`/app/predictions/${prediction.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PredictionCard;
