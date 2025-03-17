
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataCard from "@/components/DataCard";
import MarketInfoDisplay from "@/components/MarketInfoDisplay";
import { BarChart3, TrendingUp, ChevronDown } from "lucide-react";
import { useMarketData } from "@/lib/market/MarketDataProvider";
import { MarketData } from "@/types";
import MarketDataTable from "@/components/MarketDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAnimations from "@/hooks/useAnimations";
import { showErrorToast } from "@/lib/error-handling";
import useWindowSize from "@/hooks/useWindowSize";

const Markets: React.FC = () => {
  const { gainers, losers, isLoading, lastUpdated, refreshData } = useMarketData();
  const [selectedTab, setSelectedTab] = useState<"overview" | "stocks" | "crypto">("overview");
  const [marketIndices, setMarketIndices] = useState<MarketData[]>([]);
  const { containerVariants, itemVariants } = useAnimations();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    // Create mock market indices data
    const mockIndices = [
      { 
        name: "S&P 500", 
        value: 5234.32, 
        change: 12.45, 
        changePercent: 0.24,
      },
      { 
        name: "Dow Jones", 
        value: 38721.78, 
        change: -82.12, 
        changePercent: -0.21,
      },
      { 
        name: "NASDAQ", 
        value: 16432.67, 
        change: 87.34, 
        changePercent: 0.53,
      },
      { 
        name: "Russell 2000", 
        value: 2146.89, 
        change: -5.23, 
        changePercent: -0.24,
      }
    ];
    
    setMarketIndices(mockIndices);
  }, []);

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (error) {
      showErrorToast(error, "Error refreshing market data");
    }
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "Never updated";
    return date.toLocaleString();
  };

  return (
    <motion.div
      className="container p-4 space-y-6 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold">Markets</h1>
        <p className="text-muted-foreground">
          Market data and analysis
          {lastUpdated && (
            <span className="text-xs ml-2">
              Updated: {formatDateTime(lastUpdated)}
            </span>
          )}
        </p>
      </motion.div>

      <Tabs 
        defaultValue="overview" 
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as any)}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="shadow-sm border-0 overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
                <CardTitle className="text-lg font-semibold">Market Indices</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {marketIndices.map((index, i) => (
                    <div key={i} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{index.name}</p>
                        <p className={`text-sm ${index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">{index.value.toLocaleString()}</p>
                        <p className={`text-sm ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <MarketInfoDisplay />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Top Gainers</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            <MarketDataTable 
              data={gainers.map(item => ({
                name: item.symbol,
                value: item.price,
                change: item.change,
                changePercent: item.changePercent
              }))} 
              title="Top Gainers"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4">Top Losers</h2>
            <MarketDataTable 
              data={losers.map(item => ({
                name: item.symbol,
                value: item.price,
                change: item.change,
                changePercent: item.changePercent
              }))} 
              title="Top Losers"
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="stocks" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle>Popular Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Stock market data coming soon...</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="crypto" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle>Cryptocurrency Market</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Crypto market data coming soon...</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Markets;
