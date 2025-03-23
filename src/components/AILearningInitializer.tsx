
/**
 * AI Learning System Initializer
 * Loads and initializes the AI learning system without rendering any UI
 */
import { useEffect } from 'react';
import { usePredictionLearning } from '@/hooks/usePredictionLearning';

const AILearningInitializer = () => {
  // Initialize the learning system
  const { isInitialized, lastAnalysis } = usePredictionLearning();
  
  useEffect(() => {
    if (isInitialized) {
      console.log('AI Learning System initialized successfully!');
    }
  }, [isInitialized]);
  
  useEffect(() => {
    if (lastAnalysis) {
      console.log(`Last prediction analysis run: ${lastAnalysis.toLocaleString()}`);
    }
  }, [lastAnalysis]);
  
  // This component doesn't render anything visible
  return null;
};

export default AILearningInitializer;
