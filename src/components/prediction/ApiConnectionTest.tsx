import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Server, CheckCircle, XCircle, HelpCircle, AlertTriangle } from "lucide-react";
import { testXaiApiConnection } from "@/lib/xai";
import { useToast } from "@/hooks/use-toast";

const ApiConnectionTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-run the test when the component mounts
  useEffect(() => {
    runTest();
  }, []);

  const runTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Testing X.ai API connection...");
      const result = await testXaiApiConnection();
      console.log("X.ai API test results:", result);
      
      setResults(result);
      
      if (result.success) {
        toast({
          title: "API Test Successful",
          description: "X.ai API is working correctly."
        });
      } else {
        setError(result.message);
        toast({
          variant: "destructive",
          title: "API Test Failed",
          description: result.message
        });
      }
    } catch (err) {
      console.error("Error testing API:", err);
      setError("Failed to test API connection");
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "An error occurred while testing the API connection."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
    }
    
    if (!results) {
      return <HelpCircle className="h-6 w-6 text-slate-400" />;
    }
    
    if (results.success) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    
    return <XCircle className="h-6 w-6 text-red-500" />;
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return "Testing API connection...";
    }
    
    if (!results) {
      return "API connection status unknown";
    }
    
    if (results.success) {
      return "X.ai API is connected and working correctly";
    }
    
    return `API connection failed: ${results.message}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">X.ai API Connection</CardTitle>
            <CardDescription>
              Test connection to the X.ai API for prediction functionality
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {renderStatusIcon()}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runTest} 
              disabled={isLoading}
              className="flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Server className="h-3.5 w-3.5" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${
              isLoading ? "bg-blue-500" :
              results?.success ? "bg-green-500" :
              results ? "bg-red-500" : "bg-slate-300"
            }`}></div>
            <span className="font-medium">Status:</span>
            <span className="text-muted-foreground">{getStatusMessage()}</span>
          </div>
          
          {/* API Details */}
          {results?.success && results?.details && (
            <div className="mt-4 text-sm space-y-2 border rounded-md p-3 bg-slate-50 dark:bg-slate-900">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">{results.details.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">{results.details.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model available:</span>
                <span className={`font-medium ${results.details.modelAvailable ? "text-green-600" : "text-red-600"}`}>
                  {results.details.modelAvailable ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion test:</span>
                <span className={`font-medium ${results.details.completionSuccess ? "text-green-600" : "text-red-600"}`}>
                  {results.details.completionSuccess ? "Passed" : "Failed"}
                </span>
              </div>
              {results.details.responseTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response time:</span>
                  <span className="font-medium">{results.details.responseTime}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription className="mt-2">
                {error}
                <div className="mt-2 text-sm opacity-90">
                  <div>Make sure:</div>
                  <ul className="list-disc pl-5 mt-1">
                    <li>A valid X.ai API key is set in Supabase secrets</li>
                    <li>The API key has sufficient permissions and quota</li>
                    <li>The edge function is deployed correctly</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Success display */}
          {results?.success && (
            <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900 mt-3">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Connection Successful</AlertTitle>
              <AlertDescription>
                The X.ai API is correctly configured and working. You can now use AI predictions.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConnectionTest;
