
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  LineChart, 
  Trophy, 
  User, 
  Home 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar as SidebarContainer, SidebarContent } from "@/components/ui/sidebar";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: Home, 
    path: "/" 
  },
  { 
    label: "Make Prediction", 
    icon: TrendingUp, 
    path: "/predict" 
  },
  { 
    label: "My Predictions", 
    icon: LineChart, 
    path: "/predictions/history" 
  },
  { 
    label: "Leaderboard", 
    icon: Trophy, 
    path: "/leaderboard" 
  },
  { 
    label: "My Profile", 
    icon: User, 
    path: "/profile" 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-market-blue" />
            <h1 className="text-xl font-bold text-market-blue">Market Oracle</h1>
          </div>
        </div>
        <SidebarContent>
          <nav className="space-y-1 p-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-market-blue text-white"
                    : "hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
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
