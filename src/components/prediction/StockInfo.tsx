
import React from "react";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/lib/config";

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
  } | null;
}

const StockInfo: React.FC<StockInfoProps> = ({ stock }) => {
  if (!stock) return null;
  
  return (
    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-lg">{stock.name}</div>
          <div className="text-sm text-gray-500">{stock.symbol}</div>
        </div>
        <div className={cn(
          "text-lg font-bold",
          stock.changePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          ${stock.price.toFixed(2)}
          <div className="text-sm">
            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      
      {/* Additional stock details shown when using real market data */}
      {FEATURES.enableRealMarketData && (
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          {stock.volume && (
            <div>
              <span className="text-gray-500">Volume:</span> {stock.volume.toLocaleString()}
            </div>
          )}
          {stock.marketCap && (
            <div>
              <span className="text-gray-500">Market Cap:</span> ${(stock.marketCap / 1000000000).toFixed(2)}B
            </div>
          )}
          {stock.high52Week && stock.low52Week && (
            <div className="col-span-2 flex space-x-4">
              <div>
                <span className="text-gray-500">52W High:</span> ${stock.high52Week.toFixed(2)}
              </div>
              <div>
                <span className="text-gray-500">52W Low:</span> ${stock.low52Week.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockInfo;
