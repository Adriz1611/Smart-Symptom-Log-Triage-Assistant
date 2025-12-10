import apiClient from './client';
import { ApiResponse } from '../types';

export interface HealthInsight {
  id: string;
  insightType: 'pattern' | 'trend' | 'risk_factor' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedSymptoms: string[];
  recommendations: string[];
  confidence: number;
  createdAt: string;
}

export const insightsApi = {
  generate: async (): Promise<ApiResponse<{ insights: HealthInsight[]; message: string }>> => {
    const response = await apiClient.get('/insights/generate');
    return response.data;
  },

  getAll: async (): Promise<ApiResponse<{ insights: HealthInsight[] }>> => {
    const response = await apiClient.get('/insights');
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/insights/${id}`);
    return response.data;
  },
};
