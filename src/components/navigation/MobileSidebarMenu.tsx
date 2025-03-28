
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Types for navigation items
export interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface MobileSidebarMenuProps {
  items: NavItem[];
}

export const MobileSidebarMenu: React.FC<MobileSidebarMenuProps> = ({ items }) => {
  const location = useLocation();
  
  // Check if a route is active
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur-md pb-safe">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
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
};

export default MobileSidebarMenu;
