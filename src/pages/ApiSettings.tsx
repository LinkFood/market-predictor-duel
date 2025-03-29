
import React from "react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

const ApiSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRoleSaving, setIsRoleSaving] = React.useState(false);

  React.useEffect(() => {
    // Set user ID when available
    if (user?.id) {
      setUserId(user.id);
      // Check if user is admin
      checkAdminStatus(user.id);
    }
  }, [user]);

  const checkAdminStatus = async (uid: string) => {
    try {
      const { data, error } = await supabase.rpc('user_has_role', {
        check_user_id: uid,
        check_role: 'admin'
      });
      
      if (error) {
        console.error("Error checking admin role:", error);
        return;
      }
      
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
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      if (!error && data?.success) {
        setApiKey("••••••••••••••••••••••");
      }
    } catch (error) {
      console.error("Error fetching API key:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/app/settings");
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
    
    setIsRoleSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("assign-admin-role", {
        body: { userId, adminEmail: user?.email || "" }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to assign admin role.",
          variant: "destructive",
        });
      } else if (data?.success) {
        toast({
          title: "Success",
          description: "Admin role assigned successfully. Please refresh the page.",
          variant: "default",
        });
        setIsAdmin(true);
      } else {
        toast({
          title: "Error",
          description: data?.error || "Failed to assign admin role.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsRoleSaving(false);
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
      const { data, error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey }
      });

      if (error) {
        toast({
          title: "Error saving API Key",
          description: "Failed to save the Polygon API key. Please try again.",
          variant: "destructive",
        });
      } else if (data?.success) {
        toast({
          title: "API Key saved successfully",
          description: "The Polygon API key has been saved and validated.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error saving API Key",
          description: data?.error || "Failed to save the API key. Please try again.",
          variant: "destructive",
        });
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
  
  return (
    <LayoutContainer>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBackClick} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Button>
        <div>
          <h1 className="title-lg">API Connections</h1>
          <p className="subtitle">Configure market data and AI service connections</p>
        </div>
      </div>

      {!isAdmin && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            To configure API connections, first assign yourself an admin role using the form below, then refresh the page.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {!isAdmin && (
          <Card className="overflow-visible shadow-sm border border-gray-200 hover:border-gray-300 transition-all">
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
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID to assign admin role"
                    className="bg-white border-gray-300 hover:border-gray-400 focus:border-primary cursor-text"
                    aria-label="User ID"
                  />
                  <p className="text-sm text-gray-500">
                    {userId ? "We've pre-filled your user ID. Click the button below to assign yourself admin privileges." : "Enter your user ID to assign admin privileges."}
                  </p>
                </div>
                <Button
                  onClick={assignAdminRole}
                  className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
                  disabled={isRoleSaving || !userId}
                >
                  {isRoleSaving ? "Assigning..." : "Assign Admin Role"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isAdmin && (
          <Card className="overflow-visible shadow-sm border border-gray-200 hover:border-gray-300 transition-all">
            <CardHeader>
              <CardTitle>Polygon API Configuration</CardTitle>
              <CardDescription>
                Configure the application's Polygon.io API key for real-time stock data.{" "}
                <a 
                  href="https://polygon.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline inline-flex items-center cursor-pointer"
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
                    className="cursor-text"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your API key will be stored securely in the edge function and only available to authenticated administrators.
                  </p>
                </div>
                <Button
                  onClick={saveApiKey}
                  disabled={isLoading || !apiKey || apiKey === "••••••••••••••••••••••"}
                  className="cursor-pointer"
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
