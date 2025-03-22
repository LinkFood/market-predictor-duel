
import { useState, useEffect } from 'react';
import { useSubscription } from './subscription-context';
import { getTodayUsageStats } from './usage-tracking';
import { supabase } from '@/integrations/supabase/client';

export function useUsageLimits() {
  const { plan, getFeatureLimit, isFeatureAvailable } = useSubscription();
  const [predictionsToday, setPredictionsToday] = useState(0);
  const [predictionsLimit, setPredictionsLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate remaining predictions
  const remainingPredictions = Math.max(0, predictionsLimit - predictionsToday);
  
  // Check if user has reached their limit
  const hasReachedLimit = predictionsToday >= predictionsLimit;

  // Get the user's daily prediction limit based on their plan
  useEffect(() => {
    setPredictionsLimit(getFeatureLimit('maxDailyPredictions'));
  }, [plan, getFeatureLimit]);

  // Fetch the user's usage for today
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPredictionsToday(0);
          return;
        }
        
        const stats = await getTodayUsageStats(user.id);
        setPredictionsToday(stats.prediction_created);
      } catch (error) {
        console.error('Error fetching usage:', error);
        setPredictionsToday(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);

  // Function to update usage after a new prediction is made
  const updateUsageCounts = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }
      
      const stats = await getTodayUsageStats(user.id);
      setPredictionsToday(stats.prediction_created);
    } catch (error) {
      console.error('Error updating usage counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    predictionsToday,
    predictionsLimit,
    remainingPredictions,
    hasReachedLimit,
    isLoading,
    updateUsageCounts
  };
}
