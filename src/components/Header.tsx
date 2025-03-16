
import React from "react";
import { Bell, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  // This would be connected to real auth when implemented
  const isLoggedIn = true;
  
  return (
    <header className="border-b py-2.5 px-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 hidden md:block">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search markets..."
              className="block w-full pl-10 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-market-blue focus:border-market-blue"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
              <Link to="/app/profile">
                <div className="h-8 w-8 rounded-full bg-market-blue flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity">
                  <User className="h-4 w-4" />
                </div>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
