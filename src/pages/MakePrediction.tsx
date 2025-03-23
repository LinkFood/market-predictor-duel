import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Server, Brain, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Prediction } from "@/lib/prediction/types";
import { FEATURES } from "@/lib/config";
import { getPredictionById } from "@/lib/prediction/user-predictions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Refactored components
import {
  PredictionForm,
  AnalyzingProgress,
  PredictionSidebar,
  PredictionResult,
  ApiConnectionTest,
} from "@/components/prediction";

// Sample suggestion data - in a real app this would come from an API
const marketSuggestions = [
  {
    name: "NVIDIA",
    symbol: "NVDA",
    currentPrice: "$950.02",
    change: "+2.5%",
    trend: "up",
    confidence: 85,
    timeframe: "1 week"
  },
  {
    name: "Tesla",
    symbol: "TSLA",
    currentPrice: "$178.21",
    change: "-0.8%",
    trend: "down",
    confidence: 72,
    timeframe: "2 weeks"
  },
  {
    name: "S&P 500",
    symbol: "SPY",
    currentPrice: "$527.78",
    change: "+0.3%",
    trend: "up",
    confidence: 68,
    timeframe: "1 month"
  }
];

const MakePrediction: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predictionStep, setPredictionStep] = useState<"form" | "analyzing" | "result">("form");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApiTest, setShowApiTest] = useState(false);
  
  // Effect to refresh prediction data after analysis is complete
  useEffect(() => {
    if (prediction?.id && predictionStep === "analyzing") {
      const timer = setTimeout(async () => {
        try {
          // Fetch the latest prediction data from the server
          console.log("Fetching latest prediction data for ID:", prediction.id);
          const updatedPrediction = await getPredictionById(prediction.id);
          
          if (updatedPrediction) {
            console.log("Received updated prediction:", updatedPrediction);
            setPrediction(updatedPrediction);
            setPredictionStep("result");
            toast({
              title: "Success",
              description: "Prediction analyzed successfully!"
            });
          } else {
            console.error("Failed to fetch updated prediction");
            setError("Failed to retrieve prediction analysis. Please try again.");
          }
        } catch (error) {
          console.error('Error fetching updated prediction:', error);
          setError("Failed to retrieve prediction analysis. Please try again.");
          setPredictionStep("form");
        }
      }, 3000); // Still keep 3 seconds for animation
      
      return () => clearTimeout(timer);
    }
  }, [prediction?.id, predictionStep, toast]);
  
  const handlePredictionMade = (newPrediction: Prediction) => {
    try {
      console.log('Prediction made:', newPrediction);
      setPrediction(newPrediction);
      setPredictionStep("analyzing");
      setError(null);
    } catch (error) {
      console.error('Error handling prediction:', error);
      setError("Failed to process prediction. Please try again.");
      setPredictionStep("form");
    }
  };

  const handleAnalysisComplete = () => {
    console.log("Analysis animation complete");
  };

  const handleNewPrediction = () => {
    setPrediction(null);
    setPredictionStep("form");
    setError(null);
  };

  const handleSavePrediction = () => {
    try {
      toast({
        title: "Prediction Saved",
        description: "Your prediction has been recorded. Good luck!"
      });
      navigate("/app/predictions/history");
    } catch (error) {
      console.error('Error navigating after prediction:', error);
      setError("Something went wrong. Please try again.");
    }
  };
  
  // Handle rendering errors
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
    <div className="space-y-6 max-w-full mx-auto pb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/app")} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
        
        {FEATURES.devMode && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowApiTest(!showApiTest)}
          >
            {showApiTest ? "Hide API Test" : "Test X.ai API"}
          </Button>
        )}
      </div>

      {showApiTest && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ApiConnectionTest />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main prediction area */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make a Market Prediction</CardTitle>
              <CardDescription>
                Predict market movements and compete against our AI model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionStep === "form" && (
                <PredictionForm onPredictionMade={handlePredictionMade} />
              )}
              
              {predictionStep === "analyzing" && (
                <AnalyzingProgress onComplete={handleAnalysisComplete} />
              )}
              
              {predictionStep === "result" && prediction && (
                <PredictionResult 
                  prediction={prediction}
                  onNewPrediction={handleNewPrediction}
                  onSavePrediction={handleSavePrediction}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with suggestions and tips */}
        <div className="lg:col-span-4 space-y-4">
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="suggestions">Opportunities</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="suggestions" className="mt-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI-Suggested Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <div className="space-y-3">
                    {marketSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="flex items-start justify-between border-b last:border-0 pb-3 pt-1 cursor-pointer hover:bg-muted/30 px-2 rounded-md transition-colors"
                        onClick={() => {
                          // In a real app, this would pre-fill the prediction form
                          toast({
                            title: `Selected ${suggestion.symbol}`,
                            description: "Suggestion applied to prediction form"
                          });
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${suggestion.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                            {suggestion.trend === "up" ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">{suggestion.symbol}</div>
                            <div className="text-xs text-muted-foreground">{suggestion.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={suggestion.trend === "up" ? "text-green-600" : "text-red-600"}>
                            {suggestion.change}
                          </div>
                          <div className="text-xs text-muted-foreground">{suggestion.timeframe}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Refresh Suggestions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips" className="mt-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tips for Better Predictions</CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <ul className="space-y-2 my-2 list-disc list-inside text-sm">
                    <li>Consider recent news and earnings reports</li>
                    <li>Check overall market trends before predicting</li>
                    <li>Look at sector performance for context</li>
                    <li>Be specific about timeframes for your predictions</li>
                    <li>Review your past predictions to improve accuracy</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Your Prediction Stats</CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xl font-bold">72%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xl font-bold">24</div>
                      <div className="text-xs text-muted-foreground">Total Predictions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MakePrediction;