
import React from "react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import UserRoleManager from "@/components/settings/UserRoleManager";
import PolygonApiKeyForm from "@/components/settings/PolygonApiKeyForm";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const ApiSettings: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <LayoutContainer>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/app/settings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
        </Link>
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
        <Card className="overflow-visible shadow-sm border">
          <CardHeader>
            <CardTitle>Admin Role Management</CardTitle>
            <CardDescription>
              Assign admin role to your account to manage API settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserRoleManager adminEmail={user?.email || ""} />
          </CardContent>
        </Card>
        
        <PolygonApiKeyForm />
      </div>
    </LayoutContainer>
  );
};

export default ApiSettings;
