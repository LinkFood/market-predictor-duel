
import React from "react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import UserRoleManager from "@/components/settings/UserRoleManager";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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

      <div className="grid gap-6">
        <Card>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Polygon.io API Configuration</CardTitle>
            <CardDescription>
              Connect to Polygon.io for real-time and historical market data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To configure the Polygon.io API, first assign yourself an admin role using the 
              User Role Manager above.
            </p>
          </CardContent>
        </Card>
      </div>
    </LayoutContainer>
  );
};

export default ApiSettings;
