
import React, { useEffect, useState } from "react";
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
import { Prediction } from "@/lib/prediction/types";
import { getUserPredictions } from "@/lib/prediction";

const RecentPredictions: React.FC = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await getUserPredictions();
        setPredictions(data.slice(0, 5)); // Just show the most recent 5
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPredictions();
  }, []);
  
  return (
    <Card className="h-full shadow-sm border-0 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Predictions</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/app/predictions/history")} className="h-8 text-xs">
            View All
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No predictions yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate(`/app/predictions/${prediction.id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Badge className={prediction.user_prediction === "bullish" || prediction.user_prediction === "uptrend" ? "bg-emerald-500" : "bg-red-500"}>
                      {prediction.user_prediction === "bullish" || prediction.user_prediction === "uptrend" ? "Bullish" : "Bearish"}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      {prediction.timeframe === "1d" ? "1 Day" : prediction.timeframe === "1w" ? "1 Week" : "1 Month"}
                    </span>
                  </div>
                  <Badge variant={prediction.status === "complete" && prediction.outcome === "user_win" ? "default" : prediction.status === "complete" && prediction.outcome === "ai_win" ? "destructive" : "outline"}>
                    {prediction.status === "pending" ? "Pending" : prediction.outcome === "user_win" ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <h4 className="font-semibold">{prediction.target_name}</h4>
                <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                  <span>AI: {prediction.ai_prediction === "bullish" || prediction.ai_prediction === "uptrend" ? "Bullish" : "Bearish"} ({prediction.ai_confidence}/10)</span>
                  {prediction.status === "complete" && prediction.outcome && (
                    <span className={`font-medium ${
                      prediction.outcome === "user_win" ? "text-emerald-600 dark:text-emerald-400" : 
                      prediction.outcome === "ai_win" ? "text-red-600 dark:text-red-400" : 
                      prediction.outcome === "tie" ? "text-blue-600 dark:text-blue-400" : ""
                    }`}>
                      {prediction.outcome === "user_win" ? "You won!" : 
                       prediction.outcome === "ai_win" ? "AI won" : 
                       prediction.outcome === "tie" ? "Both correct" : "Neither correct"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t py-3">
        <Button variant="default" onClick={() => navigate("/app/predict")} className="w-full bg-indigo-600 hover:bg-indigo-700">
          <TrendingUp className="mr-2 h-4 w-4" />
          Make New Prediction
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentPredictions;
