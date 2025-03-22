
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { MarketData } from "@/types";
import TrendIndicator from "./TrendIndicator";
import useMarketIndices from "@/hooks/useMarketIndices";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const TopMarkets: React.FC = () => {
  const { 
    marketIndices: markets,
    isLoading,
    isError,
    errorMessage,
    usingMockData
  } = useMarketIndices();

  // Format currency with commas and 2 decimal places
  const formatCurrency = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {errorMessage || "Failed to load market data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="title-sm">Top Markets</h3>
        <Link to="/app/markets" className="btn-ghost caption text-[hsl(var(--primary))]">
          View All <ChevronRight className="h-3 w-3 inline-block" />
        </Link>
      </div>
      
      <div className="space-y-2">
        {isLoading ? (
          // Loading skeleton
          <div className="animate-pulse space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card-subtle p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          markets.map((market, index) => (
            <Link 
              key={index} 
              to={`/app/markets`}
              className="glass-card-subtle p-4 flex items-center justify-between touch-scale"
            >
              <div>
                <p className="body-md">{market.name}</p>
                <p className={`caption ${market.change > 0 ? 'bullish' : market.change < 0 ? 'bearish' : 'neutral'}`}>
                  {market.change > 0 ? '+' : ''}{formatCurrency(market.change)} ({market.changePercent > 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <p className="numeric-md">{formatCurrency(market.value)}</p>
                <TrendIndicator direction={market.change > 0 ? 'up' : market.change < 0 ? 'down' : 'neutral'} />
              </div>
            </Link>
          ))
        )}

        {usingMockData && !isError && (
          <div className="text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-sm">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Using simulated market data</span>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default TopMarkets;
