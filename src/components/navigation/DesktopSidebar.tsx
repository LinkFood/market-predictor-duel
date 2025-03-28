
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import PlanBadge from "@/components/subscription/PlanBadge";
import { NavItem } from "./MobileSidebarMenu";

interface NavSection {
  section: string;
  items: NavItem[];
}

interface DesktopSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navigationItems: NavSection[];
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ 
  collapsed, 
  onToggle,
  navigationItems
}) => {
  const location = useLocation();
  
  // Check if a route is active
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
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
            <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
        ) : (
          <PlanBadge className="w-full" />
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
