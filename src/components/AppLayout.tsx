import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useAnimations from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Trophy, 
  User,
  Menu
} from "lucide-react";
import { Link } from "react-router-dom";
import PlanBadge from "./subscription/PlanBadge";

// Unified navigation items
const navItems = [
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

// Main App Layout Component with responsive design
const AppLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pageTransitionVariants } = useAnimations();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Track scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if a route is active
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))]">
      {/* Header - Mobile and Desktop */}
      <header 
        className={cn(
          "sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 transition-colors duration-200 backdrop-blur-xl",
          scrolled 
            ? "bg-[hsl(var(--background))]/90 border-b border-[hsl(var(--border))]" 
            : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h1 className="text-lg font-bold">StockDuel</h1>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item.path, item.exact)
                  ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-[hsl(var(--muted))]/50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-[hsl(var(--background))]/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[hsl(var(--muted))]/50"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive(item.path, item.exact)
                        ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto">
                <div className="p-4 bg-[hsl(var(--primary))]/10 rounded-lg border border-[hsl(var(--primary))]/20">
                  <h3 className="text-sm font-medium mb-2">Your Subscription</h3>
                  <PlanBadge className="w-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content area with page transitions */}
      <motion.main 
        className="flex-1 container max-w-screen-xl mx-auto p-4 pb-24 md:pb-8"
        variants={pageTransitionVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Outlet />
      </motion.main>
      
      {/* Bottom navigation - Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-[hsl(var(--background))]/90 border-t border-[hsl(var(--border))] pb-safe">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
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
      
      {/* Home indicator at bottom of screen - Mobile only */}
      <div className="fixed bottom-1 left-0 right-0 flex justify-center pointer-events-none z-50 md:hidden">
        <div className="w-[134px] h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default AppLayout;