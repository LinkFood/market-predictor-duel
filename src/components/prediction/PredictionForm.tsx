
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/lib/prediction";
import { getStockData } from "@/lib/market";
import { FEATURES } from "@/lib/config";

// Components
import SearchBar from "./SearchBar";
import StockInfo from "./StockInfo";
import TrendPrediction from "./TrendPrediction";
import PricePrediction from "./PricePrediction";

// Types
type PredictionType = 'trend' | 'price';

interface PredictionFormProps {
  onPredictionMade: (prediction: any) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionMade }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [predictionType, setPredictionType] = useState<PredictionType>('trend');
  const [timeframe, setTimeframe] = useState('1d');
  const [trendPrediction, setTrendPrediction] = useState<'uptrend' | 'downtrend' | null>(null);
  const [pricePrediction, setPricePrediction] = useState<string>('');

  // Handle stock selection
  const handleSelectStock = async (stock: any) => {
    try {
      setIsLoading(true);
      const stockDetails = await getStockData(stock.symbol);
      setSelectedStock(stockDetails);
    } catch (error) {
      console.error('Error fetching stock details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stock details. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedStock) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a stock"
      });
      return;
    }

    if (predictionType === 'trend' && !trendPrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a trend direction"
      });
      return;
    }

    if (predictionType === 'price' && !pricePrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a price prediction"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const predictionRequest = {
        ticker: selectedStock.symbol,
        predictionType,
        userPrediction: predictionType === 'trend' ? trendPrediction! : pricePrediction,
        timeframe
      };
      
      const newPrediction = await createPrediction(predictionRequest);
      
      toast({
        title: "Prediction Submitted",
        description: `Your prediction for ${selectedStock.name} has been submitted successfully.`
      });
      
      // Reset form
      setSelectedStock(null);
      setTrendPrediction(null);
      setPricePrediction('');
      
      // Notify parent
      onPredictionMade(newPrediction);
    } catch (error) {
      console.error('Error creating prediction:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your prediction. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Make a Prediction</CardTitle>
        <CardDescription>
          Select a stock and predict its future price or trend direction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stock Search */}
        <SearchBar onSelectStock={handleSelectStock} />
        
        {/* Data Source Indicator */}
        <div className="flex items-center text-xs text-muted-foreground gap-1 mt-2">
          <Info className="h-3 w-3" />
          <span>
            {FEATURES.enableRealMarketData 
              ? "Using real-time market data from Polygon.io" 
              : "Using simulated market data"}
          </span>
          {FEATURES.enableRealMarketData && (
            <a 
              href="https://polygon.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-indigo-500 hover:underline ml-1"
            >
              <ExternalLink className="h-3 w-3 mr-0.5" />
              Polygon.io
            </a>
          )}
        </div>
        
        {/* Selected Stock Info */}
        {selectedStock && <StockInfo stock={selectedStock} />}
        
        {/* Prediction Type Tabs */}
        {selectedStock && (
          <Tabs defaultValue="trend" onValueChange={(value) => setPredictionType(value as PredictionType)} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="trend">Trend Prediction</TabsTrigger>
              <TabsTrigger value="price">Price Prediction</TabsTrigger>
            </TabsList>
            
            {/* Trend Prediction */}
            <TabsContent value="trend" className="space-y-4">
              <TrendPrediction 
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                trendPrediction={trendPrediction}
                setTrendPrediction={setTrendPrediction}
              />
            </TabsContent>
            
            {/* Price Prediction */}
            <TabsContent value="price" className="space-y-4">
              <PricePrediction 
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                pricePrediction={pricePrediction}
                setPricePrediction={setPricePrediction}
                currentPrice={selectedStock?.price}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-col space-y-2">
        <Button 
          onClick={handleSubmit} 
          disabled={
            isLoading || 
            !selectedStock || 
            (predictionType === 'trend' && !trendPrediction) || 
            (predictionType === 'price' && !pricePrediction)
          } 
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Prediction"
          )}
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
