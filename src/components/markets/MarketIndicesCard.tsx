
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketData } from "@/types";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MarketIndicesCardProps {
  marketIndices: MarketData[];
  isLoading?: boolean;
  isError?: boolean;
  usingMockData?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => Promise<void>;
}

const MarketIndicesCard: React.FC<MarketIndicesCardProps> = ({ 
  marketIndices,
  isLoading = false,
  isError = false,
  usingMockData = false,
  lastUpdated = null,
  onRefresh
}) => {
  // Format the last updated time
  const getUpdatedTime = () => {
    if (!lastUpdated) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diff < 60) {
      return `${diff} seconds ago`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else {
      return lastUpdated.toLocaleTimeString();
    }
  };

  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">Market Indices</CardTitle>
        
        {onRefresh && (
          <div className="flex items-center gap-2">
            {usingMockData && (
              <Badge 
                variant="outline" 
                className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                Simulated Data
              </Badge>
            )}
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated: {getUpdatedTime()}
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Unable to fetch market indices data. Showing fallback data.
          </div>
        )}
        
        <div className="divide-y">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <div className="text-right">
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))
          ) : (
            // Market indices data
            marketIndices.map((index, i) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{index.name}</p>
                  <p className={`text-sm ${index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">{index.value.toLocaleString()}</p>
                  <p className={`text-sm ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {usingMockData && (
          <div className="px-4 py-3 text-xs flex items-center text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-t">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>Using simulated market indices data.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketIndicesCard;
