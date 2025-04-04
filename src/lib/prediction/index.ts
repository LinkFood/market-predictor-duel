
/**
 * Prediction Service
 * Re-exports all prediction functionality
 */

// Export all types
export * from './types';

// Export adapter functions
export { adaptPrediction, isPredictionResolved, adaptToApiPrediction, adaptToLibPrediction } from './prediction-adapter';

// Export all functions
export { createPrediction } from './create-prediction';
export { getUserPredictions, getPredictionById } from './user-predictions';
export { resolvePrediction } from './resolve-prediction';
export { getLeaderboard, getUserStats } from './leaderboard';
export { default as getMarketAnalysis } from './market-analysis';
