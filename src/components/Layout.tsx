
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MobileNavBar from "./MobileNavBar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Determine if we're on the main dashboard to show different header styling
  const isMainDashboard = location.pathname === "/app" || location.pathname === "/app/";
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0 overflow-hidden">
        {/* iOS-style header */}
        <Header minimal={isMainDashboard} />
        
        {/* Main scrollable content with iOS-style overscroll behavior */}
        <main className="flex-1 px-4 pb-4 pt-2 md:p-6 overflow-auto overscroll-bounce">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* iOS-style bottom tab bar for mobile, desktop uses a sidebar in Header */}
      {isMobile && <MobileNavBar />}
      
      {/* iOS-style home indicator for mobile - the little line at bottom of iPhone screens */}
      {isMobile && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-[134px] h-1 bg-white/30 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default Layout;
