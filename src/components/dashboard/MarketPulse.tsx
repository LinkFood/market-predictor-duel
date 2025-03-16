
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketDataTable from "@/components/MarketDataTable";
import { MarketData } from "@/types";

interface MarketPulseProps {
  marketData: MarketData[];
  stockData: MarketData[];
}

const MarketPulse: React.FC<MarketPulseProps> = ({ marketData, stockData }) => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Market Pulse</CardTitle>
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-fit">
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs h-7 px-2">Today</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs h-7 px-2">Week</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-7 px-2">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          <MarketDataTable data={marketData} title="Major Indices" />
          <MarketDataTable data={stockData.slice(0, 5)} title="Popular Stocks" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPulse;
