
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const RequireAuth: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const location = useLocation();
  
  if (!isInitialized) {
    // Auth not yet initialized, show nothing
    return null;
  }
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default RequireAuth;
