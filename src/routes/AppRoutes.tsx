
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import MakePrediction from "@/pages/MakePrediction";
import PredictionsHistory from "@/pages/PredictionsHistory";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import PredictionDetail from "@/pages/PredictionDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Markets from "@/pages/Markets";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
// Import new bracket pages
import Brackets from "@/pages/Brackets";
import CreateBracket from "@/pages/CreateBracket";
import BracketDetail from "@/pages/BracketDetail";
import TestDatabaseConnection from "@/pages/TestDatabaseConnection";
import { useAuth } from "@/lib/auth-context";
import LoadingScreen from "@/components/LoadingScreen";
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

// Public only route (redirects to app if logged in)
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
    // Fixed: redirect to /app instead of /dashboard
    return <Navigate to="/app" replace />;
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
    <Suspense fallback={<LoadingScreen message="Loading content..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Auth routes - redirect to app if already logged in */}
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
        <Route path="/forgot-password" element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        } />
        
        {/* Legacy route support - redirect /dashboard to /app */}
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        
        {/* App routes with new modern mobile layout */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="predict" element={<MakePrediction />} />
          <Route path="markets" element={<Markets />} />
          <Route path="predictions/history" element={<PredictionsHistory />} />
          <Route path="predictions/:id" element={<PredictionDetail />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Stock Duel bracket routes */}
          <Route path="brackets" element={<Brackets />} />
          <Route path="brackets/create" element={<CreateBracket />} />
          <Route path="brackets/:id" element={<BracketDetail />} />
          
          {/* Development & Testing routes */}
          <Route path="test-db" element={<TestDatabaseConnection />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
