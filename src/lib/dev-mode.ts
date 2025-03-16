
/**
 * Development Mode Utilities
 * 
 * This file provides utilities for running the app in development mode
 * with automatic authentication bypass.
 */

import { User, Session } from '@supabase/supabase-js';

// Mock user for development with all required properties
export const DEV_USER = {
  id: "mock-user-id-123456",
  email: "dev@example.com",
  user_metadata: {
    username: "DevUser",
    avatar_url: ""
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-15T00:00:00.000Z",
  role: "",
  updated_at: ""
} as User;

// Mock session with all required properties
export const DEV_SESSION = {
  user: DEV_USER,
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600000,
  expires_in: 3600,
  token_type: "bearer"
} as Session;
