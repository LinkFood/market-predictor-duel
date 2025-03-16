
import React, { useState } from "react";
import { Bell, Search, ChevronLeft, Wallet, BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DesktopMenu from "./DesktopMenu";

interface HeaderProps {
  minimal?: boolean;
}

const Header: React.FC<HeaderProps> = ({ minimal = false }) => {
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/app" || path === "/app/") return "";
    if (path.includes("/predict")) return "Make Prediction";
    if (path.includes("/predictions")) return "Prediction History";
    if (path.includes("/leaderboard")) return "Leaderboard";
    if (path.includes("/profile")) return "Profile";
    if (path.includes("/test-api")) return "API Testing";
    return "StockDuel";
  };
  
  const canGoBack = location.pathname !== "/app" && location.pathname !== "/app/";
  const pageTitle = getPageTitle();
  
  // For minimal mode used on home dashboard
  if (minimal && isMobile) {
    return (
      <header className="nav-bar pt-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">StockDuel</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>
          <Link to="/app/profile">
            <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-secondary">
              <Wallet className="h-[18px] w-[18px] text-primary" />
            </Button>
          </Link>
        </div>
      </header>
    );
  }
  
  // Standard iOS-style navigation header
  if (isMobile) {
    return (
      <header className={cn(
        "nav-bar flex items-center z-20",
        canGoBack ? "justify-start" : "justify-center"
      )}>
        {canGoBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full mr-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold flex-1 text-center">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
          >
            <Bell className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </header>
    );
  }
  
  // Desktop header with left-side menu similar to Mac apps
  return (
    <header className="nav-bar">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">StockDuel</h1>
          </div>
          
          {/* Desktop links */}
          <DesktopMenu />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search markets..."
              className="block w-full pl-10 pr-3 py-1.5 text-sm bg-secondary/50 border-0 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
          >
            <Bell className="h-[18px] w-[18px]" />
          </Button>
          
          <Link to="/app/profile">
            <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full">
              <Wallet className="h-[18px] w-[18px] text-primary" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
