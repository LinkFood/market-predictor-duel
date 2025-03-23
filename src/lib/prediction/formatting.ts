
/**
 * Utility functions for formatting prediction-related data
 */

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * Get a human-readable text for a timeframe
 */
export function getTimeframeText(timeframe: string): string {
  switch (timeframe) {
    case "1d": return "1 Day";
    case "1w": return "1 Week";
    case "1m": return "1 Month";
    default: return timeframe;
  }
}

/**
 * Get a status badge configuration for a prediction
 */
export function getPredictionStatusConfig(status: string, winner: string | undefined) {
  if (status === "pending") {
    return {
      type: "pending",
      label: "Pending"
    };
  }
  
  if (status === "complete" || status === "completed") {
    if (winner === "user" || winner === "both") {
      return {
        type: "correct",
        label: "Correct"
      };
    }
  }
  
  return {
    type: "incorrect",
    label: "Incorrect"
  };
}
