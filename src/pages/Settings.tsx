import React from "react";
import { Link } from "react-router-dom";
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

const Settings: React.FC = () => {
  const settingsNavItems = [
    {
      title: "Account",
      href: "/app/settings/account",
      icon: <User className="mr-2 h-4 w-4" />,
      description: "Manage your account settings and preferences"
    },
    {
      title: "API Connections",
      href: "/app/settings/api",
      icon: <Box className="mr-2 h-4 w-4" />,
      description: "Configure market data and AI service connections"
    },
    {
      title: "Notifications",
      href: "/app/settings/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      description: "Configure how you receive notifications"
    },
    {
      title: "Security",
      href: "/app/settings/security",
      icon: <Shield className="mr-2 h-4 w-4" />,
      description: "Manage your account security settings"
    },
    {
      title: "Billing",
      href: "/app/settings/billing",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      description: "Manage your subscription and billing details"
    },
    {
      title: "Data & Privacy",
      href: "/app/settings/data-privacy",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsNavItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="glass-card-subtle p-5 flex flex-col items-start justify-between touch-scale"
          >
            <div>
              <div className="flex items-center mb-3">
                {item.icon}
                <h3 className="title-sm">{item.title}</h3>
              </div>
              <p className="subtitle">{item.description}</p>
            </div>
            <SettingsIcon className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>
        ))}
      </div>
    </LayoutContainer>
  );
};

export default Settings;
