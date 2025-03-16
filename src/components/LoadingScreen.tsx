
import React from "react";
import { TrendingUp } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading application..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center gap-2 text-indigo-600">
        <TrendingUp className="h-8 w-8" />
        <span className="font-bold text-2xl">StockDuel</span>
      </div>
      <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingScreen;
