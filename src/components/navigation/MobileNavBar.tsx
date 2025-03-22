
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Trophy, 
  User, 
  Activity 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/app",
    icon: Home,
    exact: true
  },
  {
    name: "Predict",
    path: "/app/predict",
    icon: TrendingUp
  },
  {
    name: "Markets",
    path: "/app/markets",
    icon: BarChart3
  },
  {
    name: "Leaderboard",
    path: "/app/leaderboard",
    icon: Trophy
  },
  {
    name: "Profile",
    path: "/app/profile",
    icon: User
  }
];

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (item: NavItem) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(var(--surface-0))]/80 border-t border-white/5 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item);
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="relative flex flex-col items-center justify-center"
            >
              <div className="absolute -top-3 w-full flex justify-center">
                {active && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="h-1 w-10 bg-[hsl(var(--primary))] rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-1 touch-opacity">
                <item.icon className={cn(
                  "w-[22px] h-[22px]",
                  active 
                    ? "text-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--muted-foreground))]"
                )} />
                
                <span className={cn(
                  "text-[10px]",
                  active 
                    ? "text-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--muted-foreground))]"
                )}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
