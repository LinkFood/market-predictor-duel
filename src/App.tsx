
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { isSupabaseConfigured, getSupabaseConfigError } from "./lib/supabase";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MakePrediction from "./pages/MakePrediction";
import PredictionDetail from "./pages/PredictionDetail";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Dev mode flag
const USE_DEV_MODE = true;

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  // In dev mode, allow access without authentication checks
  if (USE_DEV_MODE) {
    return <>{children}</>;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-indigo-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Skip Supabase configuration check in dev mode
  if (!USE_DEV_MODE) {
    // Check if Supabase is configured
    const configError = getSupabaseConfigError();

    if (configError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="mb-4">{configError}</p>
          <div className="p-4 bg-gray-100 rounded-md text-left max-w-lg">
            <p className="font-semibold mb-2">Debug Information:</p>
            <p>Supabase URL: {window.SUPABASE_CONFIG?.url || 'Not set'}</p>
            <p>Supabase key: {window.SUPABASE_CONFIG?.key ? `${window.SUPABASE_CONFIG.key.substring(0, 5)}...` : 'Not set'}</p>
          </div>
        </div>
      );
    }
  } else {
    console.log('🧪 Development mode: Bypassing Supabase configuration check');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/app" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="predict" element={<MakePrediction />} />
                  <Route path="predictions/:id" element={<PredictionDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
