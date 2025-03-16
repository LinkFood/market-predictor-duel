
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./lib/auth-context";
import { MarketDataProvider } from "./lib/market/MarketDataProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import LoadingScreen from "./components/LoadingScreen";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Simple app initialization to show loading screen
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if important configurations are available
        if (!window.SUPABASE_CONFIG?.url || !window.SUPABASE_CONFIG?.key) {
          console.warn("Supabase configuration is missing or incomplete");
        }
        
        // Simulate initial loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
      <AuthProvider>
        <MarketDataProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </MarketDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
