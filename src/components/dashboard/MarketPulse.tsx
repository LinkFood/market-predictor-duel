
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketDataTable from "@/components/MarketDataTable";
import { MarketData } from "@/types";
import { FEATURES } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, Database } from "lucide-react";

interface MarketPulseProps {
  marketData: MarketData[];
  stockData: MarketData[];
}

const MarketPulse: React.FC<MarketPulseProps> = ({ marketData, stockData }) => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const usingMockData = !FEATURES.enableRealMarketData;
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            Market Pulse
            {!usingMockData && (
              <Badge 
                variant="outline" 
                className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 text-xs"
              >
                <Database className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            )}
          </CardTitle>
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
        
        {usingMockData && (
          <div className="mt-4 px-3 py-2 text-xs flex items-center text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800/30">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>Using simulated market data. <Link to="/app/settings/api" className="font-medium underline">Configure real-time data</Link></span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketPulse;
