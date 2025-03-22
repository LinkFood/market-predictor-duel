
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { testXaiApiConnection } from '@/lib/xai/prediction-service';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ApiConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | {
    success: boolean;
    message: string;
    details?: any;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Testing X.ai API connection...");
      
      const testResult = await testXaiApiConnection();
      console.log("Test result:", testResult);
      
      setResult(testResult);
    } catch (err) {
      console.error("Error testing API connection:", err);
      setError(err instanceof Error ? err.message : "Failed to test API connection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>X.ai API Connection Test</CardTitle>
        <CardDescription>
          Test the connection to the X.ai API to ensure predictions can be generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {result.success ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1" />
                  Failed
                </span>
              )}
            </div>
            <div>
              <span className="font-medium">Message:</span> {result.message}
            </div>
            
            {result.details && (
              <div className="mt-2">
                <div className="font-medium mb-1">Details:</div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-48">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(result.details, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test X.ai API Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConnectionTest;
