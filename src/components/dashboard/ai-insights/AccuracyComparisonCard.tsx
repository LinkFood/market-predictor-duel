
import React from 'react';

interface AccuracyComparisonProps {
  averageAiAccuracy: number;
  averageUserAccuracy: number;
  isLoading: boolean;
}

const AccuracyComparisonCard: React.FC<AccuracyComparisonProps> = ({ 
  averageAiAccuracy, 
  averageUserAccuracy,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">AI vs Human Accuracy</span>
          <span className="font-medium bg-gray-200 animate-pulse h-4 w-16 rounded"></span>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                AI
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                Human
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
            <div className="animate-pulse bg-gray-300 h-2 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">AI vs Human Accuracy</span>
        <span className="font-medium">
          {(averageAiAccuracy * 100).toFixed(1)}% vs {(averageUserAccuracy * 100).toFixed(1)}%
        </span>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              AI
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
              Human
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
          <div 
            style={{ width: `${averageAiAccuracy * 100}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
          ></div>
          <div
            style={{ width: `${Math.max(0, averageUserAccuracy * 100 - averageAiAccuracy * 100)}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyComparisonCard;
