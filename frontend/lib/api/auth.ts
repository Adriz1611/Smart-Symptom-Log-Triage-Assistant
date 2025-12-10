import apiClient from './client';
import { LoginCredentials, RegisterData, ApiResponse, User } from '../types';

export const authApi = {
  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/logout', { refreshToken });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
