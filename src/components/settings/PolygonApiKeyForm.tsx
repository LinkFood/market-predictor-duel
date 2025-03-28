import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink, Loader2, Key, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { Link } from "react-router-dom";

interface PolygonApiKeyFormProps {
  isAdmin?: boolean;
}

const PolygonApiKeyForm: React.FC<PolygonApiKeyFormProps> = ({ isAdmin = false }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<null | "success" | "error">(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(isAdmin);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!user) return;
        
        setCurrentUser(user);
        
        if (isAdmin) {
          setIsAdminUser(true);
          fetchApiKey();
          return;
        }

        const { data, error } = await supabase.rpc('user_has_role', {
          check_user_id: user.id,
          check_role: 'admin'
        });
        
        if (error) {
          console.error("Error checking admin role:", error);
          return;
        }
        
        console.log("Admin role check result:", data);
        
        if (data === true) {
          setIsAdminUser(true);
          fetchApiKey();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdmin();
  }, [isAdmin, user]);

  const fetchApiKey = async () => {
    setIsLoading(true);
    try {
      console.log("Testing API connection...");
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      console.log("Connection test result:", data, error);

      if (error) {
        console.error("Error testing API connection:", error);
        setConnectionStatus("error");
      } else if (data && data.success) {
        setConnectionStatus("success");
        setApiKey("••••••••••••••••••••••");
        setTestResponse(data);
      } else {
        setConnectionStatus("error");
        setTestResponse(data);
      }
    } catch (error) {
      console.error("Error fetching API key status:", error);
      setConnectionStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Polygon API key.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Saving Polygon API key...");
      const { data, error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey }
      });

      console.log("Set API key response:", data, error);

      if (error) {
        console.error("Error saving API key:", error);
        toast({
          title: "Error saving API Key",
          description: "Failed to save the Polygon API key. Please try again.",
          variant: "destructive",
        });
        setConnectionStatus("error");
      } else if (data && data.success) {
        toast({
          title: "API Key saved successfully",
          description: "The Polygon API key has been saved and validated.",
          variant: "default",
        });
        setConnectionStatus("success");
        setTestResponse(data);
      } else {
        toast({
          title: "Error saving API Key",
          description: data?.error || "Failed to save the API key. Please try again.",
          variant: "destructive",
        });
        setConnectionStatus("error");
        setTestResponse(data);
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      console.log("Testing API connection...");
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      console.log("Connection test response:", data, error);

      if (error) {
        console.error("Error testing API connection:", error);
        toast({
          title: "Connection Test Failed",
          description: "Could not connect to Polygon API. Please check the key.",
          variant: "destructive",
        });
        setConnectionStatus("error");
        setTestResponse(null);
      } else if (data && data.success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Polygon API.",
          variant: "default",
        });
        setConnectionStatus("success");
        setTestResponse(data);
      } else {
        toast({
          title: "Connection Test Failed",
          description: data?.message || "Could not connect to Polygon API.",
          variant: "destructive",
        });
        setConnectionStatus("error");
        setTestResponse(data);
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while testing the connection.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  if (!isAdminUser) {
    return (
      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Market data API configuration is managed by administrators.
          Use the Admin Role Manager tool to grant yourself admin access.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Polygon API Configuration</CardTitle>
          <CardDescription>
            Configure the application's Polygon.io API key for real-time stock data.{" "}
            <a 
              href="https://polygon.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline inline-flex items-center"
            >
              Get an API key from Polygon.io
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === "success" && (
            <Alert variant="default" className="bg-green-50 text-green-800 border-green-200 mb-4">
              <CheckCircle className="h-4 w-4" />
              <div className="flex justify-between w-full items-center">
                <div className="space-y-1">
                  <AlertTitle>Connection Active</AlertTitle>
                  <AlertDescription>Polygon API connection is active and working.</AlertDescription>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
              </div>
            </Alert>
          )}
          
          {connectionStatus === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <div className="flex justify-between w-full items-center">
                <div className="space-y-1">
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>
                    {testResponse?.message || "Polygon API connection is not working."}
                  </AlertDescription>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Not Connected</Badge>
              </div>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Polygon.io API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your API key"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleShowApiKey}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showApiKey ? "Hide API Key" : "Show API Key"}</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key will be stored securely in the edge function and only available to authenticated administrators.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isLoading || !apiKey || apiKey === "••••••••••••••••••••••"}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Save API Key
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isTestingConnection}
                onClick={testConnection}
                className="flex-1"
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </form>
          
          {testResponse && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Connection Test Results</h4>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md overflow-auto text-xs max-h-48">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t flex flex-col items-start">
          <p className="text-sm text-muted-foreground mb-2">
            For more detailed diagnostics and testing, visit the API Testing page.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/test-api">
              Go to API Testing Page
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PolygonApiKeyForm;
