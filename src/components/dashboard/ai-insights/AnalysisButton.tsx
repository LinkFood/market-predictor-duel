
import React from 'react';
import { Button } from '@/components/ui/button';

interface AnalysisButtonProps {
  isAnalyzing: boolean;
  isInitialized: boolean;
  onRunAnalysis: () => void;
  lastAnalysis: Date | null;
  className?: string;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({ 
  isAnalyzing, 
  isInitialized, 
  onRunAnalysis,
  lastAnalysis,
  className
}) => {
  return (
    <div className={className}>
      {lastAnalysis && (
        <div className="text-xs text-gray-500 pt-2 pb-2">
          Last analyzed: {lastAnalysis.toLocaleString()}
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRunAnalysis}
        disabled={isAnalyzing || !isInitialized}
        className="w-full"
      >
        {isAnalyzing ? 'Analyzing...' : lastAnalysis ? 'Run Analysis Now' : 'Run Initial Analysis'}
      </Button>
    </div>
  );
};

export default AnalysisButton;
