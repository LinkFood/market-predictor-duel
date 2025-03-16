
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, ArrowDown, Clock, Calendar, BarChart3, CheckCircle, XCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockPredictions } from "@/data/mockData";
import { Prediction } from "@/types";
import { cn } from "@/lib/utils";

const PredictionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const found = mockPredictions.find(p => p.id === id);
    if (found) {
      setPrediction(found);
    }
  }, [id]);

  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading prediction...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Prediction Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{prediction.targetName}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    {prediction.targetType.charAt(0).toUpperCase() + prediction.targetType.slice(1)} • 
                    {getTimeframeText(prediction.timeframe)}
                  </div>
                </div>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Your Prediction</h4>
                  <div className={cn(
                    "flex items-center gap-2 text-lg font-semibold",
                    prediction.userPrediction === "bullish" ? "text-market-green" : "text-market-red"
                  )}>
                    {prediction.userPrediction === "bullish" ? (
                      <ArrowUp className="h-5 w-5" />
                    ) : (
                      <ArrowDown className="h-5 w-5" />
                    )}
                    {prediction.userPrediction === "bullish" ? "Bullish" : "Bearish"}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">AI Prediction</h4>
                  <div className={cn(
                    "flex items-center gap-2 text-lg font-semibold",
                    prediction.aiPrediction === "bullish" ? "text-market-green" : "text-market-red"
                  )}>
                    {prediction.aiPrediction === "bullish" ? (
                      <ArrowUp className="h-5 w-5" />
                    ) : (
                      <ArrowDown className="h-5 w-5" />
                    )}
                    {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"}
                  </div>
                </div>
              </div>

              {prediction.resolved && prediction.actualResult && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-medium mb-2">Actual Result</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className={cn(
                      "flex items-center gap-2 font-semibold",
                      prediction.actualResult === "bullish" ? "text-market-green" : "text-market-red"
                    )}>
                      {prediction.actualResult === "bullish" ? (
                        <ArrowUp className="h-5 w-5" />
                      ) : (
                        <ArrowDown className="h-5 w-5" />
                      )}
                      <span className="text-lg">
                        {prediction.actualResult === "bullish" ? "Bullish" : "Bearish"}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Starting Value:</span>
                        <span className="font-mono">${prediction.startingValue.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Final Value:</span>
                        <span className="font-mono">${prediction.finalValue?.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Change:</span>
                        <span className={cn(
                          "font-mono",
                          (prediction.percentChange || 0) >= 0 ? "text-market-green" : "text-market-red"
                        )}>
                          {(prediction.percentChange || 0) >= 0 ? "+" : ""}
                          {prediction.percentChange?.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {prediction.winner && (
                    <div className="mt-4 pt-3 border-t">
                      <h4 className="font-medium mb-1">Winner</h4>
                      <div>
                        {prediction.winner === "user" && (
                          <Badge className="bg-market-blue">You won!</Badge>
                        )}
                        {prediction.winner === "ai" && (
                          <Badge className="bg-market-green">AI won</Badge>
                        )}
                        {prediction.winner === "both" && (
                          <Badge className="bg-gray-500">Both correct</Badge>
                        )}
                        {prediction.winner === "neither" && (
                          <Badge className="bg-gray-500">Both incorrect</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">AI Confidence</h4>
                  <span className="text-sm">{prediction.aiConfidence}/10</span>
                </div>
                <Progress value={prediction.aiConfidence * 10} className="h-2" />
              </div>

              <Tabs defaultValue="supporting" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="supporting">Supporting Points</TabsTrigger>
                  <TabsTrigger value="counter">Counter Points</TabsTrigger>
                </TabsList>
                <TabsContent value="supporting" className="mt-3">
                  <div className="space-y-3">
                    {prediction.aiAnalysis.supporting.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-market-green/20 text-market-green flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="counter" className="mt-3">
                  <div className="space-y-3">
                    {prediction.aiAnalysis.counter.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-market-red/20 text-market-red flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">AI Reasoning</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {prediction.aiAnalysis.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prediction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">{prediction.targetName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {prediction.targetType.charAt(0).toUpperCase() + prediction.targetType.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="font-medium">{getTimeframeText(prediction.timeframe)}</span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{formatDate(prediction.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Resolves:</span>
                  <span className="font-medium">{formatDate(prediction.resolvesAt)}</span>
                </div>
                {prediction.resolved && prediction.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Resolved:</span>
                    <span className="font-medium">{formatDate(prediction.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={() => navigate("/predict")} className="w-full">
              Make a New Prediction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;
