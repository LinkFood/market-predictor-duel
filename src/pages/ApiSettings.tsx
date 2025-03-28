
import React from "react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import UserRoleManager from "@/components/settings/UserRoleManager";
import PolygonApiKeyForm from "@/components/settings/PolygonApiKeyForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const ApiSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/app/settings");
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
            <UserRoleManager />
          </CardContent>
        </Card>
        
        <PolygonApiKeyForm />
      </div>
    </LayoutContainer>
  );
};

export default ApiSettings;
