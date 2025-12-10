import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  dateOfBirth?: Date;
}

export interface SymptomCreateData {
  symptomName: string;
  bodyLocation?: string;
  severity: number;
  startedAt?: Date;
  status?: string;
  details?: {
    characteristic?: string;
    frequency?: string;
    triggers?: string[];
    alleviatingFactors?: string[];
    aggravatingFactors?: string[];
    notes?: string;
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
  };
}

export interface TriageResult {
  urgencyLevel: 'EMERGENCY' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT' | 'SELF_CARE';
  score: number;
  reasoning: string[];
  recommendation: string;
  redFlags: string[];
  aiInsights?: string;
  patternAnalysis?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
