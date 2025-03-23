
import React from 'react';
import { PredictionTimeframe, PredictionCategory, PredictionDirection } from '@/types';
import { TimeframeSelector } from './TimeframeSelector';
import { TrendPrediction } from './TrendPrediction';
import { SearchBar } from './SearchBar';

interface PredictionFormContentProps {
  error: string | null;
  targetName: string;
  targetType: PredictionCategory;
  timeframe: PredictionTimeframe;
  prediction: PredictionDirection;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  handleSubmit: () => void;
}

type FormState = {
  targetName: string;
  targetType: PredictionCategory;
  timeframe: PredictionTimeframe;
  prediction: PredictionDirection;
};

const PredictionFormContent: React.FC<PredictionFormContentProps> = ({
  error,
  targetName,
  targetType,
  timeframe,
  prediction,
  updateField,
  handleSubmit
}) => {
  // Handle search selection
  const handleSelectTarget = (selected: { name: string; type: PredictionCategory }) => {
    updateField('targetName', selected.name);
    updateField('targetType', selected.type);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Market, Sector or Stock</label>
        <SearchBar 
          selectedTarget={{ name: targetName, type: targetType }}
          onSelectTarget={handleSelectTarget}
        />
      </div>
      
      <TimeframeSelector 
        timeframe={timeframe}
        onChange={(value) => updateField('timeframe', value)}
      />
      
      <TrendPrediction 
        value={prediction}
        onChange={(value) => updateField('prediction', value)}
      />
    </div>
  );
};

export default PredictionFormContent;
