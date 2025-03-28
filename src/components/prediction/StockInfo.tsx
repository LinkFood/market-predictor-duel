
import React from "react";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/lib/config";
import { AlertCircle } from "lucide-react";

interface StockInfoProps {
  stock: {
    name: string;
    symbol: string;
    price: number;
    changePercent: number;
    marketCap?: number;
    volume?: number;
    high52Week?: number;
    low52Week?: number;
    usingMockData?: boolean;
  } | null;
  isRealData?: boolean;
}

const StockInfo: React.FC<StockInfoProps> = ({ 
  stock, 
  isRealData = stock?.usingMockData !== undefined ? !stock.usingMockData : FEATURES.enableRealMarketData 
}) => {
  if (!stock) return null;
  
  // Safely format price with fallback
  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "N/A";
    return price.toFixed(2);
  };
  
  // Safely format percentage with fallback
  const formatPercent = (percent: number | undefined) => {
    if (percent === undefined || percent === null) return "N/A";
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };
  
  return (
    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-lg">{stock.name}</div>
          <div className="text-sm text-gray-500">{stock.symbol}</div>
        </div>
        <div className={cn(
          "text-lg font-bold",
          (stock.changePercent || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          ${formatPrice(stock.price)}
          <div className="text-sm">
            {formatPercent(stock.changePercent)}
          </div>
        </div>
      </div>
      
      {/* Additional stock details shown when using real market data */}
      {isRealData && (
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          {stock.volume !== undefined && (
            <div>
              <span className="text-gray-500">Volume:</span> {stock.volume.toLocaleString()}
            </div>
          )}
          {stock.marketCap !== undefined && (
            <div>
              <span className="text-gray-500">Market Cap:</span> ${(stock.marketCap / 1000000000).toFixed(2)}B
            </div>
          )}
          {stock.high52Week !== undefined && stock.low52Week !== undefined && (
            <div className="col-span-2 flex space-x-4">
              <div>
                <span className="text-gray-500">52W High:</span> ${formatPrice(stock.high52Week)}
              </div>
              <div>
                <span className="text-gray-500">52W Low:</span> ${formatPrice(stock.low52Week)}
              </div>
            </div>
          )}
        </div>
      )}

      {!isRealData && (
        <div className="mt-3 flex items-center text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 p-2 rounded">
          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
          Using simulated stock data. Actual prices may vary.
        </div>
      )}
    </div>
  );
};

export default StockInfo;
