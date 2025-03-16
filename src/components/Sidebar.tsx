
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  LineChart, 
  Trophy, 
  User, 
  Home,
  Cpu,
  Webhook
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar as SidebarContainer, SidebarContent } from "@/components/ui/sidebar";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: Home, 
    path: "/app" 
  },
  { 
    label: "Make Prediction", 
    icon: TrendingUp, 
    path: "/app/predict" 
  },
  { 
    label: "My Predictions", 
    icon: LineChart, 
    path: "/app/predictions/history" 
  },
  { 
    label: "Leaderboard", 
    icon: Trophy, 
    path: "/app/leaderboard" 
  },
  { 
    label: "My Profile", 
    icon: User, 
    path: "/app/profile" 
  },
  { 
    label: "API Tests", 
    icon: Webhook, 
    path: "/app/test-api" 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
        <div className="p-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-market-green" />
            <h1 className="text-lg font-bold text-white">StockDuel</h1>
          </div>
        </div>
        <SidebarContent className="pt-2">
          <nav className="space-y-0.5 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-market-green shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4",
                  location.pathname === item.path
                    ? "text-market-green"
                    : ""
                )} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SidebarContent>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
