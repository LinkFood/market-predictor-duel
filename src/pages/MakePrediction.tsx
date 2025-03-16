
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowUp, ArrowDown, LineChart, Sparkles, 
  Timer, Share2, Brain, BookMarked, Clock, ChevronRight,
  BellRing, BadgeCheck, Trophy, BarChart, Lightbulb, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PredictionForm from "@/components/prediction/PredictionForm";
import MarketDataTable from "@/components/MarketDataTable";
import { mockMarketData, mockSectorData, mockStockData, mockLeaderboard } from "@/data/mockData";
import { Prediction } from "@/types";
import { useToast } from "@/hooks/use-toast";

const MakePrediction: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predictionStep, setPredictionStep] = useState<"form" | "analyzing" | "result">("form");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate AI analysis loading
  useEffect(() => {
    if (predictionStep === "analyzing") {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            setPredictionStep("result");
            return 100;
          }
          return newProgress;
        });
      }, 600);
      
      return () => clearInterval(interval);
    }
  }, [predictionStep]);

  const handlePredictionMade = (newPrediction: Prediction) => {
    setPrediction(newPrediction);
    setPredictionStep("analyzing");
    setLoadingProgress(0);
    
    // Simulating API request time
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Prediction analyzed successfully!"
      });
    }, 3000);
  };

  const handleNewPrediction = () => {
    setPrediction(null);
    setPredictionStep("form");
  };

  const handleSavePrediction = () => {
    toast({
      title: "Prediction Saved",
      description: "Your prediction has been recorded. Good luck!"
    });
    navigate("/");
  };
  
  const renderAnalyzingStep = () => (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>AI Analyzing Your Prediction</CardTitle>
        <CardDescription>
          Our AI is crunching the numbers and analyzing market trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center py-6">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analyzing market data...</span>
            <span>{Math.round(loadingProgress)}%</span>
          </div>
          <Progress value={loadingProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="text-sm">Reviewing technical indicators</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <LineChart className="h-4 w-4" />
            <span className="text-sm">Checking price patterns</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookMarked className="h-4 w-4" />
            <span className="text-sm">Reading market news</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart className="h-4 w-4" />
            <span className="text-sm">Processing historical data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultStep = () => (
    <Card className="w-full animate-scale-in shadow-md border-0">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle>Prediction Analysis</CardTitle>
          <Badge variant="outline" className="font-normal bg-white dark:bg-slate-800">
            {prediction?.timeframe === "1d" ? "1 Day" : 
             prediction?.timeframe === "1w" ? "1 Week" : "1 Month"}
          </Badge>
        </div>
        <CardDescription>
          {prediction?.targetType === "market" ? "Market" : 
           prediction?.targetType === "sector" ? "Sector" : "Stock"}: <span className="font-medium">{prediction?.targetName}</span> starting at ${prediction?.startingValue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-6 space-y-8">
          {/* Predictions comparison */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">Your Prediction</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className={`flex items-center gap-2 text-xl font-bold ${
                  prediction?.userPrediction === "bullish" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                }`}>
                  {prediction?.userPrediction === "bullish" ? (
                    <ArrowUp className="h-6 w-6" />
                  ) : (
                    <ArrowDown className="h-6 w-6" />
                  )}
                  {prediction?.userPrediction === "bullish" ? "Bullish" : "Bearish"}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You predict {prediction?.targetName} will 
                  {prediction?.userPrediction === "bullish" ? " increase " : " decrease "} 
                  in value over the next {prediction?.timeframe === "1d" ? "day" : 
                   prediction?.timeframe === "1w" ? "week" : "month"}.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">AI Prediction</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className={`flex items-center gap-2 text-xl font-bold ${
                  prediction?.aiPrediction === "bullish" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                }`}>
                  {prediction?.aiPrediction === "bullish" ? (
                    <ArrowUp className="h-6 w-6" />
                  ) : (
                    <ArrowDown className="h-6 w-6" />
                  )}
                  {prediction?.aiPrediction === "bullish" ? "Bullish" : "Bearish"}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Confidence:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <div 
                        key={star} 
                        className={`w-2 h-4 rounded-sm ${
                          star <= (prediction?.aiConfidence || 0) 
                            ? "bg-indigo-500" 
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm font-medium ml-1">{prediction?.aiConfidence}/10</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agreement/Disagreement banner */}
          {prediction && (
            <Alert className={`border-0 ${
              prediction.userPrediction === prediction.aiPrediction
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
            }`}>
              {prediction.userPrediction === prediction.aiPrediction ? (
                <BadgeCheck className="h-5 w-5 mr-2" />
              ) : (
                <BellRing className="h-5 w-5 mr-2" />
              )}
              <AlertDescription className="font-medium">
                {prediction.userPrediction === prediction.aiPrediction
                  ? "You and the AI agree on this prediction! This increases your chance of success."
                  : "You and the AI disagree on this prediction. One of you will be right...who will it be?"}
              </AlertDescription>
            </Alert>
          )}

          {/* AI Analysis */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Brain className="mr-2 h-5 w-5 text-indigo-500" />
              AI Analysis
            </h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg mb-6">
              <p className="italic text-slate-700 dark:text-slate-300">
                "{prediction?.aiAnalysis.reasoning}"
              </p>
            </div>

            <Tabs defaultValue="supporting" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="supporting" className="flex-1">
                  <ArrowUp className={`h-4 w-4 mr-2 ${prediction?.aiPrediction === "bullish" ? "text-emerald-500" : "text-red-500"}`} />
                  Supporting Factors
                </TabsTrigger>
                <TabsTrigger value="counter" className="flex-1">
                  <ArrowDown className={`h-4 w-4 mr-2 ${prediction?.aiPrediction === "bullish" ? "text-red-500" : "text-emerald-500"}`} />
                  Counter Factors
                </TabsTrigger>
              </TabsList>
              <TabsContent value="supporting" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
                <div className="space-y-3">
                  {prediction?.aiAnalysis.supporting.map((point, idx) => (
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
                  {prediction?.aiAnalysis.counter.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`h-6 w-6 rounded-full ${
                        prediction?.aiPrediction === "bullish" 
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
            </Tabs>
          </div>
          
          {/* What happens next */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              What Happens Next
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              Your prediction will be automatically evaluated when it reaches its end date. 
              We'll notify you of the results and award points if you beat the AI!
            </p>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-white dark:bg-slate-800">
                <Timer className="mr-1 h-3.5 w-3.5" />
                Resolves: {new Date(prediction?.resolvesAt || "").toLocaleDateString()} 
              </Badge>
              <Button variant="ghost" size="sm" className="ml-auto gap-1 h-8">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 border-t bg-slate-50 dark:bg-slate-900">
        <Button variant="outline" onClick={handleNewPrediction}>
          Make Another Prediction
        </Button>
        <Button onClick={handleSavePrediction} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
          Save Prediction
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Make a Prediction</h1>
        <p className="text-muted-foreground max-w-2xl">
          Predict market movements and compete against our AI. Win points for correct predictions 
          and climb up the leaderboard!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {predictionStep === "form" && (
            <PredictionForm onPredictionMade={handlePredictionMade} />
          )}
          
          {predictionStep === "analyzing" && renderAnalyzingStep()}
          
          {predictionStep === "result" && prediction && renderResultStep()}
        </div>

        <div className="space-y-6">
          {/* Market data card */}
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">Market Data</CardTitle>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              <CardDescription>
                Current market conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="indices" className="w-full">
                <div className="px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="indices">Indices</TabsTrigger>
                    <TabsTrigger value="sectors">Sectors</TabsTrigger>
                    <TabsTrigger value="stocks">Stocks</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="indices" className="p-4">
                  <MarketDataTable data={mockMarketData} title="" />
                </TabsContent>
                <TabsContent value="sectors" className="p-4">
                  <MarketDataTable data={mockSectorData} title="" />
                </TabsContent>
                <TabsContent value="stocks" className="p-4">
                  <MarketDataTable data={mockStockData} title="" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Hot prediction opportunities */}
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                  Hot Opportunities
                </CardTitle>
              </div>
              <CardDescription>
                High-confidence predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <h4 className="font-semibold ml-2">NVIDIA (NVDA)</h4>
                    </div>
                    <Badge variant="outline" className="capitalize bg-amber-50 text-amber-700 border-amber-200">
                      Volatile
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Earnings report tomorrow</p>
                </div>
                <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <h4 className="font-semibold ml-2">S&P 500</h4>
                    </div>
                    <Badge variant="outline" className="capitalize bg-red-50 text-red-700 border-red-200">
                      Bearish
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Fed announcement expected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Leaderboard preview */}
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">Top Forecasters</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  View All
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-1">
                {mockLeaderboard.slice(0, 3).map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                        index === 0 ? "bg-amber-100 text-amber-800" : 
                        index === 1 ? "bg-slate-100 text-slate-800" : 
                        "bg-orange-50 text-orange-800"
                      } text-xs font-bold`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm">{user.username}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-1">{Math.round(user.accuracy * 100)}%</span>
                      <span className="text-xs text-muted-foreground">accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t p-3 flex justify-center">
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm">
                <Trophy className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Make predictions to join the leaderboard</span>
              </div>
            </CardFooter>
          </Card>
          
          {/* Tip card */}
          <Card className="border-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prediction Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Consider technical indicators, news events, and broader market trends when making your prediction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MakePrediction;
