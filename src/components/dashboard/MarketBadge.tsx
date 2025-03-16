
import React from "react";

interface MarketBadgeProps {
  type: string;
}

const MarketBadge: React.FC<MarketBadgeProps> = ({ type }) => (
  <span className="px-2 py-0.5 bg-[hsl(var(--surface-2))] rounded-full caption">
    {type}
  </span>
);

export default MarketBadge;
