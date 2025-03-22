
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, InfoIcon, Server, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { testXaiApiConnection } from '@/lib/xai/prediction-service';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
      setResult(null);
      console.log("Testing API connection...");
      
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-500" />
              X.ai API Connection Test
            </CardTitle>
            <CardDescription>
              Test the connection to the X.ai API to ensure predictions can be generated
            </CardDescription>
          </div>
          {result?.details?.provider && (
            <Badge variant={result.success ? "success" : "destructive"} className="ml-2">
              {result.details.provider.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading && (
          <div className="space-y-2 py-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Testing connection...</span>
              <span>Please wait</span>
            </div>
            <Progress value={result ? 100 : 45} className="h-2" />
          </div>
        )}
        
        {result && (
          <div className="mb-4 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                result.success 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {result.success ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{result.success ? "Connection Successful" : "Connection Failed"}</h3>
                <p className="text-muted-foreground text-sm">{result.message}</p>
              </div>
            </div>
            
            {result.details?.model && (
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
                <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <span className="font-medium text-sm">Model:</span>{" "}
                  <span className="text-sm">{result.details.model}</span>
                  {result.details.modelAvailable === false && (
                    <span className="text-amber-600 text-xs ml-2">(Not available)</span>
                  )}
                </div>
              </div>
            )}
            
            {!result.success && (
              <Alert className="mt-2 bg-amber-50 text-amber-800 border-amber-200">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Troubleshooting Tips</AlertTitle>
                <AlertDescription className="text-sm mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check that your X.ai API key is correctly set in Supabase secrets</li>
                    <li>Verify that your API key has the necessary permissions</li>
                    <li>Ensure your X.ai account has access to the requested model (grok-2-latest)</li>
                    <li>The application will fall back to mock data if the API is unavailable</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {result.details && (
              <Accordion type="single" collapsible className="mt-2 border rounded-md">
                <AccordionItem value="details" className="border-0">
                  <AccordionTrigger className="text-sm font-medium px-4 py-3">
                    Technical Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-48 mx-4 mb-3">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(result.details, null, 2)}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnection} 
          disabled={isLoading}
          className="w-full"
          variant={result?.success ? "outline" : "default"}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            result?.success ? "Test Again" : "Test X.ai API Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConnectionTest;
