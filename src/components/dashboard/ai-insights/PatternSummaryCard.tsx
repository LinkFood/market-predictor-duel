
import React from 'react';
import { BarChart3, Zap } from 'lucide-react';

interface PatternSummaryProps {
  totalPatterns: number;
  sampleSize: number;
  isLoading: boolean;
}

const PatternSummaryCard: React.FC<PatternSummaryProps> = ({ 
  totalPatterns, 
  sampleSize,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm text-gray-500 mb-1 flex items-center">
          <BarChart3 className="h-3.5 w-3.5 mr-1 text-indigo-500" />
          Learning Patterns
        </div>
        <div className="text-2xl font-bold">{totalPatterns}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm text-gray-500 mb-1 flex items-center">
          <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
          Predictions Analyzed
        </div>
        <div className="text-2xl font-bold">{sampleSize}</div>
      </div>
    </div>
  );
};

export default PatternSummaryCard;
