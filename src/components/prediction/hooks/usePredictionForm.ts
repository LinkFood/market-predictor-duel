
import { useState } from 'react';
import { PredictionTimeframe, PredictionCategory, PredictionDirection } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useSubscription } from '@/lib/subscription/subscription-context';
import { trackEvent, trackFeatureUsage } from '@/lib/analytics';

// Define prediction type for form state (string enum)
export type PredictionType = 'trend' | 'price';

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
  const { isPremium, hasFeatureAccess } = useSubscription();
  
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
    
    if (!hasFeatureAccess('predictions')) {
      toast({
        title: "Limit reached",
        description: "You've reached your prediction limit for today",
        variant: "destructive"
      });
      return false;
    }
    
    // Track the prediction attempt
    if (user) {
      trackEvent('prediction_form_submitted', {
        userId: user.id,
        targetType: formState.targetType,
        timeframe: formState.timeframe
      });
    }
    
    return true;
  };

  return {
    formState,
    updateField,
    resetForm,
    validateForm,
    canMakePrediction: hasFeatureAccess('predictions')
  };
};
