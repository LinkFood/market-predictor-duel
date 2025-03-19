
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
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  itemVariants: any;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  gainers,
  losers,
  marketIndices,
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
        <MarketIndicesCard marketIndices={marketIndices} />
        <MarketInfoDisplay />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <MarketDataTable 
          data={gainers} 
          title="Top Gainers"
          onRefresh={onRefresh}
          isLoading={isLoading}
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
