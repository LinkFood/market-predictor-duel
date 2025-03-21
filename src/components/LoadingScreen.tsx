
import React from "react";
import { TrendingUp } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  error?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading application...",
  error
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--background))] px-4">
      <div className="mb-6 flex items-center gap-2 text-[hsl(var(--primary))]">
        <TrendingUp className="h-8 w-8" />
        <span className="font-bold text-2xl">StockDuel</span>
      </div>
      
      {!error ? (
        <>
          <div className="h-8 w-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[hsl(var(--foreground))] text-center">{message}</p>
          <div className="mt-8 w-full max-w-md">
            <div className="h-2 bg-[hsl(var(--surface-1))] rounded overflow-hidden">
              <div className="h-full bg-[hsl(var(--primary))] animate-pulse rounded"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[hsl(var(--error-muted))] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[hsl(var(--error))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">Loading Error</h2>
          <p className="text-[hsl(var(--error))] text-center mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:bg-[hsl(var(--primary-highlight))] transition-colors"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
};

export default LoadingScreen;
