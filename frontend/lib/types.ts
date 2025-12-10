export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface Symptom {
  id: string;
  userId: string;
  symptomName: string;
  bodyLocation?: string;
  severity: number;
  startedAt: string;
  endedAt?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'IMPROVING' | 'WORSENING' | 'MONITORING';
  createdAt: string;
  updatedAt: string;
  details?: SymptomDetail;
  triageAssessments?: TriageAssessment[];
  treatments?: Treatment[];
}

export interface SymptomDetail {
  characteristic?: string;
  frequency?: string;
  triggers?: string[];
  alleviatingFactors?: string[];
  aggravatingFactors?: string[];
  notes?: string;
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
}

export interface TriageAssessment {
  id: string;
  symptomId: string;
  urgencyLevel: 'EMERGENCY' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT' | 'SELF_CARE';
  score: number;
  reasoning: string[];
  recommendation: string;
  redFlags: string[];
  aiInsights?: string;
  patternAnalysis?: string;
  createdAt: string;
}

export interface Treatment {
  id: string;
  symptomId: string;
  treatmentType: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  startedAt: string;
  endedAt?: string;
  effectivenessRating?: number;
  sideEffects?: string[];
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  dateOfBirth?: string;
}

export interface CreateSymptomData {
  symptomName: string;
  bodyLocation?: string;
  severity: number;
  startedAt?: string;
  status?: 'ACTIVE' | 'RESOLVED' | 'IMPROVING' | 'WORSENING' | 'MONITORING';
  details?: Partial<SymptomDetail>;
}
