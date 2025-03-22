
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Prediction } from "@/types";

// Refactored components
import {
  PredictionForm,
  AnalyzingProgress,
  PredictionResult,
  PredictionSidebar,
  ApiConnectionTest
} from "@/components/prediction";

const MakePrediction: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predictionStep, setPredictionStep] = useState<"form" | "analyzing" | "result">("form");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApiTest, setShowApiTest] = useState(false);
  
  const handlePredictionMade = (newPrediction: Prediction) => {
    try {
      console.log('Prediction made:', newPrediction);
      setPrediction(newPrediction);
      setPredictionStep("analyzing");
      setError(null);
      
      // Simulating API request time
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Prediction analyzed successfully!"
        });
      }, 3000);
    } catch (error) {
      console.error('Error handling prediction:', error);
      setError("Failed to process prediction. Please try again.");
      setPredictionStep("form");
    }
  };

  const handleAnalysisComplete = () => {
    setPredictionStep("result");
  };

  const handleNewPrediction = () => {
    setPrediction(null);
    setPredictionStep("form");
    setError(null);
  };

  const handleSavePrediction = () => {
    try {
      toast({
        title: "Prediction Saved",
        description: "Your prediction has been recorded. Good luck!"
      });
      navigate("/");
    } catch (error) {
      console.error('Error saving prediction:', error);
      setError("Failed to save prediction. Please try again.");
    }
  };
  
  // Handle rendering errors
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Make a Prediction</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowApiTest(!showApiTest)}
          >
            {showApiTest ? "Hide API Test" : "Test X.ai API"}
          </Button>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Predict market movements and compete against our AI. Win points for correct predictions 
          and climb up the leaderboard!
        </p>
      </div>

      {showApiTest && (
        <div className="mb-6">
          <ApiConnectionTest />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {predictionStep === "form" && (
            <PredictionForm onPredictionMade={handlePredictionMade} />
          )}
          
          {predictionStep === "analyzing" && (
            <AnalyzingProgress onComplete={handleAnalysisComplete} />
          )}
          
          {predictionStep === "result" && (
            <PredictionResult 
              prediction={prediction}
              onNewPrediction={handleNewPrediction}
              onSavePrediction={handleSavePrediction}
            />
          )}
        </div>

        <div>
          <PredictionSidebar />
        </div>
      </div>
    </div>
  );
};

export default MakePrediction;
