
import React from "react";
import { cn } from "@/lib/utils";

interface StockInfoProps {
  stock: {
    name: string;
    symbol: string;
    price: number;
    changePercent: number;
  } | null;
}

const StockInfo: React.FC<StockInfoProps> = ({ stock }) => {
  if (!stock) return null;
  
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-lg">{stock.name}</div>
          <div className="text-sm text-gray-500">{stock.symbol}</div>
        </div>
        <div className={cn(
          "text-lg font-bold",
          stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
        )}>
          ${stock.price.toFixed(2)}
          <div className="text-sm">
            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
