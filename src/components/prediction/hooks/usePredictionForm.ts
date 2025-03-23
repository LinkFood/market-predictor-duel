
import { useState } from 'react';
import { PredictionTimeframe, PredictionCategory, PredictionDirection } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import { trackEvent } from '@/lib/analytics';
import { useUsageLimits } from '@/lib/subscription/use-usage-limits';

// Define the form state interface
export interface PredictionFormState {
  targetType: PredictionCategory;
  targetName: string;
  timeframe: PredictionTimeframe;
  prediction: PredictionDirection;
  isSubmitting: boolean;
}

// Default form state
const defaultFormState: PredictionFormState = {
  targetType: 'market',
  targetName: '',
  timeframe: '1d',
  prediction: 'bullish',
  isSubmitting: false
};

export const usePredictionForm = () => {
  const [formState, setFormState] = useState<PredictionFormState>(defaultFormState);
  const { toast } = useToast();
  const { user } = useAuth();
  const { canMakePrediction, showLimitWarning } = useUsageLimits();
  
  // Update a single field in the form
  const updateField = <K extends keyof PredictionFormState>(
    field: K, 
    value: PredictionFormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  // Reset form to default state
  const resetForm = () => {
    setFormState(defaultFormState);
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    if (!formState.targetName) {
      toast({
        title: "Missing information",
        description: "Please select a market, sector, or stock",
        variant: "destructive"
      });
      return false;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a prediction",
        variant: "destructive"
      });
      return false;
    }
    
    if (!canMakePrediction) {
      showLimitWarning('predictions');
      return false;
    }
    
    return true;
  };

  return {
    formState,
    updateField,
    resetForm,
    validateForm,
    canMakePrediction
  };
};
