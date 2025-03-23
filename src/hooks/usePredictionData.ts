
import { useState, useEffect } from "react";
import { Prediction } from "@/types";
import { getPredictionById } from "@/lib/prediction/user-predictions";
import { adaptPrediction } from "@/lib/prediction/prediction-adapter";
import { mockPredictions } from "@/data/mockData";
import { toast } from "sonner";

export function usePredictionData(id: string | undefined) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrediction = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from API first
        if (id) {
          try {
            const fetchedPrediction = await getPredictionById(id);
            if (fetchedPrediction) {
              console.log("Fetched prediction from API:", fetchedPrediction);
              
              // Ensure ticker and predictionType are set before adapting
              const predictionWithRequiredFields = {
                ...fetchedPrediction,
                ticker: fetchedPrediction.ticker || fetchedPrediction.targetName || "",
                predictionType: fetchedPrediction.predictionType || "trend"
              };
              
              // Convert to the application's Prediction type
              const adaptedPrediction = adaptPrediction(predictionWithRequiredFields);
              console.log("Adapted prediction:", adaptedPrediction);
              setPrediction(adaptedPrediction);
              setIsLoading(false);
              return;
            }
          } catch (apiError) {
            console.error("Error fetching prediction from API:", apiError);
            // Fall back to mock data
          }
        }
        
        // Fallback to mock data
        const found = mockPredictions.find(p => p.id === id);
        if (found) {
          console.log("Using mock prediction:", found);
          // Ensure ticker is set for mock data too
          const predictionWithRequiredFields = {
            ...found,
            ticker: found.ticker || found.targetName || "",
            predictionType: found.predictionType || "trend"
          };
          setPrediction(adaptPrediction(predictionWithRequiredFields));
        } else {
          setError("Prediction not found");
          toast.error("Prediction not found");
        }
      } catch (err) {
        console.error("Error loading prediction:", err);
        setError("Failed to load prediction");
        toast.error("Failed to load prediction");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrediction();
  }, [id]);

  useEffect(() => {
    if (!prediction || prediction.status === 'complete' || prediction.status === 'completed') return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const resolveDate = new Date(prediction.resolvesAt);
      const diff = resolveDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining("Resolving...");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [prediction]);

  return { prediction, timeRemaining, isLoading, error };
}
