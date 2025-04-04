
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
import PlanBadge from "./subscription/PlanBadge";

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
      <div className="flex flex-col h-full bg-[#111] text-white" style={{height: '100vh', position: 'sticky', top: 0}}>
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
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
          
          <div className="mt-auto pt-4 px-3">
            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30 mb-2">
              <h3 className="text-sm font-medium mb-2 text-green-300">SUBSCRIPTION STATUS</h3>
              <PlanBadge className="w-full" />
            </div>
          </div>
        </SidebarContent>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
