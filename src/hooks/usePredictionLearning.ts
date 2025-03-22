/**
 * Hook for managing the prediction learning system
 */
import { useEffect, useState } from 'react';
import { scheduleRoutineAnalysis } from '@/lib/analysis/prediction-learner';
import { FEATURES } from '@/lib/config';

export function usePredictionLearning() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  
  // Initialize the learning system
  useEffect(() => {
    if (!FEATURES.enableAIAnalysis) {
      console.log('AI learning system disabled due to feature flag');
      return;
    }
    
    console.log('Initializing prediction learning system');
    
    // Start the routine analysis (runs every hour by default)
    const cleanupAnalysis = scheduleRoutineAnalysis(60);
    setIsInitialized(true);
    
    // Record the initialization
    setLastAnalysis(new Date());
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up prediction learning system');
      cleanupAnalysis();
    };
  }, []);
  
  // Function to manually trigger analysis
  const triggerAnalysis = async () => {
    if (!isInitialized) {
      console.warn('Cannot trigger analysis: learning system not initialized');
      return false;
    }
    
    if (isAnalyzing) {
      console.warn('Analysis already in progress');
      return false;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Import dynamically to avoid circular dependencies
      const { analyzePredictionBatch } = await import('@/lib/analysis/prediction-learner');
      const { getUserPredictions } = await import('@/lib/prediction');
      
      // Get completed predictions
      const completedPredictions = await getUserPredictions('completed');
      
      if (completedPredictions.length === 0) {
        console.log('No completed predictions to analyze');
        return false;
      }
      
      // Run the analysis
      await analyzePredictionBatch(completedPredictions);
      
      // Update last analysis time
      setLastAnalysis(new Date());
      return true;
    } catch (error) {
      console.error('Error triggering prediction analysis:', error);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return {
    isInitialized,
    isAnalyzing,
    lastAnalysis,
    triggerAnalysis
  };
}

export default usePredictionLearning;