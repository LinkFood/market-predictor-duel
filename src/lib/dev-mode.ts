/**
 * Development Mode Utilities
 * 
 * This file provides utilities for running the app in development mode
 * with automatic authentication bypass.
 */

// Mock user for development
export const DEV_USER = {
  id: "mock-user-id-123456",
  email: "dev@example.com",
  user_metadata: {
    username: "DevUser",
    avatar_url: ""
  },
  created_at: "2024-01-15T00:00:00.000Z"
};

// Mock session
export const DEV_SESSION = {
  user: DEV_USER,
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600000
};