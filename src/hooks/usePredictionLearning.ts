
/**
 * Hook for managing the prediction learning system
 */
import { useEffect, useState } from 'react';
import { FEATURES } from '@/lib/config';
import { supabase } from '@/integrations/supabase/client';
import { Prediction } from '@/lib/prediction/types';

interface PredictionPattern {
  group_key: string;
  timeframe: string;
  target_type: string;
  prediction_type: string;
  ai_accuracy: number;
  user_accuracy: number;
  confidence_adjustment: number;
  sample_size: number;
  created_at: string;
}

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
    
    // Function to analyze predictions
    const analyzeRoutine = async () => {
      try {
        console.log('Running routine prediction analysis');
        // Get recently resolved predictions (last 24 hours)
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('status', 'completed')
          .gte('resolved_at', yesterdayDate.toISOString());
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          await analyzePredictionBatch(data);
          setLastAnalysis(new Date());
        } else {
          console.log('No recent predictions to analyze');
        }
      } catch (error) {
        console.error('Error in routine prediction analysis:', error);
      }
    };
    
    // Start the analysis
    analyzeRoutine();
    
    // Schedule routine analysis (runs every hour)
    const intervalId = setInterval(analyzeRoutine, 60 * 60 * 1000);
    setIsInitialized(true);
    setLastAnalysis(new Date());
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up prediction learning system');
      clearInterval(intervalId);
    };
  }, []);
  
  // Function to analyze a batch of predictions
  const analyzePredictionBatch = async (predictions: any[]): Promise<void> => {
    try {
      console.log(`Analyzing batch of ${predictions.length} resolved predictions`);
      
      // Only analyze completed predictions
      const completedPredictions = predictions.filter(p => 
        p.status === 'complete' || p.status === 'completed');
      
      if (completedPredictions.length === 0) {
        console.log('No completed predictions to analyze');
        return;
      }
      
      // Group predictions
      const groups: Record<string, any[]> = {};
      
      completedPredictions.forEach(prediction => {
        // Create grouping key based on conditions
        const key = `${prediction.timeframe}_${prediction.target_type}_${prediction.prediction_type}`;
        
        if (!groups[key]) {
          groups[key] = [];
        }
        
        groups[key].push(prediction);
      });
      
      // Analyze each group
      for (const [groupKey, groupPredictions] of Object.entries(groups)) {
        // Calculate accuracy
        const totalPredictions = groupPredictions.length;
        let correctAiPredictions = 0;
        let correctUserPredictions = 0;
        
        groupPredictions.forEach(prediction => {
          if (prediction.outcome === 'ai_win' || prediction.outcome === 'tie') {
            correctAiPredictions++;
          }
          
          if (prediction.outcome === 'user_win' || prediction.outcome === 'tie') {
            correctUserPredictions++;
          }
        });
        
        // Calculate accuracy scores
        const aiAccuracy = totalPredictions > 0 ? correctAiPredictions / totalPredictions : 0;
        const userAccuracy = totalPredictions > 0 ? correctUserPredictions / totalPredictions : 0;
        
        // Confidence adjustment
        const confidenceAdjustment = -((userAccuracy - aiAccuracy) * 2); 
        
        // Parse the group key
        const [timeframe, targetType, predictionType] = groupKey.split('_');
        
        // Create the pattern data
        const patternData = {
          group_key: groupKey,
          timeframe,
          target_type: targetType,
          prediction_type: predictionType,
          ai_accuracy: aiAccuracy,
          user_accuracy: userAccuracy,
          confidence_adjustment: confidenceAdjustment,
          sample_size: totalPredictions,
          created_at: new Date().toISOString(),
        };
        
        // Use raw PostgreSQL query to insert/update pattern data
        const { error } = await supabase.rpc('upsert_prediction_pattern', patternData);
        
        if (error) {
          console.error('Error storing prediction pattern:', error);
          
          // Fallback if RPC doesn't exist yet, try direct insert
          const { error: insertError } = await supabase.from('prediction_patterns').upsert(
            patternData as any,
            { onConflict: 'group_key' }
          );
          
          if (insertError) {
            console.error('Error storing prediction pattern (fallback):', insertError);
          }
        }
      }
      
      console.log('Prediction analysis complete');
    } catch (error) {
      console.error('Error analyzing predictions:', error);
    }
  };
  
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
      
      // Get completed predictions
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('status', 'completed');
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No completed predictions to analyze');
        return false;
      }
      
      // Run the analysis
      await analyzePredictionBatch(data);
      
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
