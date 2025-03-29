
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Key, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

const ApiSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error' | 'info' | null, message: string}>({
    type: null,
    message: ""
  });

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
      checkAdminStatus(user.id);
    }
  }, [user]);

  const handleBackClick = () => {
    navigate("/app/settings");
  };

  const checkAdminStatus = async (uid: string) => {
    try {
      console.log("Checking admin status for user:", uid);
      const { data, error } = await supabase.rpc('user_has_role', {
        check_user_id: uid,
        check_role: 'admin'
      });
      
      if (error) {
        console.error("Error checking admin role:", error);
        return;
      }
      
      console.log("Admin role check result:", data);
      setIsAdmin(!!data);
      
      if (data) {
        fetchApiKey();
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchApiKey = async () => {
    try {
      console.log("Testing API connection status");
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      console.log("Connection test result:", data, error);
      
      if (!error && data?.success) {
        setApiKey("••••••••••••••••••••••");
        setStatusMessage({
          type: 'success',
          message: "Polygon API connection is active"
        });
      } else {
        setStatusMessage({
          type: 'info',
          message: "Polygon API key needs to be configured"
        });
      }
    } catch (error) {
      console.error("Error fetching API key:", error);
      setStatusMessage({
        type: 'error',
        message: "Error checking API connection status"
      });
    }
  };

  const assignAdminRole = async () => {
    if (!userId) {
      toast({
        title: "User ID Required",
        description: "Please ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('user_has_role', {
        check_user_id: userId,
        check_role: 'admin'
      });
      
      if (error) {
        throw new Error("Error checking user role");
      }
      
      if (data) {
        // User already has admin role
        setIsAdmin(true);
        toast({
          title: "Success",
          description: "You already have admin privileges",
          variant: "default",
        });
      } else {
        // Assign admin role using an insert
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast({
          title: "Success",
          description: "Admin role assigned successfully",
          variant: "default",
        });
        setIsAdmin(true);
      }
    } catch (error: any) {
      console.error("Error assigning admin role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Polygon API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Saving Polygon API key...");
      const { data, error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey }
      });

      console.log("API key response:", data, error);

      if (error) {
        throw new Error(error.message);
      } else if (data?.success) {
        setStatusMessage({
          type: 'success',
          message: "API key saved and validated successfully"
        });
        toast({
          title: "API Key Saved",
          description: "The Polygon API key has been saved and validated",
          variant: "default",
        });
      } else {
        throw new Error(data?.error || "Failed to save API key");
      }
    } catch (error: any) {
      console.error("Error saving API key:", error);
      setStatusMessage({
        type: 'error',
        message: error.message || "Failed to save API key"
      });
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutContainer>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Button>
        <div>
          <h1 className="title-lg">API Connections</h1>
          <p className="subtitle">Configure market data and AI service connections</p>
        </div>
      </div>

      {statusMessage.type && (
        <Alert className={`mb-6 ${
          statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          statusMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
           statusMessage.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
           <AlertCircle className="h-4 w-4" />}
          <AlertDescription>
            {statusMessage.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {!isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Role Management</CardTitle>
              <CardDescription>
                Assign admin role to your account to manage API settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input
                    id="user-id"
                    value={userId}
                    readOnly
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500">
                    This is your user ID. Click the button below to assign yourself admin privileges.
                  </p>
                </div>
                <Button
                  onClick={assignAdminRole}
                  disabled={isLoading}
                >
                  {isLoading ? "Assigning..." : "Assign Admin Role"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Polygon API Configuration</CardTitle>
              <CardDescription>
                Configure the application's Polygon.io API key for real-time stock data.{" "}
                <a 
                  href="https://polygon.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline inline-flex items-center"
                >
                  Get an API key from Polygon.io
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Polygon.io API Key</Label>
                  <Input
                    id="api-key"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your API key will be stored securely in the edge function and only available to authenticated administrators.
                  </p>
                </div>
                <Button
                  onClick={saveApiKey}
                  disabled={isLoading || !apiKey || apiKey === "••••••••••••••••••••••"}
                >
                  {isLoading ? "Saving..." : "Save API Key"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutContainer>
  );
};

export default ApiSettings;
