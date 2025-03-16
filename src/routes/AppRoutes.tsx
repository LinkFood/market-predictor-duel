
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import MakePrediction from "@/pages/MakePrediction";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PredictionDetail from "@/pages/PredictionDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import { useAuth } from "@/lib/auth-context";
import LoadingScreen from "@/components/LoadingScreen";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense, useEffect } from "react";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && !user) {
      console.log("Protected route accessed without authentication");
    }
  }, [isInitialized, user]);

  if (!isInitialized) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect to login but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public only route (redirects to dashboard if logged in)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useAuth();
  
  useEffect(() => {
    if (isInitialized && user) {
      console.log("Public-only route accessed while authenticated");
    }
  }, [isInitialized, user]);
  
  if (!isInitialized) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isInitialized, user } = useAuth();
  const location = useLocation();

  // Log routing information for debugging
  useEffect(() => {
    console.log("Route changed:", location.pathname);
    console.log("Auth state:", { isInitialized, isLoggedIn: !!user });
  }, [location, isInitialized, user]);

  if (!isInitialized) {
    return <LoadingScreen message="Initializing authentication..." />;
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingScreen message="Loading content..." />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            
            {/* Protected routes */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="predict" element={
              <ProtectedRoute>
                <MakePrediction />
              </ProtectedRoute>
            } />
            <Route path="predictions/:id" element={
              <ProtectedRoute>
                <PredictionDetail />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Auth routes - redirect to dashboard if already logged in */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />
        </Routes>
      </Suspense>
    </SidebarProvider>
  );
};

export default AppRoutes;
