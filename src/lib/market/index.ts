
/**
 * Market Data Module
 * Re-exports from the modular structure for easy importing
 */

// Re-export types
export * from './types';

// Re-export API functions
export * from './api/polygon-api-service';

// Re-export utility services that should be exposed
export * from './stock-data-service';
export * from './search-service';

// Legacy re-export for backward compatibility
export * from './api/polygon-api-service';
