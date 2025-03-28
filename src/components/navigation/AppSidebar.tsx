
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  TrendingUp, 
  BarChart3, 
  Trophy, 
  User,
  GitFork,
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PlanBadge from "@/components/subscription/PlanBadge";
import { useIsMobile } from "@/hooks/use-mobile";

// Navigation sections and items
const navigationItems = [
  {
    section: "Core",
    items: [
      {
        name: "Dashboard",
        path: "/app",
        icon: Home,
        exact: true
      },
      {
        name: "Make Prediction",
        path: "/app/predict",
        icon: TrendingUp
      },
      {
        name: "Markets",
        path: "/app/markets",
        icon: BarChart3
      }
    ]
  },
  {
    section: "Tournaments",
    items: [
      {
        name: "Brackets",
        path: "/app/brackets",
        icon: GitFork
      },
      {
        name: "Leaderboard",
        path: "/app/leaderboard",
        icon: Trophy
      }
    ]
  },
  {
    section: "Your Account",
    items: [
      {
        name: "Profile",
        path: "/app/profile",
        icon: User
      },
      {
        name: "Settings",
        path: "/app/settings",
        icon: Settings
      }
    ]
  }
];

// Bottom navigation items (simplified for mobile)
const mobileNavItems = [
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
    name: "Brackets",
    path: "/app/brackets",
    icon: GitFork
  },
  {
    name: "Markets",
    path: "/app/markets",
    icon: BarChart3
  },
  {
    name: "Profile",
    path: "/app/profile",
    icon: User
  }
];

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  collapsed = false, 
  onToggle 
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Check if a route is active
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Mobile bottom navigation
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur-md pb-safe">
        <div className="grid grid-cols-5 h-16">
          {mobileNavItems.map((item) => {
            const active = isActive(item.path, item.exact);
            
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
                
                <div className="flex flex-col items-center justify-center space-y-1">
                  <item.icon className={cn(
                    "w-5 h-5",
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
  }
  
  // Desktop sidebar
  return (
    <aside 
      className={cn(
        "h-screen border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Header with logo and toggle */}
      <div className="flex h-16 items-center px-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-[hsl(var(--primary))]" />
          {!collapsed && <span className="font-semibold text-lg">StockDuel</span>}
        </div>
        
        <button 
          onClick={onToggle}
          className={cn(
            "ml-auto rounded-md p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
            collapsed && "mx-auto"
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      {/* Navigation sections */}
      <div className="px-3 py-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem-4rem)]">
        {navigationItems.map((section) => (
          <div key={section.section} className="space-y-2">
            {!collapsed && (
              <h3 className="text-xs font-medium text-[hsl(var(--muted-foreground))] px-2 mb-2">
                {section.section}
              </h3>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path, item.exact);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      collapsed ? "justify-center" : "justify-start",
                      active 
                        ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]" 
                        : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer with subscription info */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 border-t border-[hsl(var(--border))]",
        collapsed && "p-2"
      )}>
        {collapsed ? (
          <div className="flex justify-center">
            <User className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
        ) : (
          <PlanBadge className="w-full" />
        )}
      </div>
    </aside>
  );
};

// Mobile sidebar drawer component
export const MobileSidebar: React.FC = () => {
  const location = useLocation();
  
  // Check if a route is active
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 text-[hsl(var(--foreground))]">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center px-4 border-b border-[hsl(var(--border))]">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-[hsl(var(--primary))]" />
              <span className="font-semibold text-lg">StockDuel</span>
            </div>
          </div>
          
          <div className="px-3 py-4 space-y-6 overflow-y-auto flex-1">
            {navigationItems.map((section) => (
              <div key={section.section} className="space-y-2">
                <h3 className="text-xs font-medium text-[hsl(var(--muted-foreground))] px-2 mb-2">
                  {section.section}
                </h3>
                
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = isActive(item.path, item.exact);
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active 
                            ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]" 
                            : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[hsl(var(--border))]">
            <PlanBadge className="w-full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;
