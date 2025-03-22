
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MarketSentimentProps {
  sentiment: {
    value: number;
    label: string;
    description: string;
  };
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  lastUpdated: Date | null;
  usingMockData: boolean;
  onRefresh: () => Promise<void>;
}

const MarketSentimentDisplay: React.FC<MarketSentimentProps> = ({
  sentiment,
  isLoading,
  isError,
  errorMessage,
  lastUpdated,
  usingMockData,
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
  
  // Get color based on sentiment value
  const getSentimentColor = () => {
    if (sentiment.value > 70) return "text-green-600 dark:text-green-400";
    if (sentiment.value > 50) return "text-green-500 dark:text-green-400";
    if (sentiment.value > 40) return "text-amber-500 dark:text-amber-400";
    if (sentiment.value > 30) return "text-orange-500 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };
  
  // Get icon based on sentiment value
  const SentimentIcon = () => {
    if (sentiment.value > 50) {
      return <ArrowUpRight className="h-5 w-5 text-green-500 mr-2" />;
    } else {
      return <ArrowDownRight className="h-5 w-5 text-red-500 mr-2" />;
    }
  };
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={usingMockData ? "outline" : "secondary"} 
            className={cn(
              "text-xs",
              usingMockData && "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
            )}
          >
            {usingMockData ? 'AI Generated' : 'Live Data'}: {getUpdatedTime()}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onRefresh()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || "Error loading market sentiment data. Please refresh to try again."}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="py-4">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <SentimentIcon />
                <h3 className="text-lg font-semibold">{sentiment.label}</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <BarChart2 className="h-12 w-12 text-muted-foreground" />
                <div className="flex-1">
                  <div className="bg-muted h-3 rounded-full w-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full", 
                        sentiment.value > 70 ? "bg-green-500" : 
                        sentiment.value > 50 ? "bg-green-400" : 
                        sentiment.value > 40 ? "bg-amber-400" : 
                        sentiment.value > 30 ? "bg-orange-400" : "bg-red-500"
                      )}
                      style={{ width: `${sentiment.value}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Bearish</span>
                    <span className={cn("text-sm font-medium", getSentimentColor())}>{sentiment.value}%</span>
                    <span className="text-xs text-muted-foreground">Bullish</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {sentiment.description}
              </p>
            </div>
          )}
        </div>
        
        {usingMockData && (
          <div className="px-4 py-3 text-xs flex items-center text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-t">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>
              Using AI-generated market sentiment data. This is for demonstration purposes only.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketSentimentDisplay;
