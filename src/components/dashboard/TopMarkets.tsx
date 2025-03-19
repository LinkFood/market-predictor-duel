
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { MarketData } from "@/types";
import TrendIndicator from "./TrendIndicator";

interface TopMarketsProps {
  markets: MarketData[];
}

const TopMarkets: React.FC<TopMarketsProps> = ({ markets }) => {
  // Format currency with commas and 2 decimal places
  const formatCurrency = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <motion.section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="title-sm">Top Markets</h3>
        <Link to="/markets" className="btn-ghost caption text-[hsl(var(--primary))]">
          View All <ChevronRight className="h-3 w-3 inline-block" />
        </Link>
      </div>
      
      <div className="space-y-2">
        {markets.map((market, index) => (
          <Link 
            key={index} 
            to={`/markets/${market.name.toLowerCase().replace(/ /g, '-')}`}
            className="glass-card-subtle p-4 flex items-center justify-between touch-scale"
          >
            <div>
              <p className="body-md">{market.name}</p>
              <p className={`caption ${market.change > 0 ? 'bullish' : market.change < 0 ? 'bearish' : 'neutral'}`}>
                {market.change > 0 ? '+' : ''}{formatCurrency(market.change)} ({market.changePercent > 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <p className="numeric-md">{formatCurrency(market.value)}</p>
              <TrendIndicator direction={market.change > 0 ? 'up' : market.change < 0 ? 'down' : 'neutral'} />
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

export default TopMarkets;
