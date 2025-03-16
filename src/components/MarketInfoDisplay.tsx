
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketData } from '@/lib/market/MarketDataProvider';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const MarketInfoDisplay: React.FC = () => {
  const { gainers, losers, isLoading, lastUpdated, refreshData } = useMarketData();
  
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
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Market Movers</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Updated: {getUpdatedTime()}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => refreshData()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r">
            <h4 className="text-sm font-medium flex items-center mb-2">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              Top Gainers
            </h4>
            <ul className="space-y-2">
              {isLoading ? (
                <div className="animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 rounded my-1"></div>
                  ))}
                </div>
              ) : (
                gainers.slice(0, 3).map((stock, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{stock.symbol}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      +{stock.changePercent.toFixed(1)}%
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-medium flex items-center mb-2">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              Top Losers
            </h4>
            <ul className="space-y-2">
              {isLoading ? (
                <div className="animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 rounded my-1"></div>
                  ))}
                </div>
              ) : (
                losers.slice(0, 3).map((stock, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{stock.symbol}</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {stock.changePercent.toFixed(1)}%
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketInfoDisplay;
