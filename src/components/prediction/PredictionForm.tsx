
import React from "react";
import { FormContainer, FormActions } from "./form";
import { usePredictionForm } from "./hooks/usePredictionForm";
import PredictionFormContent from "./PredictionFormContent";
import LimitReachedModal from "../subscription/LimitReachedModal";

interface PredictionFormProps {
  onPredictionMade: (prediction: any) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionMade }) => {
  const { 
    isLoading,
    error,
    selectedStock,
    usingMockData,
    predictionType,
    timeframe,
    trendPrediction,
    pricePrediction,
    confirmDialogOpen,
    setTimeframe,
    setPredictionType,
    setTrendPrediction,
    setPricePrediction,
    setConfirmDialogOpen,
    handleSelectStock,
    handleOpenConfirmDialog,
    handleSubmit,
    isFormValid,
    // Usage limits
    showPredictionLimitModal,
    showApiLimitModal,
    closePredictionLimitModal,
    closeApiLimitModal
  } = usePredictionForm(onPredictionMade);

  return (
    <>
      <FormContainer
        title="Make a Prediction"
        description="Select a stock and predict its future price or trend direction"
        footer={
          <FormActions 
            isLoading={isLoading} 
            isDisabled={!isFormValid}
            onSubmit={handleSubmit}
            onOpenConfirmDialog={handleOpenConfirmDialog}
          />
        }
      >
        <PredictionFormContent
          error={error}
          selectedStock={selectedStock}
          usingMockData={usingMockData}
          predictionType={predictionType}
          timeframe={timeframe}
          trendPrediction={trendPrediction}
          pricePrediction={pricePrediction}
          confirmDialogOpen={confirmDialogOpen}
          setTimeframe={setTimeframe}
          setPredictionType={setPredictionType}
          setTrendPrediction={setTrendPrediction}
          setPricePrediction={setPricePrediction}
          setConfirmDialogOpen={setConfirmDialogOpen}
          handleSelectStock={handleSelectStock}
          handleSubmit={handleSubmit}
        />
      </FormContainer>
      
      {/* Usage Limit Modals */}
      <LimitReachedModal 
        open={showPredictionLimitModal} 
        onClose={closePredictionLimitModal}
        limitType="predictions"
      />
      
      <LimitReachedModal 
        open={showApiLimitModal} 
        onClose={closeApiLimitModal}
        limitType="api"
      />
    </>
  );
};

export default PredictionForm;
