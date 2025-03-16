
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  TrendingUp, 
  LineChart, 
  Trophy, 
  User, 
  ChevronLeft, 
  Search,
  Bell,
  Menu,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MobileNavBar from "./MobileNavBar";

// App Navigation Component with shared layout
const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Determine if on main dashboard or detail page
  const isMainDashboard = location.pathname === "/app" || location.pathname === "/app/";
  const isDetailPage = !isMainDashboard;
  
  // Get page title based on URL path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/app" || path === "/app/") return "";
    if (path.includes("/predict")) return "Prediction";
    if (path.includes("/predictions/history")) return "History";
    if (path.includes("/leaderboard")) return "Leaderboard";
    if (path.includes("/profile")) return "Profile";
    return "Market Predictor";
  };
  
  // Track scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Search Overlay Component
  const SearchOverlay = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[hsl(var(--background))] p-4"
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-md">Search Markets</h3>
          <button 
            onClick={() => setShowSearch(false)}
            className="btn-icon btn-ghost"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Search stocks, markets, or predictions..."
            className="w-full py-3 pl-10 pr-4 bg-[hsl(var(--surface-1))] border border-white/10 rounded-[var(--radius-md)] text-[hsl(var(--foreground))]"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="overline text-[hsl(var(--muted-foreground))]">Recent Searches</h4>
          <div className="glass-card-subtle p-3">
            <p className="body-md">No recent searches</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  // Menu Overlay Component
  const MenuOverlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowMenu(false)}
    >
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="fixed top-0 right-0 bottom-0 w-[70%] max-w-xs bg-[hsl(var(--surface-1))] border-l border-white/5 p-5"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="title-md">Menu</h3>
          <button 
            onClick={() => setShowMenu(false)}
            className="btn-icon btn-ghost"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              navigate("/app");
              setShowMenu(false);
            }}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname === "/app" ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <Home className={`h-5 w-5 mr-3 ${location.pathname === "/app" ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Home</span>
          </button>
          
          <button
            onClick={() => {
              navigate("/app/predict");
              setShowMenu(false);
            }}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/predict") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <TrendingUp className={`h-5 w-5 mr-3 ${location.pathname.includes("/predict") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Predict</span>
          </button>
          
          <button
            onClick={() => {
              navigate("/app/predictions/history");
              setShowMenu(false);
            }}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/predictions/history") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <LineChart className={`h-5 w-5 mr-3 ${location.pathname.includes("/predictions/history") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">History</span>
          </button>
          
          <button
            onClick={() => {
              navigate("/app/leaderboard");
              setShowMenu(false);
            }}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/leaderboard") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <Trophy className={`h-5 w-5 mr-3 ${location.pathname.includes("/leaderboard") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Leaderboard</span>
          </button>
          
          <button
            onClick={() => {
              navigate("/app/profile");
              setShowMenu(false);
            }}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/profile") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <User className={`h-5 w-5 mr-3 ${location.pathname.includes("/profile") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Profile</span>
          </button>
          
          <div className="pt-4">
            <button className="btn-secondary btn-md w-full">
              Settings
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      {/* Top navigation area - adapts based on page */}
      <header 
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          isMainDashboard && !scrolled 
            ? 'bg-transparent border-transparent' 
            : 'bg-[hsl(var(--surface-0))/95] backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="px-4 h-[60px] flex items-center justify-between">
          {/* Left section - Back button or Title */}
          <div className="flex items-center">
            {isDetailPage ? (
              <button 
                onClick={() => navigate(-1)}
                className="btn-icon btn-ghost mr-2"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}
            
            <h1 className={`title-md ${!isDetailPage ? 'sr-only' : ''}`}>
              {getPageTitle()}
            </h1>
            
            {isMainDashboard && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                  <LineChart className="h-5 w-5 text-white" />
                </div>
                <h2 className="title-md ml-2">Market Predictor</h2>
              </div>
            )}
          </div>
          
          {/* Right section - Action buttons */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setShowSearch(true)}
              className="btn-icon btn-ghost"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              className="btn-icon btn-ghost relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[hsl(var(--primary))]"></span>
            </button>
            
            <button 
              onClick={() => setShowMenu(true)}
              className="btn-icon btn-ghost"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
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
        {showSearch && <SearchOverlay />}
        {showMenu && <MenuOverlay />}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
