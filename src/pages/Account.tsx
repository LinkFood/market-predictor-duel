
import React from "react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const Account: React.FC = () => {
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
          <h1 className="title-lg">Account Settings</h1>
          <p className="subtitle">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="font-medium">User ID</p>
                <p className="text-sm text-muted-foreground break-all">{user?.id}</p>
              </div>
              <div>
                <p className="font-medium">Account Created</p>
                <p className="text-muted-foreground">
                  {new Date(user?.created_at || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutContainer>
  );
};

export default Account;
