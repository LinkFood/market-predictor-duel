
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPrediction } from "@/lib/xai-service";
import { StockPredictionRequest, StockPredictionResponse } from "@/lib/xai/types";
import { searchStocks } from "@/lib/market";
import { StockData } from "@/lib/market/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Server, CheckCircle, Loader2, Settings } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { Link } from "react-router-dom";

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
          <Select value={timeframe} onValueChange={setTimeframe}>
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
        <div>
          <Label htmlFor="predictionType">Prediction Type</Label>
          <Select 
            value={predictionType} 
            onValueChange={(value) => setPredictionType(value as "price" | "trend")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select prediction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trend">Trend</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleGetPrediction} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Prediction"}
      </Button>
      {prediction && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Prediction Result:</h3>
          <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(prediction, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const MarketDataTest: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("AAPL");
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearchStocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Searching for stocks:", searchQuery);
      const results = await searchStocks(searchQuery, 5);
      console.log("Search results:", results);
      
      setSearchResults(results.results || []);
      setRawResponse(results);
    } catch (error: any) {
      console.error("Error searching stocks:", error);
      setError(error.message || "Failed to search stocks");
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : "Search"}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {searchResults.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Search Results:</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map((stock) => (
                  <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{stock.symbol}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{stock.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">${stock.price.toFixed(2)}</td>
                    <td className={`px-4 py-2 whitespace-nowrap text-sm ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : rawResponse ? (
        <Alert className="mt-4 bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Results Found</AlertTitle>
          <AlertDescription>
            No stocks were found matching your search query.
          </AlertDescription>
        </Alert>
      ) : null}
      
      {rawResponse && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">API Response Details:</h3>
          <div className="text-xs text-gray-500 mb-2">
            This section shows the raw API response, useful for debugging issues.
          </div>
          <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-auto text-xs">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const PolygonApiDiagnostics: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const testDirectConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Polygon API key to test",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);
    setIsError(false);
    
    try {
      console.log("Testing direct connection to Polygon API...");
      const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`);
      
      const status = response.status;
      const responseData = await response.json();
      
      setTestResult({
        success: response.ok,
        status,
        data: responseData,
        message: response.ok ? "Direct connection successful!" : "Failed to connect directly",
        timestamp: new Date().toISOString()
      });
      
      setIsError(!response.ok);
      
      toast({
        title: response.ok ? "Connection Successful" : "Connection Failed",
        description: response.ok 
          ? "Direct connection to Polygon API is working" 
          : `Failed with status ${status}: ${responseData.error || 'Unknown error'}`,
        variant: response.ok ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error testing direct connection:", error);
      setTestResult({
        success: false,
        error: error.message || "Network error",
        message: "Failed to connect directly to Polygon API",
        timestamp: new Date().toISOString()
      });
      setIsError(true);
      
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to Polygon API",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testEdgeFunction = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    setIsError(false);
    
    try {
      console.log("Testing Polygon connection via edge function...");
      
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { 
          test: true,
          apiKey: apiKey.trim() || undefined
        }
      });
      
      console.log("Edge function response:", data, error);
      
      if (error) {
        throw new Error(error.message || "Edge function error");
      }
      
      setTestResult(data);
      setIsError(!data.success);
      
      toast({
        title: data.success ? "Edge Function Connection Successful" : "Edge Function Connection Failed",
        description: data.message || (data.success ? "Connected via edge function" : "Failed to connect via edge function"),
        variant: data.success ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error("Error testing via edge function:", error);
      setTestResult({
        success: false,
        error: error.message || "Edge function error",
        message: "Failed to connect via edge function",
        timestamp: new Date().toISOString()
      });
      setIsError(true);
      
      toast({
        title: "Edge Function Error",
        description: error.message || "Failed to connect via edge function",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const setApiKeyInEdgeFunction = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Polygon API key to set",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      console.log("Setting API key in edge function...");
      
      const { data, error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey: apiKey.trim() }
      });
      
      console.log("Set API key response:", data, error);
      
      if (error) {
        throw new Error(error.message || "Failed to set API key");
      }
      
      if (!data.success) {
        throw new Error(data.message || "Failed to set API key");
      }
      
      toast({
        title: "API Key Set Successfully",
        description: "Your Polygon API key has been stored successfully",
        variant: "default",
      });
      
      // Now test the connection with the newly set key
      await testEdgeFunction();
      
    } catch (error) {
      console.error("Error setting API key:", error);
      
      toast({
        title: "Error Setting API Key",
        description: error.message || "Failed to set API key",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Polygon API Diagnostics</CardTitle>
        <CardDescription>
          Test your Polygon API connection directly or through the edge function
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="polygon-api-key">Polygon API Key</Label>
          <div className="flex gap-2">
            <Input
              id="polygon-api-key"
              type={isVisible ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Polygon API key"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={() => setIsVisible(!isVisible)} 
              type="button"
            >
              {isVisible ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={testDirectConnection} 
            disabled={isTestingConnection}
            variant="outline"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Direct...
              </>
            ) : "Test Direct Connection"}
          </Button>
          
          <Button 
            onClick={testEdgeFunction} 
            disabled={isTestingConnection}
            variant="outline"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Edge Function...
              </>
            ) : "Test Edge Function"}
          </Button>
          
          <Button 
            onClick={setApiKeyInEdgeFunction} 
            disabled={isTestingConnection || !apiKey.trim()}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting API Key...
              </>
            ) : "Set & Test API Key"}
          </Button>
          
          <Button 
            variant="outline" 
            asChild
          >
            <Link to="/app/settings/api">
              <Settings className="mr-2 h-4 w-4" />
              Go to API Settings
            </Link>
          </Button>
        </div>
        
        {testResult && (
          <div className="mt-4">
            <Alert 
              className={`${
                testResult.success 
                  ? "bg-green-50 border-green-200 text-green-800" 
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testResult.success ? "Connection Successful" : "Connection Failed"}
              </AlertTitle>
              <AlertDescription>
                {testResult.message || (testResult.success ? "Successfully connected" : "Failed to connect")}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Response Details:</h4>
              <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 mt-4">
          <Server className="h-4 w-4" />
          <AlertTitle>Setup Guide</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>Enter your Polygon API key in the field above</li>
              <li>Click "Set & Test API Key" to store it in the edge function</li>
              <li>You can test the direct connection to make sure your key works</li>
              <li>If the edge function test is successful, market data will work!</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

const TestApiIntegration: React.FC = () => {
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">API Integration Tests</h1>
      
      <PolygonApiDiagnostics />
      
      <Tabs defaultValue="market" className="w-full">
        <TabsList>
          <TabsTrigger value="market">Market Data API</TabsTrigger>
          <TabsTrigger value="xai">X.ai API</TabsTrigger>
        </TabsList>
        <TabsContent value="market">
          <ApiTestSection title="Market Data API Test">
            <MarketDataTest />
          </ApiTestSection>
        </TabsContent>
        <TabsContent value="xai">
          <ApiTestSection title="X.ai Prediction API Test">
            <XaiTest />
          </ApiTestSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestApiIntegration;
