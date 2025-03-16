
import React from "react";
import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "./ui/sidebar-provider";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { open, setOpen } = useSidebar();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  return (
    <header className="border-b p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">StockDuel</h2>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/profile">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
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
