
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prediction } from '@/lib/prediction/types';
import { getUserPredictions } from '@/lib/prediction/user-predictions';

const PredictionsHistory: React.FC = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        console.log('Fetching user predictions history');
        setLoading(true);
        const data = await getUserPredictions();
        console.log('Fetched predictions:', data);
        setPredictions(data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setError('Failed to load your prediction history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/app")} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Prediction History</h1>
        <p className="text-muted-foreground max-w-2xl">
          View all your past predictions and their outcomes.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Your Predictions</CardTitle>
            <Button 
              onClick={() => navigate("/app/predict")} 
              className="bg-indigo-600 hover:bg-indigo-700"
              size="sm"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Make New Prediction
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : predictions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p>No predictions yet</p>
              <p className="text-sm mt-1">Make your first prediction to get started!</p>
              <Button 
                onClick={() => navigate("/app/predict")} 
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Make a Prediction
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {predictions.map((prediction) => (
                <div 
                  key={prediction.id} 
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  onClick={() => navigate(`/app/predictions/${prediction.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Badge className={prediction.userPrediction === "bullish" || prediction.userPrediction === "uptrend" ? "bg-emerald-500" : "bg-red-500"}>
                        {prediction.userPrediction === "bullish" || prediction.userPrediction === "uptrend" ? "Bullish" : "Bearish"}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {prediction.timeframe === "1d" ? "1 Day" : 
                         prediction.timeframe === "1w" ? "1 Week" : 
                         prediction.timeframe === "2w" ? "2 Weeks" : 
                         prediction.timeframe === "1m" ? "1 Month" : "3 Months"}
                      </span>
                    </div>
                    <Badge variant={
                      prediction.status === "complete" && prediction.outcome === "user_win" ? "default" : 
                      prediction.status === "complete" && prediction.outcome === "ai_win" ? "destructive" : 
                      "outline"
                    }>
                      {prediction.status === "pending" ? "Pending" : 
                       prediction.outcome === "user_win" ? "Correct" : 
                       "Incorrect"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold">{prediction.targetName}</h4>
                  <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                    <span>
                      AI: {prediction.aiPrediction === "bullish" || prediction.aiPrediction === "uptrend" ? "Bullish" : "Bearish"} 
                      ({prediction.aiConfidence}/10)
                    </span>
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
      </Card>
    </div>
  );
};

export default PredictionsHistory;
