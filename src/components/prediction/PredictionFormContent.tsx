
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionType } from "./hooks/usePredictionForm";

// Components
import SearchBar from "./SearchBar";
import StockInfo from "./StockInfo";
import TrendPrediction from "./TrendPrediction";
import PricePrediction from "./PricePrediction";
import { FormHeader, DataSourceIndicator } from "./form";
import ConfirmPredictionDialog from "./ConfirmPredictionDialog";

interface PredictionFormContentProps {
  error: string | null;
  selectedStock: any | null;
  usingMockData: boolean;
  predictionType: PredictionType;
  timeframe: string;
  trendPrediction: 'uptrend' | 'downtrend' | null;
  pricePrediction: string;
  confirmDialogOpen: boolean;
  setTimeframe: (value: string) => void;
  setPredictionType: (value: PredictionType) => void;
  setTrendPrediction: (value: 'uptrend' | 'downtrend' | null) => void;
  setPricePrediction: (value: string) => void;
  setConfirmDialogOpen: (value: boolean) => void;
  handleSelectStock: (stock: any) => void;
  handleSubmit: () => void;
}

const PredictionFormContent: React.FC<PredictionFormContentProps> = ({
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
  handleSubmit
}) => {
  return (
    <>
      <FormHeader error={error} />
      
      {/* Stock Search */}
      <SearchBar onSelectStock={handleSelectStock} />
      
      {/* Data Source Indicator */}
      <DataSourceIndicator />
      
      {/* Selected Stock Info */}
      {selectedStock && <StockInfo stock={selectedStock} isRealData={!usingMockData} />}
      
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
};

export default PredictionFormContent;
