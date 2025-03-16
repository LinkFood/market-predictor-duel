
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MarketData } from "@/types";
import { Prediction } from "@/types";

interface MarketDataCardProps {
  prediction: Prediction;
  marketData: MarketData[];
}

export const MarketDataCard: React.FC<MarketDataCardProps> = ({ 
  prediction, 
  marketData 
}) => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Current Market Data</CardTitle>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 divide-y">
          {marketData.slice(0, 3).map((stock, index) => (
            <div key={index} className={cn(
              "py-3 first:pt-0 last:pb-0",
              stock.name === prediction.targetName ? "bg-indigo-50/50 dark:bg-indigo-950/20 px-3 -mx-3 rounded-md" : ""
            )}>
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {stock.name}
                  {stock.name === prediction.targetName && (
                    <Badge variant="outline" className="ml-2 text-xs font-normal bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800">
                      Target
                    </Badge>
                  )}
                </div>
                <div className="font-mono font-medium">${stock.value.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-muted-foreground">Today</div>
                <div className={cn(
                  "text-xs font-medium",
                  stock.changePercent >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                )}>
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
