/**
 * API Client
 * Core HTTP client with automatic token refresh and error handling
 */

import { config } from '@/lib/config';
import { storage } from '@/lib/storage';
import type { ApiError, ErrorResponse } from '@/types/api';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.baseURL = config.api.baseURL;
  }

  private getAccessToken(): string | null {
    return storage.getItem(config.auth.accessTokenKey);
  }

  private getRefreshToken(): string | null {
    return storage.getItem(config.auth.refreshTokenKey);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    storage.setItem(config.auth.accessTokenKey, accessToken);
    storage.setItem(config.auth.refreshTokenKey, refreshToken);
  }

  private clearTokens(): void {
    storage.removeItem(config.auth.accessTokenKey);
    storage.removeItem(config.auth.refreshTokenKey);
  }

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

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
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

      const data = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = data.data;
      
      this.setTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      this.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  private async handleUnauthorized(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
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

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, headers = {}, ...restConfig } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers as Record<string, string>,
    };

    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401 && requiresAuth) {
        try {
          const newToken = await this.handleUnauthorized();
          (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
          
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            ...restConfig,
            headers: requestHeaders,
          });

          return this.handleResponse<T>(retryResponse);
        } catch (refreshError) {
          throw refreshError;
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = new Error(data.message || 'Request failed');
      error.statusCode = response.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return error as ApiError;
    }
    
    const apiError: ApiError = new Error('An unexpected error occurred');
    return apiError;
  }

  // Convenience methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
