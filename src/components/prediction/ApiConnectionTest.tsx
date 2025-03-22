import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { testXaiApiConnection } from '@/lib/xai/prediction-service';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
            <CardTitle>X.ai API Connection Test</CardTitle>
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
            
            {result.details?.model && (
              <div>
                <span className="font-medium">Model:</span> {result.details.model}
              </div>
            )}
            
            <div>
              <span className="font-medium">Message:</span> {result.message}
            </div>
            
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
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm font-medium">
                    Technical Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-48">
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
