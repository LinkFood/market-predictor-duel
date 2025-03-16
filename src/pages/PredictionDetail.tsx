import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowUp, ArrowDown, Clock, Calendar, BarChart3,
  CheckCircle, XCircle, Target, Share2, FileText, Timer,
  Award, Brain, TrendingUp, TrendingDown, Newspaper,
  Sparkles, Flame, AlertTriangle, Zap, BarChart, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { mockPredictions, mockStockData } from "@/data/mockData";
import { Prediction } from "@/types";
import { cn } from "@/lib/utils";

const PredictionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const found = mockPredictions.find(p => p.id === id);
    if (found) {
      setPrediction(found);
    }
  }, [id]);

  useEffect(() => {
    if (!prediction || prediction.resolved) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const resolveDate = new Date(prediction.resolvesAt);
      const diff = resolveDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining("Resolving...");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [prediction]);

  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case "1d": return "1 Day";
      case "1w": return "1 Week";
      case "1m": return "1 Month";
      default: return timeframe;
    }
  };

  const getStatusBadge = () => {
    if (!prediction.resolved) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 font-normal bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    }
    
    if (prediction.status === "correct") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 font-normal bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="h-3 w-3" />
          <span>Correct</span>
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 font-normal bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
        <XCircle className="h-3 w-3" />
        <span>Incorrect</span>
      </Badge>
    );
  };

  const getStatusIndicator = () => {
    const resolveDate = new Date(prediction.resolvesAt);
    const now = new Date();
    const percentComplete = prediction.resolved
      ? 100
      : Math.min(
          100,
          ((now.getTime() - new Date(prediction.createdAt).getTime()) /
            (resolveDate.getTime() - new Date(prediction.createdAt).getTime())) *
            100
        );
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            <span className="font-medium">Status:</span>
          </div>
          {prediction.resolved ? (
            <Badge variant="outline" className={cn(
              "font-normal", 
              prediction.status === "correct" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" 
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            )}>
              {prediction.status === "correct" ? "Correct" : "Incorrect"}
            </Badge>
          ) : (
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{timeRemaining}</span>
          )}
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
            <div 
              style={{ width: `${percentComplete}%` }} 
              className={cn(
                "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-500",
                prediction.resolved
                  ? prediction.status === "correct"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                  : "bg-indigo-500"
              )}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const marketNews = [
    {
      title: "Fed signals potential rate cut in upcoming meeting",
      source: "Market Watch",
      date: "2 days ago",
      relevant: true
    },
    {
      title: `${prediction.targetName} reports stronger than expected earnings`,
      source: "Financial Times",
      date: "1 day ago",
      relevant: true
    },
    {
      title: "Inflation data shows cooling consumer prices",
      source: "Bloomberg",
      date: "3 days ago",
      relevant: false
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
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
          {prediction.resolved && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <span className="inline-flex items-center">
                {prediction.status === "correct" ? (
                  <CheckCircle className="h-4 w-4 mr-1 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                )}
                {prediction.status === "correct" ? "Prediction Correct" : "Prediction Incorrect"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                  Prediction Summary
                </CardTitle>
                {getStatusBadge()}
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                {getStatusIndicator()}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <Card className={cn(
                    "border-2 shadow-sm relative overflow-hidden",
                    prediction.userPrediction === "bullish"
                      ? "border-emerald-200 dark:border-emerald-800"
                      : "border-red-200 dark:border-red-800"
                  )}>
                    <div className={cn(
                      "absolute inset-0 opacity-5",
                      prediction.userPrediction === "bullish"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    )} />
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        Your Prediction
                        {prediction.resolved && prediction.status === "correct" && (
                          <Badge className="bg-emerald-500 text-xs">Correct</Badge>
                        )}
                        {prediction.resolved && prediction.status === "incorrect" && (
                          <Badge className="bg-red-500 text-xs">Incorrect</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className={cn(
                        "flex items-center gap-2 text-xl font-bold",
                        prediction.userPrediction === "bullish" 
                          ? "text-emerald-600 dark:text-emerald-500" 
                          : "text-red-600 dark:text-red-500"
                      )}>
                        {prediction.userPrediction === "bullish" ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        {prediction.userPrediction === "bullish" ? "Bullish" : "Bearish"}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        You predicted that {prediction.targetName} would 
                        {prediction.userPrediction === "bullish" ? " rise " : " fall "} 
                        in value over {prediction.timeframe === "1d" ? "a day" : 
                                       prediction.timeframe === "1w" ? "a week" : "a month"}.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className={cn(
                    "border-2 shadow-sm relative overflow-hidden",
                    prediction.aiPrediction === "bullish"
                      ? "border-emerald-200 dark:border-emerald-800"
                      : "border-red-200 dark:border-red-800"
                  )}>
                    <div className={cn(
                      "absolute inset-0 opacity-5",
                      prediction.aiPrediction === "bullish"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    )} />
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        AI Prediction
                        {prediction.resolved && prediction.aiPrediction === prediction.actualResult && (
                          <Badge className="bg-emerald-500 text-xs">Correct</Badge>
                        )}
                        {prediction.resolved && prediction.aiPrediction !== prediction.actualResult && (
                          <Badge className="bg-red-500 text-xs">Incorrect</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className={cn(
                        "flex items-center gap-2 text-xl font-bold",
                        prediction.aiPrediction === "bullish" 
                          ? "text-emerald-600 dark:text-emerald-500" 
                          : "text-red-600 dark:text-red-500"
                      )}>
                        {prediction.aiPrediction === "bullish" ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-sm text-muted-foreground">Confidence:</div>
                        <div className="flex items-center flex-1 gap-0.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
                            <div 
                              key={dot} 
                              className={`w-2 h-3 rounded-sm ${
                                dot <= prediction.aiConfidence 
                                  ? (prediction.aiPrediction === "bullish" ? "bg-emerald-500" : "bg-red-500")
                                  : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="font-medium text-sm">{prediction.aiConfidence}/10</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className={cn(
                  "border-0",
                  prediction.userPrediction === prediction.aiPrediction
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                )}>
                  {prediction.userPrediction === prediction.aiPrediction ? (
                    <Flame className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  )}
                  <AlertDescription className="font-medium">
                    {prediction.userPrediction === prediction.aiPrediction
                      ? "You and the AI are aligned on this prediction! This is often a strong signal."
                      : "You and the AI have different outlooks. Only one can be right - who will win?"}
                  </AlertDescription>
                </Alert>
                
                {prediction.resolved && prediction.actualResult && (
                  <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2 text-indigo-500" />
                        Prediction Results
                      </CardTitle>
                      <CardDescription>
                        This prediction was resolved on {formatDate(prediction.resolvedAt || "")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
                          <div className="text-xs text-muted-foreground mb-1">Starting Value</div>
                          <div className="text-lg font-mono font-medium">${prediction.startingValue.toFixed(2)}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
                          <div className="text-xs text-muted-foreground mb-1">Final Value</div>
                          <div className="text-lg font-mono font-medium">${prediction.finalValue?.toFixed(2)}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
                          <div className="text-xs text-muted-foreground mb-1">Change</div>
                          <div className={cn(
                            "text-lg font-mono font-medium flex items-center",
                            (prediction.percentChange || 0) >= 0 
                              ? "text-emerald-600 dark:text-emerald-500" 
                              : "text-red-600 dark:text-red-500"
                          )}>
                            {(prediction.percentChange || 0) >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {(prediction.percentChange || 0) >= 0 ? "+" : ""}
                            {prediction.percentChange?.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            prediction.actualResult === "bullish" 
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          )}>
                            {prediction.actualResult === "bullish" ? (
                              <TrendingUp className="h-6 w-6" />
                            ) : (
                              <TrendingDown className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Actual Result</div>
                            <div className={cn(
                              "text-xl font-bold",
                              prediction.actualResult === "bullish" 
                                ? "text-emerald-600 dark:text-emerald-500" 
                                : "text-red-600 dark:text-red-500"
                            )}>
                              {prediction.actualResult === "bullish" ? "Bullish" : "Bearish"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center sm:items-end">
                          <div className="text-sm font-medium text-muted-foreground">Winner</div>
                          <div className="mt-1">
                            {prediction.winner === "user" && (
                              <Badge className="bg-indigo-600 hover:bg-indigo-700 text-base px-3 py-1">
                                🏆 You Beat the AI!
                              </Badge>
                            )}
                            {prediction.winner === "ai" && (
                              <Badge className="bg-indigo-600 hover:bg-indigo-700 text-base px-3 py-1">
                                🤖 AI Won This Round
                              </Badge>
                            )}
                            {prediction.winner === "both" && (
                              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-base px-3 py-1">
                                ✓ Both Correct
                              </Badge>
                            )}
                            {prediction.winner === "neither" && (
                              <Badge className="bg-slate-600 hover:bg-slate-700 text-base px-3 py-1">
                                ✗ Both Incorrect
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-indigo-500" />
                    AI Analysis
                  </h3>
                  
                  <Card className="mb-6 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-2 text-sm font-medium">
                        <Zap className="h-4 w-4" />
                        AI's Reasoning
                      </div>
                      <p className="italic text-slate-700 dark:text-slate-300">
                        "{prediction.aiAnalysis.reasoning}"
                      </p>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="supporting" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="supporting" className="flex-1">
                        <ArrowUp className={`h-4 w-4 mr-2 ${
                          prediction.aiPrediction === "bullish" 
                            ? "text-emerald-500" 
                            : "text-red-500"
                        }`} />
                        Supporting Factors
                      </TabsTrigger>
                      <TabsTrigger value="counter" className="flex-1">
                        <ArrowDown className={`h-4 w-4 mr-2 ${
                          prediction.aiPrediction === "bullish" 
                            ? "text-red-500" 
                            : "text-emerald-500"
                        }`} />
                        Counter Factors
                      </TabsTrigger>
                      {prediction.resolved && <TabsTrigger value="news" className="flex-1">
                        <Newspaper className="h-4 w-4 mr-2 text-indigo-500" />
                        Market Context
                      </TabsTrigger>}
                    </TabsList>
                    
                    <TabsContent value="supporting" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
                      <div className="space-y-3">
                        {prediction.aiAnalysis.supporting.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`h-6 w-6 rounded-full ${
                              prediction.aiPrediction === "bullish" 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            } flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs`}>
                              {idx + 1}
                            </div>
                            <p className="text-sm leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="counter" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
                      <div className="space-y-3">
                        {prediction.aiAnalysis.counter.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`h-6 w-6 rounded-full ${
                              prediction.aiPrediction === "bullish" 
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            } flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs`}>
                              {idx + 1}
                            </div>
                            <p className="text-sm leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {prediction.resolved && (
                      <TabsContent value="news" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground mb-3">
                            News and events that influenced this price movement:
                          </p>
                          {marketNews.map((news, idx) => (
                            <div key={idx} className="border rounded p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{news.title}</h4>
                                {news.relevant && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-xs">
                                    Key Factor
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <span>{news.source}</span>
                                <span>•</span>
                                <span>{news.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-4 border-t bg-slate-50 dark:bg-slate-900">
              <Button variant="outline" onClick={() => navigate("/predictions/history")}>
                View All Predictions
              </Button>
              <Button onClick={() => navigate("/predict")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                <TrendingUp className="mr-2 h-4 w-4" />
                Make New Prediction
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <CardTitle className="text-base font-semibold">Prediction Details</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="py-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Target</div>
                      <div className="font-medium">{prediction.targetName}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div className="font-medium capitalize">{prediction.targetType}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Timeframe</div>
                      <div className="font-medium">{getTimeframeText(prediction.timeframe)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="font-medium">{formatDate(prediction.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Resolves</div>
                      <div className="font-medium">{formatDate(prediction.resolvesAt)}</div>
                    </div>
                  </div>
                  {prediction.resolved && prediction.resolvedAt && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500 mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground">Resolved</div>
                        <div className="font-medium">{formatDate(prediction.resolvedAt)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {prediction.resolved && prediction.winner === "user" && (
                <div className="py-3">
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Points Earned</div>
                      <div className="font-medium text-indigo-600 dark:text-indigo-400">+50 points</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">Current Market Data</CardTitle>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 divide-y">
                {mockStockData.slice(0, 3).map((stock, index) => (
                  <div key={index} className={cn(
                    "py-3 first:pt-0 last:pb-0",
                    stock.name === prediction.targetName ? "bg-indigo-50/50 dark:bg-indigo-950/20 px-3 -mx-3 rounded-md" : ""
                  )}>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {stock.name}
                        {stock.name === prediction.targetName && (
                          <Badge variant="outline" className="ml-2 text-xs font-normal bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800">
                            Target
                          </Badge>
                        )}
                      </div>
                      <div className="font-mono font-medium">${stock.value.toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-muted-foreground">Today</div>
                      <div className={cn(
                        "text-xs font-medium",
                        stock.changePercent >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                      )}>
                        {stock.changePercent >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <CardTitle className="text-base font-semibold flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                Similar Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockPredictions
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
                        <Badge 
                          variant={pred.status === "correct" ? "default" : pred.status === "incorrect" ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          {pred.status === "pending" ? "Pending" : pred.status === "correct" ? "Correct" : "Incorrect"}
                        </Badge>
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
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;
