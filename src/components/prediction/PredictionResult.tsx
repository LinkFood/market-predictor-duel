
import React from "react";
import { 
  ArrowUp, ArrowDown, Brain, BadgeCheck, BellRing,
  Timer, Share2, Clock, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FEATURES } from "@/lib/config";
import { Prediction } from "@/types";

interface PredictionResultProps {
  prediction: Prediction | null;
  onNewPrediction: () => void;
  onSavePrediction: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ 
  prediction,
  onNewPrediction,
  onSavePrediction
}) => {
  if (!prediction) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>Error loading prediction results</AlertDescription>
          </Alert>
          <Button onClick={onNewPrediction}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Ensure supporting and counter points exist with fallbacks
  const supportingPoints = prediction?.aiAnalysis?.supporting || [
    "Technical indicators suggest positive movement",
    "Recent market trends favor this direction",
    "Price action shows strength in this timeframe"
  ];
  
  const counterPoints = prediction?.aiAnalysis?.counter || [
    "Market volatility could impact performance",
    "External factors may affect this prediction",
    "Historical resistance levels may prove challenging"
  ];
  
  console.log("Rendering prediction result:", prediction);
  console.log("Supporting points:", supportingPoints);
  console.log("Counter points:", counterPoints);
  
  return (
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
          prediction?.targetType === "sector" ? "Sector" : "Stock"}: <span className="font-medium">{prediction?.targetName}</span> starting at ${prediction?.startingValue?.toFixed(2)}
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
                  prediction?.userPrediction === "uptrend" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                }`}>
                  {prediction?.userPrediction === "uptrend" ? (
                    <ArrowUp className="h-6 w-6" />
                  ) : (
                    <ArrowDown className="h-6 w-6" />
                  )}
                  {prediction?.userPrediction === "uptrend" ? "Bullish" : "Bearish"}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You predict {prediction?.targetName} will 
                  {prediction?.userPrediction === "uptrend" ? " increase " : " decrease "} 
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
                  prediction?.aiPrediction === "uptrend" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                }`}>
                  {prediction?.aiPrediction === "uptrend" ? (
                    <ArrowUp className="h-6 w-6" />
                  ) : (
                    <ArrowDown className="h-6 w-6" />
                  )}
                  {prediction?.aiPrediction === "uptrend" ? "Bullish" : "Bearish"}
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

          {/* AI Analysis */}
          {prediction.aiAnalysis && FEATURES.enableAIAnalysis && (
            <AIAnalysisSection 
              prediction={prediction}
              supportingPoints={supportingPoints}
              counterPoints={counterPoints}
            />
          )}
          
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
        <Button variant="outline" onClick={onNewPrediction}>
          Make Another Prediction
        </Button>
        <Button onClick={onSavePrediction} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
          Save Prediction
        </Button>
      </CardFooter>
    </Card>
  );
};

const AIAnalysisSection: React.FC<{ 
  prediction: Prediction;
  supportingPoints: string[];
  counterPoints: string[];
}> = ({ prediction, supportingPoints, counterPoints }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Brain className="mr-2 h-5 w-5 text-indigo-500" />
        AI Analysis
      </h3>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg mb-6">
        <p className="italic text-slate-700 dark:text-slate-300">
          "{prediction.aiAnalysis.reasoning}"
        </p>
      </div>

      <Tabs defaultValue="supporting" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="supporting" className="flex-1">
            <ArrowUp className={`h-4 w-4 mr-2 ${prediction?.aiPrediction === "uptrend" ? "text-emerald-500" : "text-red-500"}`} />
            Supporting Factors
          </TabsTrigger>
          <TabsTrigger value="counter" className="flex-1">
            <ArrowDown className={`h-4 w-4 mr-2 ${prediction?.aiPrediction === "uptrend" ? "text-red-500" : "text-emerald-500"}`} />
            Counter Factors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="supporting" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
          <div className="space-y-3">
            {supportingPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`h-6 w-6 rounded-full ${
                  prediction.aiPrediction === "uptrend" 
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
            {counterPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`h-6 w-6 rounded-full ${
                  prediction?.aiPrediction === "uptrend" 
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
  );
};

export default PredictionResult;
