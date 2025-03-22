
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketData } from '@/lib/market/MarketDataProvider';
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FEATURES } from '@/lib/config';

export const MarketInfoDisplay: React.FC = () => {
  const { 
    gainers, 
    losers, 
    isLoading, 
    isError,
    errorMessage,
    lastUpdated, 
    refreshData,
    usingMockData 
  } = useMarketData();
  
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
  
  // Format price to always show 2 decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  // Determine if API key is likely missing
  const apiKeyMissing = isError && (errorMessage?.includes('API key') || 
                                     errorMessage?.includes('api key') || 
                                     usingMockData && FEATURES.enableRealMarketData);
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Market Movers</CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={usingMockData ? "outline" : "secondary"} 
            className={cn(
              "text-xs",
              usingMockData && "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
            )}
          >
            {usingMockData ? 'Simulated Data' : 'Live Data'}: {getUpdatedTime()}
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
        {apiKeyMissing && (
          <Alert variant="destructive" className="mb-0 rounded-none">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Configuration Error</AlertTitle>
            <AlertDescription>
              Polygon API key is missing or invalid. Please check your Supabase secrets configuration.
            </AlertDescription>
          </Alert>
        )}
        {isError && !apiKeyMissing && (
          <Alert variant="destructive" className="mb-0 rounded-none">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || "Error loading market data. Please refresh to try again."}
            </AlertDescription>
          </Alert>
        )}
        
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
              ) : gainers.length > 0 ? (
                gainers.slice(0, 3).map((stock, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{stock.symbol}</span>
                    <span className="flex items-center font-medium text-green-600 dark:text-green-400">
                      ${formatPrice(stock.price)}
                      <span className="ml-2">
                        +{Math.abs(stock.changePercent).toFixed(1)}%
                      </span>
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No data available</li>
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
              ) : losers.length > 0 ? (
                losers.slice(0, 3).map((stock, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{stock.symbol}</span>
                    <span className="flex items-center font-medium text-red-600 dark:text-red-400">
                      ${formatPrice(stock.price)}
                      <span className="ml-2">
                        {stock.changePercent.toFixed(1)}%
                      </span>
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No data available</li>
              )}
            </ul>
          </div>
        </div>

        {usingMockData && (
          <div className="px-4 py-3 text-xs flex items-center text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-t">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>
              Using simulated market data. 
              {FEATURES.enableRealMarketData ? (
                <strong className="ml-1">Please check API configuration to enable real-time data.</strong>
              ) : (
                <span className="ml-1">Real-time data is disabled in configuration.</span>
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketInfoDisplay;
