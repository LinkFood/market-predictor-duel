
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

const Layout: React.FC = () => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated on protected routes
  useEffect(() => {
    if (isInitialized && !user) {
      // This is a fallback in case the route protection fails
      const currentPath = window.location.pathname;
      const isProtectedRoute = 
        currentPath.startsWith('/dashboard') || 
        currentPath.startsWith('/predict') || 
        currentPath.startsWith('/predictions') || 
        currentPath.startsWith('/profile') ||
        currentPath.startsWith('/leaderboard');
      
      if (isProtectedRoute) {
        console.log('Unauthenticated user on protected route, redirecting');
        navigate('/login', { replace: true });
      }
    }
  }, [user, isInitialized, navigate]);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 pt-0">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;
