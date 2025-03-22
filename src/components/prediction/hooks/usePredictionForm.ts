
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/lib/prediction";
import { getStockData } from "@/lib/market";
import { Prediction } from "@/lib/prediction/types";

// Types
export type PredictionType = 'trend' | 'price';

export const usePredictionForm = (onPredictionMade: (prediction: Prediction) => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [predictionType, setPredictionType] = useState<PredictionType>('trend');
  const [timeframe, setTimeframe] = useState('1d');
  const [trendPrediction, setTrendPrediction] = useState<'uptrend' | 'downtrend' | null>(null);
  const [pricePrediction, setPricePrediction] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle stock selection
  const handleSelectStock = async (stock: any) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Selected stock:', stock);
      const stockDetails = await getStockData(stock.symbol);
      console.log('Retrieved stock details:', stockDetails);
      
      // Extract the data property and store usingMockData separately
      setSelectedStock(stockDetails.data);
      setUsingMockData(stockDetails.usingMockData);
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setError("Failed to load stock details. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stock details. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening confirmation dialog
  const handleOpenConfirmDialog = () => {
    // Validate the form before opening the dialog
    if (!selectedStock) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a stock"
      });
      return;
    }

    if (predictionType === 'trend' && !trendPrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a trend direction"
      });
      return;
    }

    if (predictionType === 'price' && !pricePrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a price prediction"
      });
      return;
    }

    setConfirmDialogOpen(true);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedStock) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a stock"
      });
      return;
    }

    if (predictionType === 'trend' && !trendPrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a trend direction"
      });
      return;
    }

    if (predictionType === 'price' && !pricePrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a price prediction"
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const predictionRequest = {
        ticker: selectedStock.symbol,
        predictionType,
        userPrediction: predictionType === 'trend' ? trendPrediction! : pricePrediction,
        timeframe
      };
      
      console.log('Submitting prediction:', predictionRequest);
      
      try {
        const newPrediction = await createPrediction(predictionRequest);
        console.log('Prediction created successfully:', newPrediction);
        
        if (!newPrediction || !newPrediction.id) {
          throw new Error('Invalid prediction response');
        }
        
        toast({
          title: "Prediction Submitted",
          description: `Your prediction for ${selectedStock.name} has been submitted successfully.`
        });
        
        // Reset form
        setSelectedStock(null);
        setTrendPrediction(null);
        setPricePrediction('');
        
        // Notify parent
        onPredictionMade(newPrediction);
      } catch (error: any) {
        console.error('Error in createPrediction:', error);
        throw new Error(`Prediction creation failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error creating prediction:', error);
      setError(`Failed to submit your prediction: ${error.message || 'Please try again.'}`);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to submit your prediction: ${error.message || 'Please try again.'}`
      });
    } finally {
      setIsLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  // Determine if form is valid for submission
  const isFormValid = Boolean(selectedStock && 
    ((predictionType === 'trend' && trendPrediction) || 
     (predictionType === 'price' && pricePrediction)));

  return {
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
    isFormValid
  };
};
