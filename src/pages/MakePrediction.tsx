
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Server, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Prediction } from "@/lib/prediction/types";
import { FEATURES } from "@/lib/config";
import { getPredictionById } from "@/lib/prediction/user-predictions";

// Refactored components
import {
  PredictionForm,
  AnalyzingProgress,
  PredictionSidebar,
  PredictionResult,
  ApiConnectionTest,
} from "@/components/prediction";

const MakePrediction: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predictionStep, setPredictionStep] = useState<"form" | "analyzing" | "result">("form");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApiTest, setShowApiTest] = useState(false);
  
  // Effect to refresh prediction data after analysis is complete
  useEffect(() => {
    // If we have a prediction ID and we're in the analyzing stage, set up a timer to fetch the latest data
    if (prediction?.id && predictionStep === "analyzing") {
      const timer = setTimeout(async () => {
        try {
          // Fetch the latest prediction data from the server
          console.log("Fetching latest prediction data for ID:", prediction.id);
          const updatedPrediction = await getPredictionById(prediction.id);
          
          if (updatedPrediction) {
            console.log("Received updated prediction:", updatedPrediction);
            setPrediction(updatedPrediction);
            setPredictionStep("result");
            toast({
              title: "Success",
              description: "Prediction analyzed successfully!"
            });
          } else {
            console.error("Failed to fetch updated prediction");
            setError("Failed to retrieve prediction analysis. Please try again.");
          }
        } catch (error) {
          console.error('Error fetching updated prediction:', error);
          setError("Failed to retrieve prediction analysis. Please try again.");
          setPredictionStep("form");
        }
      }, 3000); // Still keep 3 seconds for animation
      
      return () => clearTimeout(timer);
    }
  }, [prediction?.id, predictionStep, toast]);
  
  const handlePredictionMade = (newPrediction: Prediction) => {
    try {
      console.log('Prediction made:', newPrediction);
      setPrediction(newPrediction);
      setPredictionStep("analyzing");
      setError(null);
      
      // The useEffect above will handle fetching the latest data and transitioning to result
    } catch (error) {
      console.error('Error handling prediction:', error);
      setError("Failed to process prediction. Please try again.");
      setPredictionStep("form");
    }
  };

  const handleAnalysisComplete = () => {
    // This is now handled by the useEffect
    console.log("Analysis animation complete");
  };

  const handleNewPrediction = () => {
    setPrediction(null);
    setPredictionStep("form");
    setError(null);
  };

  const handleSavePrediction = () => {
    try {
      // Since the prediction is already saved to the database when it's created,
      // we just need to redirect the user to the predictions history
      toast({
        title: "Prediction Saved",
        description: "Your prediction has been recorded. Good luck!"
      });
      
      // FIX: Navigate to the correct app route for predictions history
      navigate("/app/predictions/history");
      console.log("Navigating to /app/predictions/history");
    } catch (error) {
      console.error('Error navigating after prediction:', error);
      setError("Something went wrong. Please try again.");
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
          {FEATURES.devMode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowApiTest(!showApiTest)}
              className="flex items-center gap-1.5"
            >
              {showApiTest ? (
                <>Hide API Test</>
              ) : (
                <>
                  <Server className="h-3.5 w-3.5" />
                  Test X.ai API
                </>
              )}
            </Button>
          )}
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
          
          {predictionStep === "result" && prediction && (
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
