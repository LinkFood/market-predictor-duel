
import React from "react";
import { motion } from "framer-motion";
import MarketIndicesCard from "./MarketIndicesCard";
import MarketInfoDisplay from "@/components/MarketInfoDisplay";
import MarketDataTable from "@/components/MarketDataTable";
import { MarketData } from "@/types";

interface OverviewTabContentProps {
  gainers: MarketData[];
  losers: MarketData[];
  marketIndices: MarketData[];
  marketIndicesLoading?: boolean;
  marketIndicesError?: boolean;
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
  marketIndicesUsingMockData = false,
  marketIndicesLastUpdated = null,
  onRefreshIndices,
  onRefresh,
  isLoading,
  itemVariants
}) => {
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
          usingMockData={marketIndicesUsingMockData}
          lastUpdated={marketIndicesLastUpdated}
          onRefresh={onRefreshIndices}
        />
        <MarketInfoDisplay />
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
