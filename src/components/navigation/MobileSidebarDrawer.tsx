
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, BarChart3 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PlanBadge from "@/components/subscription/PlanBadge";
import { NavItem } from "./MobileSidebarMenu";

interface NavSection {
  section: string;
  items: NavItem[];
}

interface MobileSidebarDrawerProps {
  navigationItems: NavSection[];
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({ 
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

export default MobileSidebarDrawer;
