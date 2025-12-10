import { TriageResult } from '../types';

interface SymptomData {
  symptomName: string;
  severity: number;
  bodyLocation?: string;
  characteristic?: string;
  frequency?: string;
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
}

/**
 * Smart Triage Engine
 * Rule-based algorithm for assessing symptom urgency
 * 
 * Scoring System:
 * - Base score from severity (1-10)
 * - Red flag symptoms add points
 * - Vital signs abnormalities add points
 * - Symptom combinations trigger emergency levels
 */
export class TriageService {
  private static readonly RED_FLAG_SYMPTOMS = {
    CRITICAL: [
      'chest pain',
      'difficulty breathing',
      'sudden severe headache',
      'loss of consciousness',
      'severe bleeding',
      'paralysis',
      'stroke symptoms',
      'seizure',
      'severe allergic reaction',
      'suicidal thoughts',
    ],
    HIGH: [
      'confusion',
      'severe abdominal pain',
      'coughing blood',
      'severe burn',
      'head injury',
      'high fever',
      'shortness of breath',
      'severe vomiting',
      'vision loss',
    ],
  };

  // Reserved for future enhancement - symptom combination detection
  // private static readonly EMERGENCY_COMBINATIONS = [
  //   ['chest pain', 'shortness of breath'],
  //   ['chest pain', 'sweating'],
  //   ['severe headache', 'confusion'],
  //   ['severe headache', 'vision problems'],
  //   ['abdominal pain', 'fever'],
  // ];

  static async assessSymptom(symptomData: SymptomData): Promise<TriageResult> {
    let score = 0;
    const reasoning: string[] = [];
    const redFlags: string[] = [];

    // Base severity score
    score += symptomData.severity;
    reasoning.push(`Base severity level: ${symptomData.severity}/10`);

    // Check for red flag symptoms
    const symptomLower = symptomData.symptomName.toLowerCase();
    
    for (const criticalSymptom of this.RED_FLAG_SYMPTOMS.CRITICAL) {
      if (symptomLower.includes(criticalSymptom)) {
        score += 50;
        redFlags.push(criticalSymptom);
        reasoning.push(`CRITICAL: Detected red flag symptom - ${criticalSymptom}`);
      }
    }

    for (const highSymptom of this.RED_FLAG_SYMPTOMS.HIGH) {
      if (symptomLower.includes(highSymptom)) {
        score += 25;
        redFlags.push(highSymptom);
        reasoning.push(`HIGH RISK: Detected concerning symptom - ${highSymptom}`);
      }
    }

    // Vital signs assessment
    if (symptomData.temperature) {
      if (symptomData.temperature >= 103 || symptomData.temperature <= 95) {
        score += 15;
        redFlags.push('abnormal temperature');
        reasoning.push(`Abnormal temperature: ${symptomData.temperature}°F`);
      }
    }

    if (symptomData.heartRate) {
      if (symptomData.heartRate > 120 || symptomData.heartRate < 50) {
        score += 15;
        redFlags.push('abnormal heart rate');
        reasoning.push(`Abnormal heart rate: ${symptomData.heartRate} bpm`);
      }
    }

    // Severity-based modifiers
    if (symptomData.severity >= 8) {
      score += 10;
      reasoning.push('High severity rating requires urgent attention');
    }

    // Characteristic assessment
    if (symptomData.characteristic) {
      const charLower = symptomData.characteristic.toLowerCase();
      if (charLower.includes('sharp') || charLower.includes('stabbing')) {
        score += 5;
        reasoning.push('Sharp/stabbing pain may indicate acute condition');
      }
    }

    // Frequency assessment
    if (symptomData.frequency === 'constant') {
      score += 5;
      reasoning.push('Constant symptoms require evaluation');
    }

    // Determine urgency level
    const urgencyLevel = this.calculateUrgencyLevel(score, redFlags.length);
    const recommendation = this.generateRecommendation(urgencyLevel, symptomData);

    return {
      urgencyLevel,
      score,
      reasoning,
      recommendation,
      redFlags,
    };
  }

  private static calculateUrgencyLevel(
    score: number,
    redFlagCount: number
  ): TriageResult['urgencyLevel'] {
    // Any critical red flags trigger emergency
    if (redFlagCount > 0 && score >= 50) {
      return 'EMERGENCY';
    }

    if (score >= 40 || redFlagCount >= 2) {
      return 'URGENT';
    }

    if (score >= 25 || redFlagCount >= 1) {
      return 'SEMI_URGENT';
    }

    if (score >= 15) {
      return 'NON_URGENT';
    }

    return 'SELF_CARE';
  }

  private static generateRecommendation(
    urgencyLevel: TriageResult['urgencyLevel'],
    _symptomData: SymptomData
  ): string {
    switch (urgencyLevel) {
      case 'EMERGENCY':
        return '🚨 CALL 911 IMMEDIATELY or go to the nearest Emergency Room. This may be a life-threatening situation that requires immediate medical attention.';
      
      case 'URGENT':
        return '⚠️ Seek medical care within the next 2-4 hours. Visit an Urgent Care facility or Emergency Department. Do not wait for a regular appointment.';
      
      case 'SEMI_URGENT':
        return '📞 Contact your primary care provider within 24-48 hours. Schedule an appointment as soon as possible. If symptoms worsen, seek immediate care.';
      
      case 'NON_URGENT':
        return '📅 Schedule an appointment with your primary care provider within the next 1-2 weeks. Continue monitoring your symptoms.';
      
      case 'SELF_CARE':
        return '🏠 Monitor symptoms at home. Practice self-care measures such as rest, hydration, and over-the-counter remedies as appropriate. If symptoms worsen or persist beyond 5-7 days, contact your healthcare provider.';
      
      default:
        return 'Please consult with a healthcare provider for proper evaluation.';
    }
  }
}
