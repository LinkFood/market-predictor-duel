
/**
 * Prediction evaluation utilities for X.ai service
 */

/**
 * Compare user prediction with AI prediction and calculate score
 */
export function evaluatePrediction(userPrediction: string, aiPrediction: string, actualResult: string): number {
  // Simple scoring system:
  // - If both user and AI are correct: 10 points
  // - If user is correct and AI is wrong: 20 points
  // - If user is wrong and AI is correct: 0 points
  // - If both are wrong: 5 points (for participation)
  
  const userCorrect = userPrediction === actualResult;
  const aiCorrect = aiPrediction === actualResult;
  
  if (userCorrect && aiCorrect) return 10;
  if (userCorrect && !aiCorrect) return 20;
  if (!userCorrect && aiCorrect) return 0;
  return 5;
}
