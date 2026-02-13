/**
 * Authentication Context
 * Global auth state management with proper token handling
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  /**
   * Initialize auth state on mount
   * Check if user is authenticated and fetch user data
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a valid access token
        if (authService.isAuthenticated()) {
          // Fetch current user data
          const response = await authService.getCurrentUser();
          
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Invalid token or user data
            await authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear tokens on error
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // Set user in state
        setUser(response.data.user);

        // Redirect to dashboard using Next.js router
        router.push('/dashboard');
        router.refresh();
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      // Re-throw error to be handled by the component
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        // Set user in state
        setUser(response.data.user);

        // Redirect to dashboard using Next.js router
        router.push('/dashboard');
        router.refresh();
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      // Re-throw error to be handled by the component
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear state even if API call fails
      setUser(null);
      router.push('/login');
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
