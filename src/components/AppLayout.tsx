
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useAnimations from "@/hooks/useAnimations";
import MobileNavBar from "./navigation/MobileNavBar";
import SearchOverlay from "./SearchOverlay";
import MenuOverlay from "./MenuOverlay";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";

// App Navigation Component with shared layout
const AppLayout: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pageTransitionVariants } = useAnimations();
  
  // Track scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[hsl(var(--background))]">
      {/* Sidebar for desktop - hidden on mobile */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Mobile and content container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navigation area */}
        <AppHeader 
          onOpenSearch={() => setShowSearch(true)}
          onOpenMenu={() => setShowMenu(true)}
          scrolled={scrolled}
        />
        
        {/* Main content area with page transitions */}
        <motion.main 
          className="flex-1 pb-24"
          variants={pageTransitionVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Outlet />
        </motion.main>
        
        {/* Bottom Tab Bar - only visible on mobile */}
        <div className="lg:hidden">
          <MobileNavBar />
        </div>
        
        {/* Home indicator at bottom of screen - only on mobile */}
        <div className="fixed bottom-1 left-0 right-0 flex justify-center pointer-events-none z-50 lg:hidden">
          <div className="w-[134px] h-1 bg-white/30 rounded-full"></div>
        </div>
        
        {/* Overlays with AnimatePresence for smooth transitions */}
        <AnimatePresence>
          {showSearch && <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />}
          {showMenu && <MenuOverlay isOpen={showMenu} onClose={() => setShowMenu(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLayout;
