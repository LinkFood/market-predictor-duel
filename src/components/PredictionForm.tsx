import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Info, DollarSign, Percent, Search, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/lib/prediction-service";
import { searchStocks, getStockData } from "@/lib/market";

// Types
type PredictionType = 'trend' | 'price';

interface PredictionFormProps {
  onPredictionMade: (prediction: any) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionMade }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [predictionType, setPredictionType] = useState<PredictionType>('trend');
  const [timeframe, setTimeframe] = useState('1d');
  const [trendPrediction, setTrendPrediction] = useState<'uptrend' | 'downtrend' | null>(null);
  const [pricePrediction, setPricePrediction] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching stocks:', error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search for stocks. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stock selection
  const handleSelectStock = async (stock: any) => {
    try {
      setIsLoading(true);
      const stockDetails = await getStockData(stock.symbol);
      setSelectedStock(stockDetails);
      setShowSearchResults(false);
      setSearchQuery(stock.name);
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
      setSearchQuery('');
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Search for a stock</label>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Enter stock name or symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              type="button" 
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-2 border rounded-md shadow-sm overflow-hidden">
              <ul className="divide-y">
                {searchResults.map((stock, index) => (
                  <li
                    key={`${stock.symbol}-${index}`}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-xs text-gray-500">{stock.symbol}</div>
                      </div>
                      <div className={cn(
                        "text-sm font-medium",
                        stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        ${stock.price.toFixed(2)}
                        <span className="ml-2">
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && (
            <div className="mt-2 text-sm text-gray-500 text-center p-4 border rounded-md">
              No stocks found matching "{searchQuery}"
            </div>
          )}
        </div>
        
        {/* Selected Stock Info */}
        {selectedStock && (
          <div className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-lg">{selectedStock.name}</div>
                <div className="text-sm text-gray-500">{selectedStock.symbol}</div>
              </div>
              <div className={cn(
                "text-lg font-bold",
                selectedStock.changePercent >= 0 ? "text-green-600" : "text-red-600"
              )}>
                ${selectedStock.price.toFixed(2)}
                <div className="text-sm">
                  {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Prediction Type Tabs */}
        {selectedStock && (
          <Tabs defaultValue="trend" onValueChange={(value) => setPredictionType(value as PredictionType)} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="trend">Trend Prediction</TabsTrigger>
              <TabsTrigger value="price">Price Prediction</TabsTrigger>
            </TabsList>
            
            {/* Trend Prediction */}
            <TabsContent value="trend" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prediction timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="2w">2 Weeks</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your trend prediction</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setTrendPrediction("uptrend")}
                    className={cn(
                      "h-20",
                      trendPrediction === "uptrend"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <TrendingUp className={cn("h-6 w-6", trendPrediction === "uptrend" ? "text-white" : "text-green-600")} />
                      <span>Uptrend</span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setTrendPrediction("downtrend")}
                    className={cn(
                      "h-20",
                      trendPrediction === "downtrend"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <TrendingDown className={cn("h-6 w-6", trendPrediction === "downtrend" ? "text-white" : "text-red-600")} />
                      <span>Downtrend</span>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Price Prediction */}
            <TabsContent value="price" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prediction timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="2w">2 Weeks</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your price prediction</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Enter your price prediction"
                    value={pricePrediction}
                    onChange={(e) => setPricePrediction(e.target.value)}
                    className="pl-10"
                    step="0.01"
                    min="0"
                  />
                </div>
                {selectedStock && (
                  <p className="text-xs text-gray-500">
                    Current price: ${selectedStock.price.toFixed(2)}
                  </p>
                )}
              </div>
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
