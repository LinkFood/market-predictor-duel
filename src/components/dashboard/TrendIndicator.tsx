
import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'neutral';
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction }) => {
  const Icon = direction === 'up' 
    ? ArrowUpRight 
    : direction === 'down' 
      ? ArrowDownRight 
      : Minus;
  
  return (
    <div className={`rounded-full w-7 h-7 flex items-center justify-center ${
      direction === 'up' 
        ? 'bg-[hsl(var(--success-muted))]' 
        : direction === 'down' 
          ? 'bg-[hsl(var(--error-muted))]' 
          : 'bg-[hsl(var(--warning-muted))]'
    }`}>
      <Icon className={`w-4 h-4 ${
        direction === 'up' 
          ? 'text-[hsl(var(--success))]' 
          : direction === 'down' 
            ? 'text-[hsl(var(--error))]' 
            : 'text-[hsl(var(--warning))]'
      }`} />
    </div>
  );
};

export default TrendIndicator;
