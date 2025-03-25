
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";

interface PolygonApiKeyFormProps {
  isAdmin?: boolean;
}

const PolygonApiKeyForm: React.FC<PolygonApiKeyFormProps> = ({ isAdmin = false }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<null | "success" | "error">(null);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(isAdmin);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        setCurrentUser(user);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        if (data && data.role === 'admin') {
          setIsAdminUser(true);
          fetchApiKey();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdmin();
  }, []);

  const fetchApiKey = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      if (error) {
        console.error("Error testing API connection:", error);
      } else if (data && data.success) {
        setConnectionStatus("success");
        setApiKey("••••••••••••••••••••••"); // Mask the actual key
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      console.error("Error fetching API key status:", error);
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
      const { data, error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey }
      });

      if (error) {
        console.error("Error saving API key:", error);
        toast({
          title: "Error saving API Key",
          description: "Failed to save the Polygon API key. Please try again.",
          variant: "destructive",
        });
      } else if (data && data.success) {
        toast({
          title: "API Key saved successfully",
          description: "The Polygon API key has been saved and validated.",
          variant: "success",
        });
        setConnectionStatus("success");
      } else {
        toast({
          title: "Error saving API Key",
          description: data?.error || "Failed to save the API key. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      if (error) {
        console.error("Error testing API connection:", error);
        toast({
          title: "Connection Test Failed",
          description: "Could not connect to Polygon API. Please check the key.",
          variant: "destructive",
        });
        setConnectionStatus("error");
      } else if (data && data.success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Polygon API.",
          variant: "default",
        });
        setConnectionStatus("success");
      } else {
        toast({
          title: "Connection Test Failed",
          description: data?.message || "Could not connect to Polygon API.",
          variant: "destructive",
        });
        setConnectionStatus("error");
      }
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
                <AlertDescription>Polygon API connection is active and working.</AlertDescription>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
              </div>
            </Alert>
          )}
          
          {connectionStatus === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <div className="flex justify-between w-full items-center">
                <AlertDescription>Polygon API connection is not working.</AlertDescription>
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
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Saving..." : "Save API Key"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isTestingConnection}
                onClick={testConnection}
                className="flex-1"
              >
                {isTestingConnection ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolygonApiKeyForm;
