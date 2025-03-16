
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
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

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
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-indigo-600">StockDuel</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <Link to={item.path}>
                <SidebarMenuButton 
                  isActive={location.pathname === item.path}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
