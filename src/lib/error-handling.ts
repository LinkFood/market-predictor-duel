
/**
 * Error handling utilities
 */

import { toast } from "@/hooks/use-toast";
import { API_ERRORS } from "./config";

// Error types
export enum ErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// Format error for UI display
export function formatErrorMessage(error: any): string {
  // Handle specific error types
  if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
    return API_ERRORS.NETWORK_ERROR;
  }
  
  if (error?.status === 401 || error?.message?.includes("auth") || error?.message?.includes("unauthorized")) {
    return API_ERRORS.AUTHENTICATION_ERROR;
  }
  
  if (error?.status === 404 || error?.message?.includes("not found")) {
    return API_ERRORS.NOT_FOUND;
  }
  
  if (error?.status >= 500 || error?.message?.includes("server")) {
    return API_ERRORS.SERVER_ERROR;
  }
  
  // If we have a message, use it
  if (typeof error?.message === 'string') {
    return error.message;
  }
  
  // Fallback for unknown errors
  return "An unexpected error occurred. Please try again.";
}

// Show error toast with formatted message
export function showErrorToast(error: any, title = "Error"): void {
  const message = formatErrorMessage(error);
  console.error(error);
  
  toast({
    variant: "destructive",
    title,
    description: message
  });
}

// Log error with details
export function logError(error: any, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';
  
  console.error(`${timestamp}${contextStr}:`, error);
  
  // Could be extended to log to a monitoring service
}

// Handle API errors consistently
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: any = new Error(`API error with status ${response.status}`);
    error.status = response.status;
    
    try {
      // Try to parse error details from response
      const errorData = await response.json();
      error.data = errorData;
      
      if (errorData.message) {
        error.message = errorData.message;
      }
    } catch (e) {
      // If parsing fails, use status text
      error.message = response.statusText;
    }
    
    throw error;
  }
  
  return await response.json();
}
