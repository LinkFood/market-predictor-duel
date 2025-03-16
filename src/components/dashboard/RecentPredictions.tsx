
import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Prediction } from "@/types";

interface RecentPredictionsProps {
  predictions: Prediction[];
}

const RecentPredictions: React.FC<RecentPredictionsProps> = ({ predictions }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full shadow-sm border-0 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Predictions</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/predictions/history")} className="h-8 text-xs">
            View All
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate(`/predictions/${prediction.id}`)}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Badge className={prediction.userPrediction === "bullish" ? "bg-emerald-500" : "bg-red-500"}>
                    {prediction.userPrediction === "bullish" ? "Bullish" : "Bearish"}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">
                    {prediction.timeframe === "1d" ? "1 Day" : prediction.timeframe === "1w" ? "1 Week" : "1 Month"}
                  </span>
                </div>
                <Badge variant={prediction.status === "correct" ? "default" : prediction.status === "incorrect" ? "destructive" : "outline"}>
                  {prediction.status === "pending" ? "Pending" : prediction.status === "correct" ? "Correct" : "Incorrect"}
                </Badge>
              </div>
              <h4 className="font-semibold">{prediction.targetName}</h4>
              <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                <span>AI: {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"} ({prediction.aiConfidence}/10)</span>
                {prediction.resolved && prediction.winner && (
                  <span className={`font-medium ${
                    prediction.winner === "user" ? "text-emerald-600 dark:text-emerald-400" : 
                    prediction.winner === "ai" ? "text-red-600 dark:text-red-400" : 
                    prediction.winner === "both" ? "text-blue-600 dark:text-blue-400" : ""
                  }`}>
                    {prediction.winner === "user" ? "You won!" : 
                     prediction.winner === "ai" ? "AI won" : 
                     prediction.winner === "both" ? "Both correct" : "Neither correct"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t py-3">
        <Button variant="default" onClick={() => navigate("/predict")} className="w-full bg-indigo-600 hover:bg-indigo-700">
          <TrendingUp className="mr-2 h-4 w-4" />
          Make New Prediction
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentPredictions;
