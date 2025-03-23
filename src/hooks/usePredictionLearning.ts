
import { useState, useEffect } from "react";
import { analyzePredictionBatch, scheduleRoutineAnalysis } from "@/lib/analysis/prediction-learner";
import { getUserPredictions } from "@/lib/prediction/user-predictions";
import { Prediction } from "@/types";

interface PredictionLearningState {
  isInitialized: boolean;
  isAnalyzing: boolean;
  lastAnalysis: Date | null;
  error: string | null;
}

export function usePredictionLearning() {
  const [state, setState] = useState<PredictionLearningState>({
    isInitialized: false,
    isAnalyzing: false,
    lastAnalysis: null,
    error: null
  });

  useEffect(() => {
    // Initialize the learning system
    let cleanupFn: (() => void) | undefined;
    
    const initLearningSystem = async () => {
      try {
        // Schedule routine analysis
        cleanupFn = scheduleRoutineAnalysis(60); // Run every 60 minutes
        
        // Perform initial analysis with recent predictions
        await runInitialAnalysis();
        
        // Mark as initialized
        setState(prev => ({
          ...prev,
          isInitialized: true
        }));
        
      } catch (error) {
        console.error("Failed to initialize prediction learning system:", error);
        setState(prev => ({
          ...prev,
          error: "Failed to initialize learning system"
        }));
      }
    };
    
    initLearningSystem();
    
    // Cleanup function
    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);
  
  const runInitialAnalysis = async () => {
    try {
      setState(prev => ({ ...prev, isAnalyzing: true }));
      
      // Fetch completed predictions to analyze
      const completedPredictions = await getUserPredictions('completed');
      
      if (completedPredictions && completedPredictions.length > 0) {
        // Analyze the batch of predictions
        await analyzePredictionBatch(completedPredictions);
        
        // Update state
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          lastAnalysis: new Date()
        }));
      } else {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          lastAnalysis: new Date()
        }));
      }
    } catch (error) {
      console.error("Error running initial prediction analysis:", error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: "Failed to analyze predictions"
      }));
    }
  };
  
  return {
    ...state,
    runAnalysis: runInitialAnalysis
  };
}

export default usePredictionLearning;
