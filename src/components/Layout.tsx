
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MobileTabBar from "./MobileTabBar";
import NavBar from "./NavBar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Determine page-specific layout properties
  const isMainDashboard = location.pathname === "/app" || location.pathname === "/app/";
  const isPredictionPage = location.pathname.includes("/predict");
  const showBackButton = !isMainDashboard;
  const useLargeTitle = isMainDashboard;
  
  // Handle scroll events for dynamic UI (iOS-style collapsing headers)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground relative">
      {/* iOS-style Status Bar Space (for notch/Dynamic Island) */}
      <div className="h-safe-top w-full" style={{ height: 'env(safe-area-inset-top, 0px)' }}></div>
      
      {/* iOS-style Navigation Bar */}
      <NavBar 
        showBack={showBackButton}
        largeTitle={useLargeTitle}
        transparent={isMainDashboard && !scrolled}
        rightAction={isPredictionPage ? 'more' : 'notification'}
      />
      
      {/* Main Content Area - iOS styled scrolling */}
      <main className="flex-1 px-4 pb-24 overflow-auto overscroll-bounce">
        <div className="mx-auto w-full max-w-xl">
          <Outlet />
        </div>
      </main>
      
      {/* iOS-style Tab Bar */}
      <MobileTabBar />
      
      {/* iOS-style home indicator space */}
      <div className="h-safe-bottom w-full" style={{ height: 'env(safe-area-inset-bottom, 16px)' }}></div>
      
      {/* iOS home indicator bar - visible on iPhone X and later */}
      <div className="fixed bottom-1 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-[134px] h-1 bg-white/30 rounded-full" />
      </div>
      
      {/* iOS pull-to-refresh indicator - positioned off screen initially */}
      <div className="fixed top-[-60px] left-0 right-0 flex justify-center items-center h-16 pointer-events-none" id="pull-indicator">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
      </div>
    </div>
  );
};

export default Layout;
