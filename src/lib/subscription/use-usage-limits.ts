import { useState, useEffect } from 'react';
import { useSubscription } from './subscription-context';

interface UsageLimit {
  showPredictionLimitModal: boolean;
  showApiLimitModal: boolean;
  canMakePrediction: boolean;
  canMakeApiCall: boolean;
  closePredictionLimitModal: () => void;
  closeApiLimitModal: () => void;
  trackPrediction: () => void;
  trackApiCall: () => void;
}

/**
 * Hook for managing usage limits and triggering limit reached modals
 */
export function useUsageLimits(): UsageLimit {
  const { usage, updateUsage, hasPremium } = useSubscription();
  const [showPredictionLimitModal, setShowPredictionLimitModal] = useState(false);
  const [showApiLimitModal, setShowApiLimitModal] = useState(false);

  // Check if user has reached their prediction limit
  const canMakePrediction = hasPremium || usage.predictionsThisMonth < usage.predictionsLimit;
  
  // Check if user has reached their API call limit
  const canMakeApiCall = hasPremium || usage.apiCallsToday < usage.apiCallsLimit;

  // Track a new prediction
  const trackPrediction = () => {
    // Update the prediction count
    updateUsage({
      ...usage,
      predictionsThisMonth: usage.predictionsThisMonth + 1
    });

    // Show modal if limit is reached exactly
    if (usage.predictionsThisMonth + 1 >= usage.predictionsLimit && !hasPremium) {
      setShowPredictionLimitModal(true);
    }
  };

  // Track a new API call
  const trackApiCall = () => {
    // Update the API call count
    updateUsage({
      ...usage,
      apiCallsToday: usage.apiCallsToday + 1
    });

    // Show modal if limit is reached exactly
    if (usage.apiCallsToday + 1 >= usage.apiCallsLimit && !hasPremium) {
      setShowApiLimitModal(true);
    }
  };

  // Close modals
  const closePredictionLimitModal = () => setShowPredictionLimitModal(false);
  const closeApiLimitModal = () => setShowApiLimitModal(false);

  return {
    showPredictionLimitModal,
    showApiLimitModal,
    canMakePrediction,
    canMakeApiCall,
    closePredictionLimitModal,
    closeApiLimitModal,
    trackPrediction,
    trackApiCall
  };
}

export default useUsageLimits;