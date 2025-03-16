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

const tabItems = [
  { 
    label: "Home", 
    icon: Home, 
    path: "/app",
    exact: true
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
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-secondary/80 backdrop-blur-xl border-t border-border/40 z-20">
      <div className="grid grid-cols-5 h-full">
        {tabItems.map(item => (
          <Link 
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center"
          >
            <div 
              className={cn(
                "tab-item relative",
                isActive(item.path, item.exact) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {isActive(item.path, item.exact) && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              <item.icon className={cn(
                "w-[22px] h-[22px]",
                isActive(item.path, item.exact) && "text-primary"
              )} />
              <span className="text-[10px]">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavBar;