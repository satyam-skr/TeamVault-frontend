/**
 * Application Configuration
 * Centralized configuration for environment variables and constants
 */

export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    timeout: 30000,
  },
  auth: {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryBuffer: 60000, // 1 minute before expiry
  },
  app: {
    name: 'TeamVault',
    description: 'Professional Task Management Platform',
  },
} as const;
