
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketData } from "@/lib/market/MarketDataProvider";
import { showErrorToast } from "@/lib/error-handling";
import useAnimations from "@/hooks/useAnimations";
import useWindowSize from "@/hooks/useWindowSize";
import useMarketIndices from "@/hooks/useMarketIndices";
import OverviewTabContent from "@/components/markets/OverviewTabContent";
import MarketTabContent from "@/components/markets/MarketTabContent";

const Markets: React.FC = () => {
  const { gainers, losers, isLoading, lastUpdated, refreshData } = useMarketData();
  const { 
    marketIndices, 
    isLoading: indicesLoading, 
    isError: indicesError, 
    errorMessage: indicesErrorMessage,
    lastUpdated: indicesLastUpdated,
    usingMockData: indicesUsingMockData,
    refreshData: refreshIndicesData
  } = useMarketIndices();
  const [selectedTab, setSelectedTab] = useState<"overview" | "stocks" | "crypto">("overview");
  const { containerVariants, itemVariants } = useAnimations();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (error) {
      showErrorToast(error, "Error refreshing market data");
    }
  };

  const handleRefreshIndices = async () => {
    try {
      await refreshIndicesData();
    } catch (error) {
      showErrorToast(error, "Error refreshing market indices");
    }
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "Never updated";
    return date.toLocaleString();
  };

  // Map market data to the format expected by the components
  const mappedGainers = gainers.map(item => ({
    name: item.symbol,
    value: item.price,
    change: item.change,
    changePercent: item.changePercent
  }));

  const mappedLosers = losers.map(item => ({
    name: item.symbol,
    value: item.price,
    change: item.change,
    changePercent: item.changePercent
  }));

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
          <OverviewTabContent 
            gainers={mappedGainers}
            losers={mappedLosers}
            marketIndices={marketIndices}
            marketIndicesLoading={indicesLoading}
            marketIndicesError={indicesError}
            marketIndicesErrorMessage={indicesErrorMessage}
            marketIndicesUsingMockData={indicesUsingMockData}
            marketIndicesLastUpdated={indicesLastUpdated}
            onRefreshIndices={handleRefreshIndices}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            itemVariants={itemVariants}
          />
        </TabsContent>
        
        <TabsContent value="stocks" className="space-y-4">
          <MarketTabContent 
            title="Popular Stocks" 
            variants={itemVariants} 
          />
        </TabsContent>
        
        <TabsContent value="crypto" className="space-y-4">
          <MarketTabContent 
            title="Cryptocurrency Market" 
            variants={itemVariants} 
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Markets;
