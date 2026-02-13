/**
 * Task Service
 * Handles all task-related API calls
 */

import { api } from './api';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TaskListResponse,
  TaskStatsResponse,
} from '@/types/api';

class TaskService {
  async getTasks(): Promise<TaskListResponse> {
    return api.get<TaskListResponse>('/api/v1/tasks');
  }

  async getTaskById(id: string): Promise<TaskResponse> {
    return api.get<TaskResponse>(`/api/v1/tasks/${id}`);
  }

  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    return api.post<TaskResponse>('/api/v1/tasks', data);
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    return api.patch<TaskResponse>(`/api/v1/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<void> {
    return api.delete(`/api/v1/tasks/${id}`);
  }

  async getTaskStats(): Promise<TaskStatsResponse> {
    return api.get<TaskStatsResponse>('/api/v1/tasks/stats');
  }
}

export const taskService = new TaskService();
