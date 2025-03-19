
import React from "react";
import { Info, ExternalLink } from "lucide-react";
import { FEATURES } from "@/lib/config";

const DataSourceIndicator: React.FC = () => {
  return (
    <div className="flex items-center text-xs text-muted-foreground gap-1 mt-2">
      <Info className="h-3 w-3" />
      <span>
        {FEATURES.enableRealMarketData 
          ? "Using real-time market data from Polygon.io" 
          : "Using simulated market data"}
      </span>
      {FEATURES.enableRealMarketData && (
        <a 
          href="https://polygon.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-indigo-500 hover:underline ml-1"
        >
          <ExternalLink className="h-3 w-3 mr-0.5" />
          Polygon.io
        </a>
      )}
    </div>
  );
};

export default DataSourceIndicator;
