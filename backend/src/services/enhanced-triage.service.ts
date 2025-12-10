import { TriageResult } from '../types';
import { geminiService } from './gemini.service';

interface SymptomData {
  symptomName: string;
  severity: number;
  bodyLocation?: string;
  characteristic?: string;
  frequency?: string;
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
  triggers?: string[];
  alleviatingFactors?: string[];
  aggravatingFactors?: string[];
  notes?: string;
}

interface HistoricalSymptom {
  symptomName: string;
  severity: number;
  startedAt: Date;
  endedAt?: Date;
  status: string;
  bodyLocation?: string;
}

interface EnhancedTriageResult extends TriageResult {
  aiInsights?: string;
  patternAnalysis?: string;
}

/**
 * Enhanced Smart Triage Engine with AI Integration
 * 
 * Features:
 * - Rule-based emergency detection
 * - Severity scoring algorithm
 * - Vital signs analysis
 * - Symptom pattern recognition
 * - AI-powered insights via Gemini
 * - Historical context analysis
 */
export class EnhancedTriageService {
  // Critical symptoms requiring immediate emergency care
  private static readonly CRITICAL_SYMPTOMS = [
    'chest pain',
    'difficulty breathing',
    'severe difficulty breathing',
    'sudden severe headache',
    'loss of consciousness',
    'unconscious',
    'severe bleeding',
    'paralysis',
    'stroke',
    'stroke symptoms',
    'facial drooping',
    'seizure',
    'severe allergic reaction',
    'anaphylaxis',
    'suicidal thoughts',
    'suicide',
    'severe burns',
    'poisoning',
    'overdose',
  ];

  // High-priority symptoms requiring urgent medical attention
  private static readonly HIGH_PRIORITY_SYMPTOMS = [
    'confusion',
    'disorientation',
    'severe abdominal pain',
    'coughing blood',
    'vomiting blood',
    'severe burn',
    'head injury',
    'high fever',
    'shortness of breath',
    'severe vomiting',
    'vision loss',
    'sudden vision changes',
    'severe dizziness',
    'slurred speech',
    'weakness on one side',
    'severe dehydration',
  ];

  // Moderate concern symptoms
  private static readonly MODERATE_SYMPTOMS = [
    'persistent headache',
    'moderate fever',
    'persistent cough',
    'moderate pain',
    'swelling',
    'rash',
    'nausea',
    'diarrhea',
    'fatigue',
  ];

  // Emergency symptom combinations
  private static readonly EMERGENCY_COMBINATIONS = [
    ['chest pain', 'shortness of breath'],
    ['chest pain', 'sweating'],
    ['chest pain', 'nausea'],
    ['severe headache', 'confusion'],
    ['severe headache', 'vision'],
    ['abdominal pain', 'fever'],
    ['abdominal pain', 'vomiting'],
  ];

  /**
   * Assess symptom with enhanced AI insights
   */
  static async assessSymptom(
    symptomData: SymptomData,
    userHistory?: HistoricalSymptom[]
  ): Promise<EnhancedTriageResult> {
    // Run rule-based assessment
    const baseAssessment = this.runRuleBasedAssessment(symptomData, userHistory);
    
    // Get AI insights if available
    if (geminiService.isEnabled()) {
      try {
        const aiInsights = await geminiService.getSymptomInsights(
          symptomData,
          userHistory
        );

        // Add AI recommendations to existing ones
        const enhancedRecommendations = [
          ...aiInsights.recommendations.slice(0, 3),
        ];

        // Get enhanced recommendation
        const enhancedRec = await geminiService.getEnhancedTriageRecommendation(
          symptomData,
          baseAssessment.urgencyLevel,
          baseAssessment.score,
          userHistory
        );

        return {
          ...baseAssessment,
          recommendation: enhancedRec 
            ? `${baseAssessment.recommendation}\n\n💡 AI Insight: ${enhancedRec}`
            : baseAssessment.recommendation,
          aiInsights: aiInsights.insights,
          patternAnalysis: aiInsights.patternAnalysis,
          reasoning: [
            ...baseAssessment.reasoning,
            ...enhancedRecommendations.map(r => `AI Recommendation: ${r}`),
          ],
        };
      } catch (error) {
        console.error('AI assessment error:', error);
        // Return base assessment if AI fails
        return baseAssessment;
      }
    }

    return baseAssessment;
  }

  /**
   * Core rule-based triage algorithm
   */
  private static runRuleBasedAssessment(
    symptomData: SymptomData,
    userHistory?: HistoricalSymptom[]
  ): TriageResult {
    let score = 0;
    const reasoning: string[] = [];
    const redFlags: string[] = [];

    // Base severity score (1-10)
    score += symptomData.severity;
    reasoning.push(`Base severity level: ${symptomData.severity}/10`);

    const symptomLower = symptomData.symptomName.toLowerCase();

    // Critical symptom detection
    for (const critical of this.CRITICAL_SYMPTOMS) {
      if (symptomLower.includes(critical)) {
        score += 60;
        redFlags.push(critical);
        reasoning.push(`🚨 CRITICAL: Detected life-threatening symptom - ${critical}`);
      }
    }

    // High priority symptom detection
    for (const highPriority of this.HIGH_PRIORITY_SYMPTOMS) {
      if (symptomLower.includes(highPriority)) {
        score += 30;
        redFlags.push(highPriority);
        reasoning.push(`⚠️ HIGH PRIORITY: Detected concerning symptom - ${highPriority}`);
      }
    }

    // Moderate symptom detection
    for (const moderate of this.MODERATE_SYMPTOMS) {
      if (symptomLower.includes(moderate)) {
        score += 5;
        reasoning.push(`Detected common symptom: ${moderate}`);
      }
    }

    // Emergency combination detection
    for (const [symptom1, symptom2] of this.EMERGENCY_COMBINATIONS) {
      if (symptomLower.includes(symptom1) && 
          (symptomLower.includes(symptom2) || 
           symptomData.notes?.toLowerCase().includes(symptom2))) {
        score += 40;
        redFlags.push(`combination: ${symptom1} + ${symptom2}`);
        reasoning.push(`🚨 CRITICAL COMBINATION: ${symptom1} with ${symptom2}`);
      }
    }

    // Vital signs assessment
    if (symptomData.temperature) {
      if (symptomData.temperature >= 104) {
        score += 25;
        redFlags.push('dangerously high temperature');
        reasoning.push(`🚨 DANGEROUS: Temperature ${symptomData.temperature}°F (104°F+)`);
      } else if (symptomData.temperature >= 103) {
        score += 20;
        redFlags.push('very high temperature');
        reasoning.push(`⚠️ Very high temperature: ${symptomData.temperature}°F`);
      } else if (symptomData.temperature >= 101) {
        score += 10;
        redFlags.push('elevated temperature');
        reasoning.push(`Elevated temperature: ${symptomData.temperature}°F`);
      } else if (symptomData.temperature <= 95) {
        score += 20;
        redFlags.push('hypothermia risk');
        reasoning.push(`⚠️ Low temperature: ${symptomData.temperature}°F`);
      }
    }

    if (symptomData.heartRate) {
      if (symptomData.heartRate > 140) {
        score += 20;
        redFlags.push('tachycardia');
        reasoning.push(`⚠️ Very high heart rate: ${symptomData.heartRate} bpm`);
      } else if (symptomData.heartRate > 120) {
        score += 15;
        redFlags.push('elevated heart rate');
        reasoning.push(`Elevated heart rate: ${symptomData.heartRate} bpm`);
      } else if (symptomData.heartRate < 45) {
        score += 20;
        redFlags.push('bradycardia');
        reasoning.push(`⚠️ Very low heart rate: ${symptomData.heartRate} bpm`);
      } else if (symptomData.heartRate < 50) {
        score += 15;
        redFlags.push('low heart rate');
        reasoning.push(`Low heart rate: ${symptomData.heartRate} bpm`);
      }
    }

    // Blood pressure assessment
    if (symptomData.bloodPressure) {
      const bpMatch = symptomData.bloodPressure.match(/(\d+)\/(\d+)/);
      if (bpMatch) {
        const systolic = parseInt(bpMatch[1]);
        const diastolic = parseInt(bpMatch[2]);
        
        if (systolic >= 180 || diastolic >= 120) {
          score += 30;
          redFlags.push('hypertensive crisis');
          reasoning.push(`🚨 HYPERTENSIVE CRISIS: BP ${symptomData.bloodPressure}`);
        } else if (systolic >= 140 || diastolic >= 90) {
          score += 10;
          reasoning.push(`Elevated blood pressure: ${symptomData.bloodPressure}`);
        } else if (systolic < 90 || diastolic < 60) {
          score += 15;
          redFlags.push('hypotension');
          reasoning.push(`⚠️ Low blood pressure: ${symptomData.bloodPressure}`);
        }
      }
    }

    // Severity-based modifiers
    if (symptomData.severity >= 9) {
      score += 15;
      reasoning.push('🔴 Extremely high severity (9-10/10) requires urgent evaluation');
    } else if (symptomData.severity >= 8) {
      score += 10;
      reasoning.push('High severity (8/10) requires prompt attention');
    } else if (symptomData.severity >= 6) {
      score += 5;
      reasoning.push('Moderate-high severity noted');
    }

    // Characteristic-based assessment
    if (symptomData.characteristic) {
      const charLower = symptomData.characteristic.toLowerCase();
      if (charLower === 'sharp' || charLower === 'stabbing') {
        score += 8;
        reasoning.push('Sharp/stabbing pain may indicate acute condition');
      } else if (charLower === 'burning') {
        score += 5;
        reasoning.push('Burning sensation noted');
      } else if (charLower === 'throbbing') {
        score += 4;
        reasoning.push('Throbbing characteristic suggests inflammation/pressure');
      }
    }

    // Frequency assessment
    if (symptomData.frequency) {
      if (symptomData.frequency === 'constant') {
        score += 8;
        reasoning.push('Constant symptoms require evaluation');
      } else if (symptomData.frequency === 'intermittent') {
        score += 3;
        reasoning.push('Intermittent pattern noted');
      }
    }

    // Historical pattern analysis
    if (userHistory && userHistory.length > 0) {
      const recentSimilar = userHistory.filter(h => 
        h.symptomName.toLowerCase().includes(symptomLower) ||
        symptomLower.includes(h.symptomName.toLowerCase())
      );

      if (recentSimilar.length >= 3) {
        score += 10;
        reasoning.push(`⚠️ Recurring symptom detected (${recentSimilar.length} previous occurrences)`);
      }

      // Check for worsening pattern
      const worseningSymptoms = userHistory.filter(h => h.status === 'WORSENING');
      if (worseningSymptoms.length >= 2) {
        score += 8;
        reasoning.push('Pattern of worsening symptoms detected');
      }
    }

    // Determine urgency level
    const urgencyLevel = this.calculateUrgencyLevel(score, redFlags.length);
    const recommendation = this.generateRecommendation(urgencyLevel, symptomData, score);

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
    // Any critical red flags or very high score = EMERGENCY
    if (score >= 60 || redFlagCount >= 2) {
      return 'EMERGENCY';
    }

    // High score or multiple red flags = URGENT
    if (score >= 40 || redFlagCount >= 1) {
      return 'URGENT';
    }

    // Moderate score = SEMI_URGENT
    if (score >= 25) {
      return 'SEMI_URGENT';
    }

    // Low-moderate score = NON_URGENT
    if (score >= 15) {
      return 'NON_URGENT';
    }

    // Low score = SELF_CARE
    return 'SELF_CARE';
  }

  private static generateRecommendation(
    urgencyLevel: TriageResult['urgencyLevel'],
    symptomData: SymptomData,
    score: number
  ): string {
    let rec = '';

    switch (urgencyLevel) {
      case 'EMERGENCY':
        rec = '🚨 **CALL 911 IMMEDIATELY** or go to the nearest Emergency Room.\n\n';
        rec += 'This situation may be life-threatening and requires immediate medical attention. ';
        rec += 'Do not drive yourself - call emergency services or have someone drive you.';
        
        if (symptomData.symptomName.toLowerCase().includes('chest pain')) {
          rec += '\n\n⚠️ **For chest pain**: Sit down, loosen tight clothing, and chew an aspirin if not allergic (call 911 first).';
        } else if (symptomData.symptomName.toLowerCase().includes('stroke')) {
          rec += '\n\n⚠️ **For stroke symptoms**: Note the time symptoms started. Every minute counts - "Time is Brain."';
        }
        break;

      case 'URGENT':
        rec = '⚠️ **Seek medical care within 2-4 hours.**\n\n';
        rec += 'Visit an Urgent Care facility or Emergency Department. Do not wait for a regular appointment. ';
        rec += 'This requires prompt medical evaluation to prevent complications.';
        
        if (score >= 50) {
          rec += '\n\n🔴 Your symptom score is high - strongly consider going to the ER instead of urgent care.';
        }
        break;

      case 'SEMI_URGENT':
        rec = '📞 **Contact your primary care provider within 24-48 hours.**\n\n';
        rec += 'Schedule an appointment as soon as possible. Monitor your symptoms closely. ';
        rec += 'If symptoms worsen significantly, seek immediate care.';
        
        rec += '\n\n**Monitor for warning signs**: Increasing severity, new symptoms, fever, difficulty performing daily activities.';
        break;

      case 'NON_URGENT':
        rec = '📅 **Schedule an appointment with your primary care provider within 1-2 weeks.**\n\n';
        rec += 'Continue monitoring your symptoms. While not urgent, medical evaluation is recommended. ';
        rec += 'Keep a symptom diary to share with your healthcare provider.';
        
        rec += '\n\n**Track**: Symptom patterns, triggers, what helps/worsens symptoms.';
        break;

      case 'SELF_CARE':
        rec = '🏠 **Self-care and monitoring recommended.**\n\n';
        rec += 'You can manage this at home with appropriate self-care measures:\n\n';
        rec += '• **Rest**: Get adequate sleep and avoid overexertion\n';
        rec += '• **Hydration**: Drink plenty of fluids\n';
        rec += '• **OTC Relief**: Use over-the-counter remedies as appropriate\n';
        rec += '• **Monitor**: Keep track of symptom changes\n\n';
        rec += '⚠️ Contact a healthcare provider if symptoms worsen, persist beyond 5-7 days, or new concerning symptoms develop.';
        break;
    }

    rec += '\n\n---\n*This is an AI-assisted triage tool and does not replace professional medical advice. When in doubt, seek medical care.*';

    return rec;
  }
}

export const enhancedTriageService = EnhancedTriageService;
