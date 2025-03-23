
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, AlertCircle, Save, Server, CheckCircle, ExternalLink, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { testPolygonApiConnection } from "@/lib/market/api-test";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function PolygonApiKeyForm() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Polygon.io API key to test",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testPolygonApiConnection(apiKey);
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Polygon API"
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error testing API connection:", error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Test Failed",
        description: "Could not complete API test. See details below.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Polygon.io API key to save",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save API key to Supabase Secrets
      const { error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey }
      });
      
      if (error) {
        throw new Error(`Failed to save API key: ${error.message}`);
      }
      
      toast({
        title: "API Key Saved",
        description: "Your Polygon.io API key has been securely saved"
      });
      
      // Reset form
      setApiKey("");
      setTestResult(null);
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error Saving API Key",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          Polygon.io API Key
        </CardTitle>
        <CardDescription>
          Connect to real-time market data by adding your Polygon.io API key.
          <a 
            href="https://polygon.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 inline-flex items-center gap-1 ml-1"
          >
            Get an API key <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            placeholder="Enter your Polygon.io API key"
          />
        </div>
        
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            {testResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {testResult.success ? "Connection Successful" : "Connection Failed"}
            </AlertTitle>
            <AlertDescription>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}
        
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-4 w-4 text-blue-700" />
          <AlertDescription className="text-blue-700">
            Your API key will be securely stored in Supabase Edge Functions environment.
            The key is never exposed to browser clients.
          </AlertDescription>
        </Alert>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={testApiKey} 
          disabled={isTesting || isSaving}
          className="flex items-center gap-2"
        >
          <Server className="h-4 w-4" />
          {isTesting ? "Testing..." : "Test Connection"}
        </Button>
        
        <Button 
          onClick={saveApiKey} 
          disabled={isTesting || isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save API Key"}
        </Button>
      </CardFooter>
    </Card>
  );
}
