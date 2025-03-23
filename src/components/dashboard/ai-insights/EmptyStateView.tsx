
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateViewProps {
  isAnalyzing: boolean;
  isInitialized: boolean;
  onRunAnalysis: () => void;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ 
  isAnalyzing, 
  isInitialized, 
  onRunAnalysis 
}) => {
  return (
    <div className="py-4 text-center text-gray-500">
      <p className="mb-4">No prediction patterns analyzed yet</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRunAnalysis}
        disabled={isAnalyzing || !isInitialized}
      >
        {isAnalyzing ? 'Analyzing...' : 'Run Initial Analysis'}
      </Button>
    </div>
  );
};

export default EmptyStateView;
