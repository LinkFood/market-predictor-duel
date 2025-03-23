
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App error caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 border border-border">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">App Error</h1>
            <p className="text-muted-foreground text-center mb-6">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            
            {/* Error details (only in development) */}
            {import.meta.env.DEV && (
              <div className="bg-muted rounded-md p-3 mb-6 overflow-auto max-h-[200px] text-xs font-mono">
                {this.state.error?.stack?.split('\n').map((line, i) => (
                  <div key={i} className="mb-1">{line}</div>
                ))}
                
                {this.state.errorInfo && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="font-semibold mb-2">Component Stack:</div>
                    {this.state.errorInfo.componentStack.split('\n').map((line, i) => (
                      <div key={i} className="mb-1">{line}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                onClick={this.handleReload} 
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload App
              </Button>
              <Button 
                onClick={this.handleGoHome} 
                variant="outline" 
                className="flex-1 gap-2"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
