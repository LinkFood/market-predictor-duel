
import React from 'react';

interface AdjustmentInsightProps {
  largestAdjustment: number;
  mostAnalyzedPattern: string;
  isLoading: boolean;
}

const AdjustmentInsightCard: React.FC<AdjustmentInsightProps> = ({ 
  largestAdjustment, 
  mostAnalyzedPattern,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="pt-2">
        <div className="text-sm font-medium">Most Significant Adjustment</div>
        <div className="text-sm text-gray-600 mt-1 h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="text-sm font-medium">Most Significant Adjustment</div>
      <div className="text-sm text-gray-600 mt-1">
        Confidence {largestAdjustment > 0 ? 'increased' : 'decreased'} by up to{' '}
        <span className={largestAdjustment > 0 ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(largestAdjustment).toFixed(1)}%
        </span>{' '}
        for {mostAnalyzedPattern} predictions
      </div>
    </div>
  );
};

export default AdjustmentInsightCard;
