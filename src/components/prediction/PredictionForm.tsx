
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/lib/prediction";
import { getStockData } from "@/lib/market";

// Components
import SearchBar from "./SearchBar";
import StockInfo from "./StockInfo";
import TrendPrediction from "./TrendPrediction";
import PricePrediction from "./PricePrediction";
import { FormContainer, FormActions, FormHeader, DataSourceIndicator } from "./form";
import ConfirmPredictionDialog from "./ConfirmPredictionDialog";

// Types
type PredictionType = 'trend' | 'price';

interface PredictionFormProps {
  onPredictionMade: (prediction: any) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionMade }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
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
      setSelectedStock(stockDetails);
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
      const newPrediction = await createPrediction(predictionRequest);
      console.log('Prediction created:', newPrediction);
      
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
    } catch (error) {
      console.error('Error creating prediction:', error);
      setError("Failed to submit your prediction. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your prediction. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if form is valid for submission
  const isFormValid = !(!selectedStock || 
    (predictionType === 'trend' && !trendPrediction) || 
    (predictionType === 'price' && !pricePrediction));

  // Create form content
  const renderFormContent = () => (
    <>
      <FormHeader error={error} />
      
      {/* Stock Search */}
      <SearchBar onSelectStock={handleSelectStock} />
      
      {/* Data Source Indicator */}
      <DataSourceIndicator />
      
      {/* Selected Stock Info */}
      {selectedStock && <StockInfo stock={selectedStock} />}
      
      {/* Prediction Type Tabs */}
      {selectedStock && (
        <Tabs defaultValue="trend" onValueChange={(value) => setPredictionType(value as PredictionType)} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="trend">Trend Prediction</TabsTrigger>
            <TabsTrigger value="price">Price Prediction</TabsTrigger>
          </TabsList>
          
          {/* Trend Prediction */}
          <TabsContent value="trend" className="space-y-4">
            <TrendPrediction 
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              trendPrediction={trendPrediction}
              setTrendPrediction={setTrendPrediction}
            />
          </TabsContent>
          
          {/* Price Prediction */}
          <TabsContent value="price" className="space-y-4">
            <PricePrediction 
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              pricePrediction={pricePrediction}
              setPricePrediction={setPricePrediction}
              currentPrice={selectedStock?.price}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmPredictionDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleSubmit}
        predictionType={predictionType}
        stockName={selectedStock?.name || ''}
        predictionValue={predictionType === 'trend' ? trendPrediction || '' : pricePrediction}
        timeframe={timeframe}
      />
    </>
  );

  return (
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
      {renderFormContent()}
    </FormContainer>
  );
};

export default PredictionForm;
