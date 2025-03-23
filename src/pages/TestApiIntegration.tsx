import React, { useState } from "react";
import { runAllPolygonTests, testGetStockData } from "@/lib/market/test-polygon-api";
import { runAllXAITests } from "@/lib/test-xai-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";

type TestResult = {
  success: boolean;
  data?: any;
  error?: string;
};

const TestApiIntegration: React.FC = () => {
  const [polygonResults, setPolygonResults] = useState<TestResult | null>(null);
  const [xaiResults, setXaiResults] = useState<TestResult | null>(null);
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [isLoading, setIsLoading] = useState(false);

  const runPolygonTests = async () => {
    setIsLoading(true);
    try {
      const result = await runAllPolygonTests();
      setPolygonResults({ success: true, data: "All Polygon.io API tests passed!" });
    } catch (error) {
      console.error("Polygon.io test error:", error);
      setPolygonResults({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runXAITests = async () => {
    setIsLoading(true);
    try {
      const result = await runAllXAITests();
      setXaiResults({ success: true, data: "All X.AI API tests passed!" });
    } catch (error) {
      console.error("X.AI test error:", error);
      setXaiResults({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSingleStock = async () => {
    setIsLoading(true);
    try {
      const result = await testGetStockData(stockSymbol);
      setPolygonResults({ success: true, data: result });
    } catch (error) {
      console.error("Stock test error:", error);
      setPolygonResults({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">API Integration Testing</h1>
        
        <Tabs defaultValue="polygon" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="polygon">Polygon.io API</TabsTrigger>
            <TabsTrigger value="xai">X.AI API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="polygon">
            <Card>
              <CardHeader>
                <CardTitle>Test Polygon.io Market Data API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4 items-center">
                    <input
                      type="text"
                      className="border rounded p-2 w-32"
                      value={stockSymbol}
                      onChange={(e) => setStockSymbol(e.target.value)}
                      placeholder="Stock symbol"
                    />
                    <Button 
                      onClick={testSingleStock}
                      disabled={isLoading}
                    >
                      Test Single Stock
                    </Button>
                  </div>
                  
                  <div>
                    <Button 
                      onClick={runPolygonTests}
                      disabled={isLoading}
                      variant="secondary"
                    >
                      Run All Polygon.io Tests
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                  {isLoading && <div className="text-blue-600">Running tests...</div>}
                  
                  {polygonResults && (
                    <div className={`p-4 rounded-md mt-2 ${
                      polygonResults.success 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                      {polygonResults.success ? (
                        <div>
                          <div className="font-semibold">Success!</div>
                          {typeof polygonResults.data === 'string' 
                            ? polygonResults.data
                            : <pre className="mt-2 text-xs overflow-auto max-h-80">
                                {JSON.stringify(polygonResults.data, null, 2)}
                              </pre>
                          }
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold">Error:</div>
                          <div>{polygonResults.error}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="xai">
            <Card>
              <CardHeader>
                <CardTitle>Test X.AI Prediction API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Button 
                    onClick={runXAITests}
                    disabled={isLoading}
                  >
                    Run All X.AI Tests
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                  {isLoading && <div className="text-blue-600">Running tests...</div>}
                  
                  {xaiResults && (
                    <div className={`p-4 rounded-md mt-2 ${
                      xaiResults.success 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                      {xaiResults.success ? (
                        <div>
                          <div className="font-semibold">Success!</div>
                          {typeof xaiResults.data === 'string' 
                            ? xaiResults.data
                            : <pre className="mt-2 text-xs overflow-auto max-h-80">
                                {JSON.stringify(xaiResults.data, null, 2)}
                              </pre>
                          }
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold">Error:</div>
                          <div>{xaiResults.error}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TestApiIntegration;