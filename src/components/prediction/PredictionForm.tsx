
import React from "react";
import { FormContainer, FormActions } from "./form";
import { usePredictionForm } from "./hooks/usePredictionForm";
import PredictionFormContent from "./PredictionFormContent";
import LimitReachedModal from "../subscription/LimitReachedModal";
import { useSubscription } from "@/lib/subscription/subscription-context";

interface PredictionFormProps {
  onPredictionMade: (prediction: any) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionMade }) => {
  const { 
    formState,
    updateField,
    resetForm,
    validateForm,
    canMakePrediction
  } = usePredictionForm();
  
  // Get additional state from useSubscription
  const { showLimitWarning } = useSubscription();
  
  // Local state
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPredictionLimitModal, setShowPredictionLimitModal] = React.useState(false);
  
  // Handlers
  const handleSubmit = () => {
    if (validateForm()) {
      onPredictionMade({
        targetType: formState.targetType,
        targetName: formState.targetName,
        timeframe: formState.timeframe,
        userPrediction: formState.prediction
      });
    } else {
      setShowPredictionLimitModal(true);
    }
  };
  
  return (
    <>
      <FormContainer
        title="Make a Prediction"
        description="Select a stock and predict its future price or trend direction"
        footer={
          <FormActions 
            isLoading={isLoading} 
            isDisabled={!formState.targetName || !canMakePrediction}
            onSubmit={handleSubmit}
            onOpenConfirmDialog={handleSubmit}
          />
        }
      >
        <PredictionFormContent
          error={error}
          targetName={formState.targetName}
          targetType={formState.targetType}
          timeframe={formState.timeframe}
          prediction={formState.prediction}
          updateField={updateField}
          handleSubmit={handleSubmit}
        />
      </FormContainer>
      
      {/* Usage Limit Modal */}
      <LimitReachedModal 
        open={showPredictionLimitModal} 
        onClose={() => setShowPredictionLimitModal(false)}
        limitType="predictions"
      />
    </>
  );
};

export default PredictionForm;
