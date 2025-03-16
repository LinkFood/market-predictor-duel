
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMarketData, mockSectorData, mockStockData, generatePrediction } from "@/data/mockData";
import { PredictionCategory, PredictionDirection, PredictionTimeframe, Prediction } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PredictionFormProps {
  onPredictionMade: (prediction: Prediction) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionMade }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<PredictionCategory>("market");
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [timeframe, setTimeframe] = useState<PredictionTimeframe>("1d");
  const [direction, setDirection] = useState<PredictionDirection | null>(null);

  const getDataForTab = () => {
    switch (activeTab) {
      case "market":
        return mockMarketData;
      case "sector":
        return mockSectorData;
      case "stock":
        return mockStockData;
      default:
        return [];
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as PredictionCategory);
    setSelectedTarget("");
  };

  const handleSubmit = () => {
    if (!selectedTarget || !direction || !timeframe) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please complete your prediction"
      });
      return;
    }

    // Generate a new prediction
    const newPrediction = generatePrediction(
      activeTab,
      selectedTarget,
      timeframe,
      direction
    );

    // Pass the prediction to the parent component
    onPredictionMade(newPrediction);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Make a Prediction</CardTitle>
        <CardDescription>
          Choose a market, sector, or stock and predict whether it will go up or down
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="market">Markets</TabsTrigger>
            <TabsTrigger value="sector">Sectors</TabsTrigger>
            <TabsTrigger value="stock">Stocks</TabsTrigger>
          </TabsList>

          {["market", "sector", "stock"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select a {tab}</label>
                <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Choose a ${tab}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getDataForTab().map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prediction timeframe</label>
                <Select value={timeframe} onValueChange={(value) => setTimeframe(value as PredictionTimeframe)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your prediction</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setDirection("bullish")}
                    className={cn(
                      "h-20",
                      direction === "bullish"
                        ? "bg-market-green hover:bg-market-green/90"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <ArrowUp className={cn("h-6 w-6", direction === "bullish" ? "text-white" : "text-market-green")} />
                      <span>Bullish</span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setDirection("bearish")}
                    className={cn(
                      "h-20",
                      direction === "bearish"
                        ? "bg-market-red hover:bg-market-red/90"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <ArrowDown className={cn("h-6 w-6", direction === "bearish" ? "text-white" : "text-market-red")} />
                      <span>Bearish</span>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col space-y-2">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedTarget || !direction} 
          className="w-full"
        >
          Submit Prediction
        </Button>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Info className="h-3 w-3" />
          <span>The AI will analyze your prediction and provide feedback</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PredictionForm;
