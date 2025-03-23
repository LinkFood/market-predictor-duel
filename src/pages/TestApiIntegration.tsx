import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPrediction } from "@/lib/xai-service";
import { StockPredictionRequest, StockPredictionResponse } from "@/lib/xai/types";
import { searchStocks } from "@/lib/market";
import { StockData } from "@/lib/market/types";
import { useToast } from "@/hooks/use-toast";

interface ApiTestSectionProps {
  title: string;
  children: React.ReactNode;
}

const ApiTestSection: React.FC<ApiTestSectionProps> = ({ title, children }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const XaiTest: React.FC = () => {
  const [ticker, setTicker] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1d");
  const [predictionType, setPredictionType] = useState<"price" | "trend">("trend");
  const [prediction, setPrediction] = useState<StockPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetPrediction = async () => {
    setIsLoading(true);
    try {
      const request: StockPredictionRequest = {
        ticker,
        timeframe,
        predictionType,
      };
      const response = await getPrediction(request);
      setPrediction(response);
    } catch (error: any) {
      console.error("Error fetching prediction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch prediction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ticker">Ticker</Label>
          <Input
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="timeframe">Timeframe</Label>
          <Input
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="predictionType">Prediction Type</Label>
          <select
            id="predictionType"
            className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            value={predictionType}
            onChange={(e) =>
              setPredictionType(e.target.value as "price" | "trend")
            }
          >
            <option value="trend">Trend</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
      <Button onClick={handleGetPrediction} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Prediction"}
      </Button>
      {prediction && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Prediction Result:</h3>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const MarketDataTest: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("AAPL");
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearchStocks = async () => {
    setIsLoading(true);
    try {
      const results = await searchStocks(searchQuery, 5);
      setSearchResults(results.results || []);
    } catch (error: any) {
      console.error("Error searching stocks:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to search stocks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search for stocks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearchStocks} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Search Results:</h3>
          <ul>
            {searchResults.map((stock) => (
              <li key={stock.symbol}>
                {stock.name} ({stock.symbol}) - Price: {stock.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const TestApiIntegration: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Integration Tests</h1>
      <Tabs defaultValue="xai" className="w-full">
        <TabsList>
          <TabsTrigger value="xai">X.ai API</TabsTrigger>
          <TabsTrigger value="market">Market Data API</TabsTrigger>
        </TabsList>
        <TabsContent value="xai">
          <ApiTestSection title="X.ai Prediction API Test">
            <XaiTest />
          </ApiTestSection>
        </TabsContent>
        <TabsContent value="market">
          <ApiTestSection title="Market Data API Test">
            <MarketDataTest />
          </ApiTestSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestApiIntegration;
