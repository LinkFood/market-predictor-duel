
import React from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { FEATURES } from "@/lib/config";

interface FormActionsProps {
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  onOpenConfirmDialog: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isLoading, 
  isDisabled, 
  onSubmit,
  onOpenConfirmDialog
}) => {
  return (
    <>
      <Button 
        onClick={onOpenConfirmDialog} 
        disabled={isLoading || isDisabled} 
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Prediction"
        )}
      </Button>
      <div className="flex items-center text-xs text-muted-foreground gap-1">
        <Info className="h-3 w-3" />
        <span>{FEATURES.enableAIAnalysis ? "The AI will analyze your prediction and provide feedback" : "Your prediction will be recorded"}</span>
      </div>
    </>
  );
};

export default FormActions;
