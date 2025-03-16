
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MobileNavBar from "./MobileNavBar";
import SearchOverlay from "./SearchOverlay";
import MenuOverlay from "./MenuOverlay";
import AppHeader from "./AppHeader";

// App Navigation Component with shared layout
const AppLayout: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      {/* Top navigation area */}
      <AppHeader 
        onOpenSearch={() => setShowSearch(true)}
        onOpenMenu={() => setShowMenu(true)}
        scrolled={scrolled}
      />
      
      {/* Main content area */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      
      {/* Bottom Tab Bar */}
      <MobileNavBar />
      
      {/* Home indicator at bottom of screen */}
      <div className="fixed bottom-1 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-[134px] h-1 bg-white/30 rounded-full"></div>
      </div>
      
      {/* Overlays with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {showSearch && <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />}
        {showMenu && <MenuOverlay isOpen={showMenu} onClose={() => setShowMenu(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
