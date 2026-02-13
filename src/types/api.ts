/**
 * API Types - Imported from backend contract
 * These types ensure type safety across the entire frontend
 */

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface BaseResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends BaseResponse<{
  user: User;
  accessToken: string;
  refreshToken: string;
}> {}

export interface TokenRefreshResponse extends BaseResponse<AuthTokens> {}

export interface UserResponse extends BaseResponse<User> {}

export interface UserListResponse extends BaseResponse<User[]> {}

export interface TaskResponse extends BaseResponse<Task> {}

export interface TaskListResponse extends BaseResponse<Task[]> {}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export interface TaskStatsResponse extends BaseResponse<TaskStats> {}

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  userCount: number;
}

export interface UserStatsResponse extends BaseResponse<UserStats> {}

export interface ApiError extends Error {
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const API_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  GET_CURRENT_USER: '/api/v1/auth/me',
  LOGOUT: '/api/v1/auth/logout',
  CREATE_TASK: '/api/v1/tasks',
  GET_TASKS: '/api/v1/tasks',
  GET_TASK_STATS: '/api/v1/tasks/stats',
  GET_TASK_BY_ID: (id: string) => `/api/v1/tasks/${id}`,
  UPDATE_TASK: (id: string) => `/api/v1/tasks/${id}`,
  DELETE_TASK: (id: string) => `/api/v1/tasks/${id}`,
} as const;
