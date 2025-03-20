
import React from "react";
import { Info, ExternalLink, AlertCircle } from "lucide-react";
import { FEATURES } from "@/lib/config";

interface DataSourceIndicatorProps {
  isRealData?: boolean;
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ isRealData = FEATURES.enableRealMarketData }) => {
  return (
    <div className={`flex items-center text-xs gap-1 mt-2 p-1 rounded ${
      isRealData ? 
        "text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" : 
        "text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
    }`}>
      {isRealData ? (
        <>
          <Info className="h-3 w-3" />
          <span>
            Using real-time market data from Polygon.io
          </span>
          <a 
            href="https://polygon.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-indigo-500 hover:underline ml-1"
          >
            <ExternalLink className="h-3 w-3 mr-0.5" />
            Polygon.io
          </a>
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3" />
          <span>
            Using simulated market data. Actual prices may vary.
          </span>
        </>
      )}
    </div>
  );
};

export default DataSourceIndicator;
