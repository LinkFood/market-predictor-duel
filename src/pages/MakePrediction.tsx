
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Server, Brain, TrendingUp, TrendingDown, Sparkles, Trophy, Swords, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Prediction } from "@/lib/prediction/types";
import { FEATURES } from "@/lib/config";
import { getPredictionById } from "@/lib/prediction/user-predictions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BracketSize, BracketTimeframe, AIPersonality } from "@/lib/duel/types";
import { getAllAIPersonalities } from "@/lib/duel/ai-personalities";

// Refactored components
import {
  PredictionForm,
  AnalyzingProgress,
  PredictionSidebar,
  PredictionResult,
  ApiConnectionTest,
} from "@/components/prediction";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Sample AI opponents
const aiOpponents = getAllAIPersonalities();

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
  
  // New state for bracket creation
  const [selectedTimeframe, setSelectedTimeframe] = useState<BracketTimeframe>("weekly");
  const [selectedSize, setSelectedSize] = useState<BracketSize>(3);
  const [selectedAI, setSelectedAI] = useState<AIPersonality | undefined>(undefined);
  
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
              description: "Bracket created successfully!"
            });
          } else {
            console.error("Failed to fetch updated prediction");
            setError("Failed to create bracket duel. Please try again.");
          }
        } catch (error) {
          console.error('Error fetching updated prediction:', error);
          setError("Failed to create bracket duel. Please try again.");
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
      setError("Failed to process bracket creation. Please try again.");
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
        title: "Bracket Created",
        description: "Your stock duel bracket has been created. Good luck!"
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

  // AI Opponent Card Component
  const AIOpponentCard = ({ opponent, isSelected, onSelect }: { 
    opponent: (typeof aiOpponents)[0], 
    isSelected: boolean,
    onSelect: () => void
  }) => (
    <motion.div 
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? "border-2 border-indigo-500 bg-indigo-50" 
          : "border border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
      }`}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600">
          <AvatarFallback>{opponent.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{opponent.name}</h3>
          <p className="text-xs text-gray-500">{opponent.tradingStyle}</p>
        </div>
      </div>
      {isSelected && (
        <div className="mt-3 text-xs text-indigo-600 font-medium">
          <Badge variant="outline" className="bg-indigo-50">Selected Opponent</Badge>
        </div>
      )}
    </motion.div>
  );

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
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5" />
                <CardTitle>Create Stock Duel Bracket</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Select stocks and compete against AI in bracket tournaments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {predictionStep === "form" && (
                <div className="space-y-6">
                  {/* Timeframe Selection */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Select Tournament Timeframe</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "daily", label: "Daily", icon: <Target className="h-4 w-4" /> },
                        { value: "weekly", label: "Weekly", icon: <TrendingUp className="h-4 w-4" /> },
                        { value: "monthly", label: "Monthly", icon: <Trophy className="h-4 w-4" /> }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={selectedTimeframe === option.value ? "default" : "outline"}
                          className={selectedTimeframe === option.value ? "bg-indigo-600" : ""}
                          onClick={() => setSelectedTimeframe(option.value as BracketTimeframe)}
                        >
                          {option.icon}
                          <span className="ml-1">{option.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bracket Size */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Bracket Size</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 3, label: "3 Stocks", description: "Quick Duel" },
                        { value: 6, label: "6 Stocks", description: "Standard" },
                        { value: 9, label: "9 Stocks", description: "Championship" }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={selectedSize === option.value ? "default" : "outline"}
                          className={selectedSize === option.value ? "bg-indigo-600" : ""}
                          onClick={() => setSelectedSize(option.value as BracketSize)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Select {selectedSize} stocks to compete in your bracket
                    </p>
                  </div>
                  
                  {/* AI Opponent Selection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-600" />
                      Choose Your AI Opponent
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {aiOpponents.slice(0, 4).map((opponent) => (
                        <AIOpponentCard
                          key={opponent.id}
                          opponent={opponent}
                          isSelected={selectedAI === opponent.id}
                          onSelect={() => setSelectedAI(opponent.id)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Stock Selection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Select Your Stocks
                    </h3>
                    <PredictionForm onPredictionMade={handlePredictionMade} />
                  </div>
                </div>
              )}
              
              {predictionStep === "analyzing" && (
                <div className="py-10">
                  <AnalyzingProgress onComplete={handleAnalysisComplete} />
                  <div className="text-center mt-6">
                    <h2 className="text-xl font-bold">Creating Your Bracket</h2>
                    <p className="text-gray-500">Setting up your duel against {selectedAI || "AI"}</p>
                  </div>
                </div>
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

        {/* Sidebar with tournament information */}
        <div className="lg:col-span-4 space-y-4">
          <Tabs defaultValue="tournament" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="tournament">Tournament</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tournament" className="mt-2 space-y-4">
              <Card>
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <CardTitle className="text-lg">Current Tournament</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Weekly Championship</h3>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Participants:</span>
                          <span className="font-medium">138</span>
                        </div>
                        <div className="flex justify-between">
                          <span>End Date:</span>
                          <span className="font-medium">3 days left</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Top Prize:</span>
                          <span className="font-medium">500 points</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Leaderboard</h3>
                      <div className="space-y-2">
                        {[
                          { name: "TradeMaster", score: "324 pts", position: 1 },
                          { name: "StockGuru", score: "287 pts", position: 2 },
                          { name: "AISlayer", score: "245 pts", position: 3 }
                        ].map((user, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">{user.position}</span>
                              <span>{user.name}</span>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {user.score}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Tournaments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="suggestions" className="mt-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI-Suggested Stocks</CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <div className="space-y-3">
                    {marketSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="flex items-start justify-between border-b last:border-0 pb-3 pt-1 cursor-pointer hover:bg-muted/30 px-2 rounded-md transition-colors"
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
          </Tabs>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-600" />
                Your Duel Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-0">
              <div className="grid grid-cols-2 gap-2 py-2">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Active Duels</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-xl font-bold">65%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
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
