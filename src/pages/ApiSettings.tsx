
import React, { useEffect, useState } from "react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import UserRoleManager from "@/components/settings/UserRoleManager";
import PolygonApiKeyForm from "@/components/settings/PolygonApiKeyForm";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiSettings: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Force refresh when component mounts to ensure we have the latest user data
  useEffect(() => {
    const loadUserData = async () => {
      console.log("ApiSettings mounted, refreshing session");
      try {
        await refreshSession();
        setRefreshKey(prev => prev + 1);
        toast({
          title: "Session refreshed",
          description: "User data has been updated.",
        });
      } catch (error) {
        console.error("Error refreshing session:", error);
        toast({
          title: "Error",
          description: "Failed to refresh user session. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadUserData();
  }, [refreshSession, toast]);

  const handleBackClick = () => {
    navigate("/app/settings");
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

      <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          To configure API connections, first assign yourself an admin role using the form below, then refresh the page.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card className="overflow-visible shadow-sm border border-gray-200 hover:border-gray-300 transition-all">
          <CardHeader>
            <CardTitle>Admin Role Management</CardTitle>
            <CardDescription>
              Assign admin role to your account to manage API settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserRoleManager 
              key={refreshKey} 
              adminEmail={user?.email || ""} 
            />
          </CardContent>
        </Card>
        
        <PolygonApiKeyForm />
      </div>
    </LayoutContainer>
  );
};

export default ApiSettings;
