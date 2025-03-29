
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import {
  Settings as SettingsIcon,
  Bell,
  User,
  Shield,
  CreditCard,
  Database,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  const navigateToApiSettings = () => {
    navigate("/app/api-settings");
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const settingsNavItems = [
    {
      title: "Account",
      path: "/app/account",
      icon: <User className="mr-2 h-4 w-4" />,
      description: "Manage your account settings and preferences"
    },
    {
      title: "API Connections",
      path: "/app/api-settings",
      icon: <Box className="mr-2 h-4 w-4" />,
      description: "Configure market data and AI service connections",
      highlight: true
    },
    {
      title: "Notifications",
      path: "/app/settings/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      description: "Configure how you receive notifications"
    },
    {
      title: "Security",
      path: "/app/settings/security",
      icon: <Shield className="mr-2 h-4 w-4" />,
      description: "Manage your account security settings"
    },
    {
      title: "Billing",
      path: "/app/settings/billing",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      description: "Manage your subscription and billing details"
    },
    {
      title: "Data & Privacy",
      path: "/app/settings/data-privacy",
      icon: <Database className="mr-2 h-4 w-4" />,
      description: "Manage your data and privacy settings"
    }
  ];

  return (
    <LayoutContainer>
      <div className="mb-8">
        <h1 className="title-lg">Settings</h1>
        <p className="subtitle">Manage your account settings and preferences</p>
      </div>

      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-medium text-green-800">Need to configure API connections?</h3>
              <p className="text-sm text-green-700">Set up market data APIs and assign admin roles</p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              onClick={navigateToApiSettings}
            >
              <Box className="mr-2 h-4 w-4" />
              API Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsNavItems.map((item) => (
          <div 
            key={item.title} 
            onClick={() => handleNavigation(item.path)}
            className={`glass-card-subtle p-5 flex flex-col items-start justify-between ${
              item.highlight ? 'border-green-200 bg-green-50' : ''
            } w-full text-left cursor-pointer`}
          >
            <div>
              <div className="flex items-center mb-3">
                {item.icon}
                <h3 className="title-sm">{item.title}</h3>
              </div>
              <p className="subtitle">{item.description}</p>
            </div>
            <SettingsIcon className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}
      </div>
    </LayoutContainer>
  );
};

export default Settings;
