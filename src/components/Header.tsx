
import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  // This would be connected to real auth when implemented
  const isLoggedIn = true;
  
  return (
    <header className="border-b p-4 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">StockDuel</h2>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/profile">
                <div className="h-8 w-8 rounded-full bg-market-blue flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
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
