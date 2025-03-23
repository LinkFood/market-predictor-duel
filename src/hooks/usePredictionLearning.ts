
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { 
  analyzePredictionBatch, 
  scheduleRoutineAnalysis,
  PredictionPattern
} from '@/lib/analysis/prediction-learner';

/**
 * Hook for interacting with the AI prediction learning system
 */
export function usePredictionLearning() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(true);
  const [patterns, setPatterns] = useState<PredictionPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load learning patterns from the database
  const loadPatterns = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('prediction_patterns')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (error) {
        throw error;
      }
      
      setPatterns(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load learning patterns';
      setError(message);
      console.error('Error loading prediction patterns:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Trigger an analysis manually
  const triggerAnalysis = async () => {
    if (!user || isAnalyzing) return;
    
    try {
      setIsAnalyzing(true);
      await analyzePredictionBatch();
      setLastAnalysis(new Date());
      await loadPatterns();
      toast.success("Analysis completed successfully");
    } catch (err) {
      console.error("Error during analysis:", err);
      toast.error("Failed to complete analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle learning system
  const toggleLearningSystem = useCallback(() => {
    setIsEnabled(prev => !prev);
    toast.success(`Prediction learning system ${!isEnabled ? 'enabled' : 'disabled'}`);
  }, [isEnabled]);

  // Initialize learning system
  useEffect(() => {
    if (!user) return;
    
    // Initial load of patterns
    loadPatterns();
    
    // Set up learning system if enabled
    let cleanup: (() => void) | undefined;
    
    if (isEnabled) {
      // Schedule routine analysis (every 60 minutes)
      cleanup = scheduleRoutineAnalysis(60);
      console.log('Prediction learning system initialized and scheduled');
      setIsInitialized(true);
      setLastAnalysis(new Date());
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [user, isEnabled, loadPatterns]);

  return {
    isLearningEnabled: isEnabled,
    patterns,
    isLoading,
    error,
    toggleLearningSystem,
    refreshPatterns: loadPatterns,
    isInitialized,
    lastAnalysis,
    isAnalyzing,
    triggerAnalysis
  };
}

// Export for compatibility with existing code
export default usePredictionLearning;
