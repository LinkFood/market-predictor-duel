
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AppSidebar, { MobileSidebar } from "@/components/navigation/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>StockDuel - Dashboard</title>
        <meta name="theme-color" content="#111827" />
      </Helmet>
      
      <div className="flex h-screen w-full overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        {/* Desktop sidebar */}
        {!isMobile && (
          <AppSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        )}
        
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          {isMobile && (
            <header className="flex h-16 items-center border-b border-[hsl(var(--border))] px-4">
              <MobileSidebar />
              <div className="flex items-center gap-2 mx-auto">
                <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
                <h1 className="text-lg font-semibold">StockDuel</h1>
              </div>
            </header>
          )}
          
          {/* Main content with proper padding based on device */}
          <main className={cn(
            "flex-1 overflow-auto",
            isMobile ? "pb-24" : "p-6"
          )}>
            <div className={cn(
              "mx-auto w-full h-full",
              isMobile ? "px-4" : "max-w-7xl"
            )}>
              <Outlet />
            </div>
          </main>
          
          {/* Mobile bottom navigation */}
          {isMobile && <AppSidebar />}
        </div>
      </div>
    </>
  );
};

export default AppLayout;
