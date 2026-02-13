/**
 * API Service
 * Centralized API client with automatic token management
 */

import { cookieManager } from '@/lib/cookies';
import type { ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class APIService {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (reason: any) => void;
  }> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = cookieManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Invalid refresh response');
      }

      const { accessToken, refreshToken: newRefreshToken } = result.data;

      // Store new tokens in cookies
      cookieManager.setAuthTokens(accessToken, newRefreshToken);

      return accessToken;
    } catch (error) {
      // Clear cookies and redirect to login
      cookieManager.clearAuthCookies();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  /**
   * Handle 401 Unauthorized responses with token refresh
   */
  private async handleUnauthorized(): Promise<string> {
    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await this.refreshAccessToken();
      this.processQueue(null, newToken);
      return newToken;
    } catch (error) {
      this.processQueue(error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Make an HTTP request with automatic token attachment
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, headers = {}, ...restConfig } = config;

    // Build headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Attach Authorization header if authenticated
    if (requiresAuth) {
      const accessToken = cookieManager.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      // Make the request
      let response = await fetch(`${this.baseURL}${endpoint}`, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Handle 401 - attempt token refresh and retry
      if (response.status === 401 && requiresAuth) {
        try {
          // Get new token
          const newToken = await this.handleUnauthorized();

          // Retry request with new token
          (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;

          response = await fetch(`${this.baseURL}${endpoint}`, {
            ...restConfig,
            headers: requestHeaders,
          });
        } catch (refreshError) {
          throw refreshError;
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle HTTP response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid JSON response');
    }

    if (!response.ok) {
      const error = new Error(data.message || 'Request failed') as ApiError;
      error.statusCode = response.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return error as ApiError;
    }

    const apiError = new Error('An unexpected error occurred') as ApiError;
    return apiError;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new APIService(API_BASE_URL);
