
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import PredictionForm from "@/components/PredictionForm";
import MarketDataTable from "@/components/MarketDataTable";
import { mockMarketData, mockSectorData, mockStockData } from "@/data/mockData";
import { Prediction } from "@/types";
import { useToast } from "@/hooks/use-toast";

const MakePrediction: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predictionStep, setPredictionStep] = useState<"form" | "result">("form");
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const handlePredictionMade = (newPrediction: Prediction) => {
    setPrediction(newPrediction);
    setPredictionStep("result");
    toast({
      title: "Success",
      description: "Prediction submitted successfully!"
    });
  };

  const handleNewPrediction = () => {
    setPrediction(null);
    setPredictionStep("form");
  };

  const handleSavePrediction = () => {
    toast({
      title: "Success",
      description: "Prediction saved successfully!"
    });
    navigate("/");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Make a Prediction</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {predictionStep === "form" ? (
            <PredictionForm onPredictionMade={handlePredictionMade} />
          ) : prediction && (
            <Card className="w-full animate-scale-in">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Analysis Results</span>
                  <div className="text-sm font-normal bg-gray-100 px-3 py-1 rounded-full">
                    {prediction.targetType === "market" ? "Market" : 
                     prediction.targetType === "sector" ? "Sector" : "Stock"}: {prediction.targetName}
                  </div>
                </CardTitle>
                <CardDescription>
                  The AI has analyzed your prediction and provided feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Your Prediction</h4>
                    <div className={`flex items-center gap-2 text-lg font-semibold ${
                      prediction.userPrediction === "bullish" ? "text-market-green" : "text-market-red"
                    }`}>
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
                    <div className={`flex items-center gap-2 text-lg font-semibold ${
                      prediction.aiPrediction === "bullish" ? "text-market-green" : "text-market-red"
                    }`}>
                      {prediction.aiPrediction === "bullish" ? (
                        <ArrowUp className="h-5 w-5" />
                      ) : (
                        <ArrowDown className="h-5 w-5" />
                      )}
                      {prediction.aiPrediction === "bullish" ? "Bullish" : "Bearish"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">AI Confidence</h4>
                    <span className="text-sm">{prediction.aiConfidence}/10</span>
                  </div>
                  <Progress value={prediction.aiConfidence * 10} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">AI Reasoning</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">
                      {prediction.aiAnalysis.reasoning}
                    </p>
                  </div>

                  <Tabs defaultValue="supporting">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="supporting">Supporting Points</TabsTrigger>
                      <TabsTrigger value="counter">Counter Points</TabsTrigger>
                    </TabsList>
                    <TabsContent value="supporting" className="mt-2">
                      <div className="space-y-2">
                        {prediction.aiAnalysis.supporting.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full bg-market-green/20 text-market-green flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <p>{point}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="counter" className="mt-2">
                      <div className="space-y-2">
                        {prediction.aiAnalysis.counter.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full bg-market-red/20 text-market-red flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <p>{point}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="pt-2 space-x-2 flex justify-end">
                  <Button variant="outline" onClick={handleNewPrediction}>
                    New Prediction
                  </Button>
                  <Button onClick={handleSavePrediction}>
                    Save Prediction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Market Data</CardTitle>
              <CardDescription>
                Current market conditions to inform your prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="indices">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="indices">Indices</TabsTrigger>
                  <TabsTrigger value="sectors">Sectors</TabsTrigger>
                  <TabsTrigger value="stocks">Stocks</TabsTrigger>
                </TabsList>
                <TabsContent value="indices" className="pt-3">
                  <MarketDataTable data={mockMarketData} title="" />
                </TabsContent>
                <TabsContent value="sectors" className="pt-3">
                  <MarketDataTable data={mockSectorData} title="" />
                </TabsContent>
                <TabsContent value="stocks" className="pt-3">
                  <MarketDataTable data={mockStockData} title="" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MakePrediction;
