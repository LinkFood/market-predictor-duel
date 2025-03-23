
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./lib/auth-context";
import { MarketDataProvider } from "./lib/market/MarketDataProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import LoadingScreen from "./components/LoadingScreen";
import AILearningInitializer from "./components/AILearningInitializer";
import { SubscriptionProvider } from "./lib/subscription/subscription-context";
import { useState, useEffect } from "react";
import { useSupabaseCheck } from "./hooks/use-supabase-check";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Simple app initialization to show loading screen
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("App initialization started");
        
        // Check if important configurations are available
        if (!window.SUPABASE_CONFIG?.url || !window.SUPABASE_CONFIG?.key) {
          console.warn("Supabase configuration is missing or incomplete");
          // Continue anyway in dev mode
        }
        
        // Simulate initial loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log("App initialization completed");
        setIsLoading(false);
      } catch (error) {
        console.error("App initialization error:", error);
        setInitError((error as Error).message || "Failed to initialize application");
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Initializing application..." />;
  }

  if (initError) {
    return <LoadingScreen error={initError} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <MarketDataProvider>
              <AILearningInitializer />
              <AppErrorBoundary>
                <AppRoutes />
              </AppErrorBoundary>
              <Toaster />
            </MarketDataProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
