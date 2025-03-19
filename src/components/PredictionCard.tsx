
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

  // Support both new database fields and legacy fields
  const targetName = prediction.target_name || prediction.targetName || prediction.stockName;
  const ticker = prediction.ticker;
  const status = prediction.status;
  const outcome = prediction.outcome;
  const userPrediction = prediction.user_prediction || prediction.userPrediction;
  const aiPrediction = prediction.ai_prediction || prediction.aiPrediction;
  const predictionType = prediction.prediction_type || prediction.predictionType;
  const timeframe = prediction.timeframe;
  const startingValue = prediction.starting_value || prediction.startingValue || prediction.startPrice;
  const finalValue = prediction.final_value || prediction.finalValue || prediction.endPrice || prediction.endValue;
  const points = prediction.points;
  const createdAt = prediction.createdAt || prediction.created_at;
  const resolvedAt = prediction.resolvedAt || prediction.resolved_at;

  const getStatusBadge = () => {
    if (status === "pending") {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    }
    
    if (outcome === "user_win") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          <span>You Won!</span>
        </Badge>
      );
    } else if (outcome === "ai_win") {
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
              {targetName}
            </CardTitle>
            <CardDescription>
              {ticker} • {getTimeframeText(timeframe)}
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
              {renderPredictionValue(userPrediction, predictionType)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">AI Prediction</div>
            <div className="font-medium">
              {renderPredictionValue(aiPrediction, predictionType)}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <div>Created: {formatDate(createdAt)}</div>
          {(status === "completed" || status === "complete") && resolvedAt && (
            <div>Resolved: {formatDate(resolvedAt)}</div>
          )}
        </div>
        
        {(status === "completed" || status === "complete") && finalValue && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-1">Final Price:</div>
            <div className="font-medium flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {Number(finalValue).toFixed(2)}
              <span className={cn(
                "text-xs",
                Number(startingValue) < Number(finalValue) ? "text-green-600" : "text-red-600"
              )}>
                ({Number(startingValue) < Number(finalValue) ? "+" : ""}
                {(((Number(finalValue) - Number(startingValue)) / Number(startingValue)) * 100).toFixed(2)}%)
              </span>
            </div>
            
            {points !== undefined && (
              <div className="mt-1 text-xs">
                <span className="text-muted-foreground">Points earned: </span>
                <span className="font-medium text-indigo-600">+{points}</span>
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
