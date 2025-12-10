import apiClient from './client';
import { Symptom, CreateSymptomData, ApiResponse } from '../types';

export const symptomApi = {
  create: async (data: CreateSymptomData): Promise<ApiResponse<{ symptom: Symptom; triage: any }>> => {
    const response = await apiClient.post('/symptoms', data);
    return response.data;
  },

  getAll: async (params?: { status?: string; limit?: number; offset?: number }): Promise<ApiResponse<{ symptoms: Symptom[]; pagination: any }>> => {
    const response = await apiClient.get('/symptoms', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Symptom>> => {
    const response = await apiClient.get(`/symptoms/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSymptomData>): Promise<ApiResponse<Symptom>> => {
    const response = await apiClient.put(`/symptoms/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/symptoms/${id}`);
    return response.data;
  },

  getTimeline: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<Record<string, Symptom[]>>> => {
    const response = await apiClient.get('/symptoms/timeline', { params });
    return response.data;
  },

  seedSymptoms: async (): Promise<ApiResponse<{ count: number; dateRange: { start: string; end: string } }>> => {
    const response = await apiClient.post('/symptoms/seed');
    return response.data;
  },
};
