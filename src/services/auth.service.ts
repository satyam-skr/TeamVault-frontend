/**
 * Authentication Service
 * Handles all auth-related API calls with cookie-based token management
 */

import { api } from './api';
import { cookieManager } from '@/lib/cookies';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from '@/types/api';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/api/v1/auth/register',
      data,
      { requiresAuth: false }
    );

    if (response.success && response.data) {
      // Store tokens in cookies
      cookieManager.setAuthTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response;
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/api/v1/auth/login',
      credentials,
      { requiresAuth: false }
    );

    if (response.success && response.data) {
      // Store tokens in cookies
      cookieManager.setAuthTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    return api.get<UserResponse>('/api/v1/auth/me');
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await api.post('/api/v1/auth/logout', {});
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear cookies, even if API call fails
      cookieManager.clearAuthCookies();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return cookieManager.isAuthenticated();
  }

  /**
   * Get access token from cookies
   */
  getAccessToken(): string | null {
    return cookieManager.getAccessToken();
  }
}

export const authService = new AuthService();
