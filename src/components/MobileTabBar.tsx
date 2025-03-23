import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  LineChart, 
  Trophy, 
  User,
  GitFork
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tabs configuration - iOS style with minimal labels
const tabs = [
  {
    icon: Home,
    label: 'Home',
    path: '/app',
    exact: true
  },
  {
    icon: GitFork,
    label: 'Brackets',
    path: '/app/brackets',
  },
  {
    icon: TrendingUp,
    label: 'Predict',
    path: '/app/predict',
  },
  {
    icon: Trophy,
    label: 'Rankings',
    path: '/app/leaderboard',
  },
  {
    icon: User,
    label: 'Profile',
    path: '/app/profile',
  }
];

const MobileTabBar: React.FC = () => {
  const location = useLocation();
  
  // iOS-style active tab detection
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="ios-tab-bar">
      <div className="grid grid-cols-5 h-full">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className="ios-tap"
            aria-label={tab.label}
          >
            <div 
              className={cn(
                "ios-tab-item",
                isActive(tab.path, tab.exact) && "ios-tab-active"
              )}
            >
              <tab.icon 
                className={cn(
                  "w-6 h-6",
                  isActive(tab.path, tab.exact) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )} 
              />
              <span 
                className={cn(
                  "text-caption1",
                  isActive(tab.path, tab.exact) 
                    ? "text-primary font-ios-medium" 
                    : "text-muted-foreground font-ios-regular"
                )}
              >
                {tab.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileTabBar;