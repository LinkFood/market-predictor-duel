import React from 'react';
import { 
  ChevronLeft, 
  Bell, 
  Search, 
  BarChart3,
  EllipsisVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type NavBarProps = {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  largeTitle?: boolean;
  rightAction?: 'search' | 'notification' | 'more' | 'none';
  onRightActionClick?: () => void;
}

// iOS-style navigation bar that adapts to context
const NavBar: React.FC<NavBarProps> = ({
  title,
  showBack = false,
  transparent = false,
  largeTitle = false,
  rightAction = 'notification',
  onRightActionClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If no title is provided, determine from route
  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path === '/app' || path === '/app/') return 'StockDuel';
    if (path.includes('/predict')) return 'Make Prediction';
    if (path.includes('/predictions')) return 'History';
    if (path.includes('/leaderboard')) return 'Leaderboard';
    if (path.includes('/profile')) return 'Profile';
    
    return 'StockDuel';
  };
  
  const pageTitle = getPageTitle();
  
  // Handle iOS back button press
  const handleBack = () => {
    navigate(-1);
  };
  
  // Right action button based on context
  const RightActionButton = () => {
    switch (rightAction) {
      case 'search':
        return (
          <button 
            onClick={onRightActionClick} 
            className="w-8 h-8 flex items-center justify-center rounded-full ios-tap"
          >
            <Search className="w-[18px] h-[18px] text-primary" />
          </button>
        );
      case 'notification':
        return (
          <button 
            onClick={onRightActionClick} 
            className="w-8 h-8 flex items-center justify-center rounded-full ios-tap"
          >
            <Bell className="w-[18px] h-[18px] text-primary" />
          </button>
        );
      case 'more':
        return (
          <button 
            onClick={onRightActionClick} 
            className="w-8 h-8 flex items-center justify-center rounded-full ios-tap"
          >
            <EllipsisVertical className="w-[18px] h-[18px] text-primary" />
          </button>
        );
      default:
        return null;
    }
  };

  // Large title iOS-style header (like in Apple Music, Messages)
  if (largeTitle) {
    return (
      <header className={cn(
        "pt-4 pb-2 px-4",
        transparent ? "bg-transparent" : "ios-nav-bar"
      )}>
        <div className="flex items-center justify-between h-8">
          {showBack && (
            <button 
              onClick={handleBack}
              className="flex items-center ios-tap"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
              <span className="text-primary text-subhead">Back</span>
            </button>
          )}
          {!showBack && (
            <Link to="/app" className="flex items-center gap-1.5 ios-tap">
              <BarChart3 className="w-5 h-5 text-primary" />
            </Link>
          )}
          <RightActionButton />
        </div>
        <h1 className="text-title1 mt-2">{pageTitle}</h1>
      </header>
    );
  }

  // Standard compact iOS-style nav bar
  return (
    <header className={cn(
      "ios-nav-bar px-4 py-3",
      transparent ? "bg-transparent border-transparent" : "",
      showBack ? "justify-start" : "justify-center"
    )}>
      {showBack && (
        <button 
          onClick={handleBack}
          className="absolute left-2 w-8 h-8 flex items-center justify-center rounded-full ios-tap z-10"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
      )}
      <h1 className="ios-nav-title">
        {pageTitle}
      </h1>
      <div className="absolute right-2">
        <RightActionButton />
      </div>
    </header>
  );
};

export default NavBar;