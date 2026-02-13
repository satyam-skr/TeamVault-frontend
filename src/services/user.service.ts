/**
 * User Service
 * Handles all user-related API calls (Admin only)
 */

import { api } from './api';
import type {
  User,
  UserResponse,
  UserListResponse,
  UserStatsResponse,
  BaseResponse,
} from '@/types/api';

class UserService {
  async getAllUsers(): Promise<UserListResponse> {
    return api.get<UserListResponse>('/api/v1/users');
  }

  async getUserById(id: string): Promise<UserResponse> {
    return api.get<UserResponse>(`/api/v1/users/${id}`);
  }

  async deleteUser(id: string): Promise<BaseResponse<null>> {
    return api.delete(`/api/v1/users/${id}`);
  }

  async getUserStats(): Promise<UserStatsResponse> {
    return api.get<UserStatsResponse>('/api/v1/users/stats');
  }
}

export const userService = new UserService();
