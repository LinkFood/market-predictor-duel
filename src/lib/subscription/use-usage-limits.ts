
import { useState, useEffect } from "react";
import { useSubscription } from "./subscription-context";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook to manage and check usage limits for subscription features
 */
export const useUsageLimits = () => {
  const { isPremium, hasFeatureAccess, usageData } = useSubscription();
  const { toast } = useToast();
  
  const [predictionsToday, setPredictionsToday] = useState(0);
  const [predictionsLimit, setPredictionsLimit] = useState(5); // Default limit
  const [isLoading, setIsLoading] = useState(true);
  
  // Update usage data when subscription changes
  useEffect(() => {
    if (usageData) {
      setPredictionsToday(usageData.predictions?.used || 0);
      setPredictionsLimit(usageData.predictions?.limit || 5);
      setIsLoading(false);
    }
  }, [usageData]);
  
  // Calculate if user has reached limit
  const hasReachedLimit = predictionsToday >= predictionsLimit;
  
  // Remaining predictions
  const remainingPredictions = Math.max(0, predictionsLimit - predictionsToday);
  
  // Show a warning when limits are approached
  const showLimitWarning = (limitType: string) => {
    if (limitType === 'predictions') {
      toast({
        title: "Prediction Limit Reached",
        description: isPremium 
          ? "You've reached your daily prediction limit. Please try again tomorrow." 
          : "You've reached your daily free prediction limit. Upgrade to make more predictions.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached the usage limit for this feature.",
        variant: "destructive"
      });
    }
  };
  
  // Refresh usage data
  const updateUsageCounts = async () => {
    try {
      // This would typically make an API call to get updated usage
      // Using a placeholder implementation
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setPredictionsToday(prev => prev + 1);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error updating usage counts", error);
      return false;
    }
  };
  
  return {
    predictionsToday,
    predictionsLimit,
    remainingPredictions,
    hasReachedLimit,
    isLoading,
    updateUsageCounts,
    showLimitWarning
  };
};
