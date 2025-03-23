
import React from "react";
import { Prediction } from "@/lib/prediction/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Brain, Zap, TrendingUp, TrendingDown, Share2 } from "lucide-react";

interface PredictionResultProps {
  prediction: Prediction;
  onNewPrediction: () => void;
  onSavePrediction: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  prediction,
  onNewPrediction,
  onSavePrediction,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <motion.div
        className="text-center py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
          <Trophy className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Bracket Created Successfully!</h2>
        <p className="text-gray-600">
          Your stock duel tournament has been created. Get ready to compete!
        </p>
      </motion.div>

      <Tabs defaultValue="bracket" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="bracket">Bracket Preview</TabsTrigger>
          <TabsTrigger value="details">Duel Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bracket" className="space-y-4 mt-4">
          <Card className="overflow-hidden border-0 shadow-md">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Weekly Stock Duel</h3>
                    <p className="text-sm text-white/80">You vs. ValueHunter AI</p>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700">Live Now</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-0">
                <div className="p-4 bg-indigo-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold flex items-center gap-1">
                      <Zap className="h-4 w-4 text-indigo-600" />
                      Your Picks
                    </span>
                  </div>
                  <div className="space-y-2">
                    {["AAPL", "NVDA", "MSFT"].map((stock, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                        <span>{stock}</span>
                        <Badge variant={i !== 2 ? "default" : "destructive"} className="text-xs">
                          {i === 0 ? "+3.2%" : i === 1 ? "+8.1%" : "-4.6%"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold flex items-center gap-1">
                      <Brain className="h-4 w-4 text-purple-600" />
                      AI Picks
                    </span>
                  </div>
                  <div className="space-y-2">
                    {["AMZN", "GOOGL", "TSLA"].map((stock, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                        <span>{stock}</span>
                        <Badge variant="outline" className="text-xs">
                          {i === 0 ? "+1.8%" : i === 1 ? "+4.3%" : "+2.5%"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span>7 days remaining</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/20 border-blue-500/40">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>TOURNAMENT ACTIVE</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tournament Name</h3>
                  <p className="font-medium">Weekly Stock Championship</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Timeframe</h3>
                    <p className="font-medium">7 Days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bracket Size</h3>
                    <p className="font-medium">3 Stocks</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">AI Opponent</h3>
                    <p className="font-medium">ValueHunter</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Potential Points</h3>
                    <p className="font-medium">Up to 500 pts</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tournament Rules</h3>
                  <ul className="text-sm list-disc list-inside mt-1 text-gray-600">
                    <li>Stock performance is measured by percentage change</li>
                    <li>The player with more winning stocks advances</li>
                    <li>Tournament ends at market close in 7 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          onClick={onSavePrediction}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
        >
          View My Brackets
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onNewPrediction}
          className="flex-1"
        >
          Create Another Bracket
        </Button>
        
        <Button 
          variant="ghost"
          className="sm:flex-none"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default PredictionResult;
