
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  LineChart, 
  Trophy, 
  User,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabItems = [
  { 
    label: "Home", 
    icon: Home, 
    path: "/app"
  },
  { 
    label: "Predict", 
    icon: TrendingUp, 
    path: "/app/predict" 
  },
  { 
    label: "History", 
    icon: LineChart, 
    path: "/app/predictions/history" 
  },
  { 
    label: "Leaders", 
    icon: Trophy, 
    path: "/app/leaderboard" 
  },
  { 
    label: "Profile", 
    icon: User, 
    path: "/app/profile" 
  },
];

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app" || location.pathname === "/app/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[hsl(var(--surface-0))]/80 backdrop-blur-xl border-t border-white/5 z-20">
      <div className="grid grid-cols-5 h-full">
        {tabItems.map(item => (
          <button 
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center touch-opacity"
          >
            <div 
              className={cn(
                "tab-item relative flex flex-col items-center",
                isActive(item.path) 
                  ? "text-[hsl(var(--primary))]" 
                  : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              {isActive(item.path) && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
              )}
              <item.icon className={cn(
                "w-[22px] h-[22px] mb-1",
                isActive(item.path) && "text-[hsl(var(--primary))]"
              )} />
              <span className="text-[10px]">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavBar;
