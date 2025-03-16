
import React from "react";
import { ChevronLeft, LineChart, Search, Bell, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface AppHeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  scrolled: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onOpenSearch, 
  onOpenMenu,
  scrolled 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  return (
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
            onClick={onOpenSearch}
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
            onClick={onOpenMenu}
            className="btn-icon btn-ghost"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
