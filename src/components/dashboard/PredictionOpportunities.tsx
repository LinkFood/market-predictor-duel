
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import TrendIndicator from "./TrendIndicator";
import MarketBadge from "./MarketBadge";

interface OpportunityProps {
  name: string;
  symbol: string;
  type: string;
  confidence: number;
  trend: 'up' | 'down' | 'neutral';
  reason: string;
  aiSentiment: string;
  icon: React.ReactNode;
}

interface PredictionOpportunitiesProps {
  opportunities: OpportunityProps[];
}

const PredictionOpportunities: React.FC<PredictionOpportunitiesProps> = ({ opportunities }) => {
  return (
    <motion.section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="title-sm">Prediction Opportunities</h3>
        <button className="btn-ghost caption text-[hsl(var(--muted-foreground))]">
          Filter <ChevronDown className="h-3 w-3 inline-block" />
        </button>
      </div>
      
      <div className="space-y-3">
        {opportunities.map((opportunity, index) => (
          <Link
            key={index}
            to={`/app/predict?symbol=${opportunity.symbol}`}
            className="glass-card p-4 flex flex-col touch-scale"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="title-sm">{opportunity.symbol}</p>
                  <MarketBadge type={opportunity.type} />
                </div>
                <p className="caption text-[hsl(var(--muted-foreground))]">{opportunity.name}</p>
              </div>
              <TrendIndicator direction={opportunity.trend} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="caption text-[hsl(var(--muted-foreground))]">Confidence</p>
                <div className="flex items-center gap-1.5">
                  <div className="progress-bar flex-1 w-auto">
                    <div 
                      className={`progress-bar-fill ${
                        opportunity.trend === 'up' 
                          ? 'gradient-green' 
                          : opportunity.trend === 'down' 
                            ? 'gradient-red' 
                            : 'gradient-orange'
                      }`}
                      style={{ width: `${opportunity.confidence}%` }}
                    ></div>
                  </div>
                  <span className="caption font-medium">{opportunity.confidence}%</span>
                </div>
              </div>
              <div>
                <p className="caption text-[hsl(var(--muted-foreground))]">AI Sentiment</p>
                <p className={`caption font-medium ${
                  opportunity.aiSentiment.includes('Bullish') 
                    ? 'text-[hsl(var(--success))]' 
                    : opportunity.aiSentiment.includes('Bearish') 
                      ? 'text-[hsl(var(--error))]' 
                      : 'text-[hsl(var(--warning))]'
                }`}>
                  {opportunity.aiSentiment}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                {opportunity.icon}
                <p className="caption">{opportunity.reason}</p>
              </div>
              <div className="text-[hsl(var(--primary))] flex items-center">
                <span className="caption font-medium">Predict</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

export default PredictionOpportunities;
