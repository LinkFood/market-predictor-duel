
import React from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ConfirmPredictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  predictionType: 'trend' | 'price';
  stockName: string;
  predictionValue: string;
  timeframe: string;
}

const ConfirmPredictionDialog: React.FC<ConfirmPredictionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  predictionType,
  stockName,
  predictionValue,
  timeframe
}) => {
  const timeframeText = {
    '1d': 'tomorrow',
    '1w': 'next week',
    '1m': 'next month',
    '3m': 'in three months'
  }[timeframe] || 'in the future';

  const predictionText = predictionType === 'trend' 
    ? `${predictionValue === 'uptrend' ? 'rise' : 'fall'}`
    : `reach ${predictionValue}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            Confirm Your Prediction
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            You're predicting that <span className="font-medium text-foreground">{stockName}</span> will {predictionText} {timeframeText}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 rounded-md bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Once submitted, your prediction will be recorded and cannot be changed. You'll earn points if your prediction is correct!
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Prediction
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmPredictionDialog;
