
import React from "react";
import { motion } from "framer-motion";
import MarketIndicesCard from "./MarketIndicesCard";
import MarketSentimentDisplay from "./MarketSentimentDisplay";
import MarketDataTable from "@/components/MarketDataTable";
import { MarketData } from "@/types";
import { useMarketSentiment } from "@/hooks/useMarketSentiment";

interface OverviewTabContentProps {
  gainers: MarketData[];
  losers: MarketData[];
  marketIndices: MarketData[];
  marketIndicesLoading?: boolean;
  marketIndicesError?: boolean;
  marketIndicesErrorMessage?: string | null;
  marketIndicesUsingMockData?: boolean;
  marketIndicesLastUpdated?: Date | null;
  onRefreshIndices?: () => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  itemVariants: any;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  gainers,
  losers,
  marketIndices,
  marketIndicesLoading = false,
  marketIndicesError = false,
  marketIndicesErrorMessage = null,
  marketIndicesUsingMockData = false,
  marketIndicesLastUpdated = null,
  onRefreshIndices,
  onRefresh,
  isLoading,
  itemVariants
}) => {
  // Use the sentiment hook (passing gainers and losers to calculate sentiment)
  const { 
    sentiment, 
    isLoading: sentimentLoading, 
    isError: sentimentError,
    errorMessage: sentimentErrorMessage,
    lastUpdated: sentimentLastUpdated,
    usingMockData: sentimentUsingMockData,
    refreshData: refreshSentiment
  } = useMarketSentiment(gainers, losers);

  return (
    <>
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <MarketIndicesCard 
          marketIndices={marketIndices} 
          isLoading={marketIndicesLoading}
          isError={marketIndicesError}
          errorMessage={marketIndicesErrorMessage}
          usingMockData={marketIndicesUsingMockData}
          lastUpdated={marketIndicesLastUpdated}
          onRefresh={onRefreshIndices}
        />
        <MarketSentimentDisplay 
          sentiment={sentiment}
          isLoading={sentimentLoading}
          isError={sentimentError}
          errorMessage={sentimentErrorMessage}
          lastUpdated={sentimentLastUpdated}
          usingMockData={sentimentUsingMockData}
          onRefresh={refreshSentiment}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <MarketDataTable 
          data={gainers} 
          title="Top Gainers"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <MarketDataTable 
          data={losers} 
          title="Top Losers"
        />
      </motion.div>
    </>
  );
};

export default OverviewTabContent;
