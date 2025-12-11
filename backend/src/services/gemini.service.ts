import { GoogleGenerativeAI } from '@google/generative-ai';

interface SymptomContext {
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

interface AIInsightResult {
  insights: string;
  patternAnalysis?: string;
  recommendations: string[];
  riskFactors: string[];
  confidence: number;
}

interface LongTermInsight {
  type: 'pattern' | 'trend' | 'risk_factor' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedSymptoms: string[];
  recommendations: string[];
  confidence: number;
  metadata?: any;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('🔑 Gemini API Key status:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      isPlaceholder: apiKey === 'your-gemini-api-key-here',
      firstChars: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined'
    });
    
    if (apiKey && apiKey !== 'your-gemini-api-key-here' && apiKey.trim() !== '') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        console.log('✅ Gemini AI initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error);
      }
    } else {
      console.warn('⚠️  Gemini API Key not configured. AI features will be disabled.');
      console.warn('⚠️  Set GEMINI_API_KEY environment variable to enable AI insights.');
    }
  }

  isEnabled(): boolean {
    return this.model !== null;
  }

  /**
   * Get AI-powered insights for a single symptom
   */
  async getSymptomInsights(
    symptomData: SymptomContext,
    userHistory?: HistoricalSymptom[]
  ): Promise<AIInsightResult> {
    if (!this.isEnabled()) {
      return this.getFallbackInsights(symptomData);
    }

    try {
      const prompt = this.buildSymptomAnalysisPrompt(symptomData, userHistory);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseSymptomInsights(response);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackInsights(symptomData);
    }
  }

  /**
   * Analyze long-term patterns and trends across all user symptoms
   */
  async analyzeLongTermPatterns(
    symptoms: HistoricalSymptom[],
    userAge?: number,
    medicalConditions?: string[]
  ): Promise<LongTermInsight[]> {
    if (!this.isEnabled() || symptoms.length === 0) {
      return [];
    }

    try {
      const prompt = this.buildLongTermAnalysisPrompt(symptoms, userAge, medicalConditions);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseLongTermInsights(response, symptoms);
    } catch (error) {
      console.error('Gemini API error in long-term analysis:', error);
      return [];
    }
  }

  /**
   * Get enhanced triage recommendation with AI context
   */
  async getEnhancedTriageRecommendation(
    symptomData: SymptomContext,
    baseUrgencyLevel: string,
    baseScore: number,
    userHistory?: HistoricalSymptom[]
  ): Promise<string> {
    if (!this.isEnabled()) {
      return '';
    }

    try {
      const prompt = `You are a medical AI assistant. Based on this triage assessment, provide a brief, actionable enhancement to the recommendation.

Symptom: ${symptomData.symptomName}
Location: ${symptomData.bodyLocation || 'Not specified'}
Severity: ${symptomData.severity}/10
Urgency Level: ${baseUrgencyLevel}
Triage Score: ${baseScore}

${symptomData.characteristic ? `Characteristic: ${symptomData.characteristic}` : ''}
${symptomData.frequency ? `Frequency: ${symptomData.frequency}` : ''}
${symptomData.temperature ? `Temperature: ${symptomData.temperature}°F` : ''}
${symptomData.heartRate ? `Heart Rate: ${symptomData.heartRate} bpm` : ''}
${symptomData.triggers && symptomData.triggers.length > 0 ? `Triggers: ${symptomData.triggers.join(', ')}` : ''}

${userHistory && userHistory.length > 0 ? `
Recent symptom history (${userHistory.length} symptoms):
${userHistory.slice(0, 5).map(s => `- ${s.symptomName} (Severity: ${s.severity}, ${s.status})`).join('\n')}
` : ''}

Provide 1-2 sentences of specific, actionable advice. Focus on:
1. What to monitor
2. When to escalate
3. Self-care measures (if appropriate)

Keep it concise and practical.`;

      const result = await this.model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Gemini API error in enhanced recommendation:', error);
      return '';
    }
  }

  private buildSymptomAnalysisPrompt(
    symptomData: SymptomContext,
    userHistory?: HistoricalSymptom[]
  ): string {
    return `You are a medical AI assistant analyzing symptom data. Provide insights in JSON format.

Current Symptom:
- Name: ${symptomData.symptomName}
- Severity: ${symptomData.severity}/10
- Location: ${symptomData.bodyLocation || 'Not specified'}
- Characteristic: ${symptomData.characteristic || 'Not specified'}
- Frequency: ${symptomData.frequency || 'Not specified'}
${symptomData.temperature ? `- Temperature: ${symptomData.temperature}°F` : ''}
${symptomData.heartRate ? `- Heart Rate: ${symptomData.heartRate} bpm` : ''}
${symptomData.bloodPressure ? `- Blood Pressure: ${symptomData.bloodPressure}` : ''}
${symptomData.triggers && symptomData.triggers.length > 0 ? `- Triggers: ${symptomData.triggers.join(', ')}` : ''}
${symptomData.alleviatingFactors && symptomData.alleviatingFactors.length > 0 ? `- Alleviating Factors: ${symptomData.alleviatingFactors.join(', ')}` : ''}
${symptomData.aggravatingFactors && symptomData.aggravatingFactors.length > 0 ? `- Aggravating Factors: ${symptomData.aggravatingFactors.join(', ')}` : ''}
${symptomData.notes ? `- Notes: ${symptomData.notes}` : ''}

${userHistory && userHistory.length > 0 ? `
Recent Symptom History (${userHistory.length} symptoms):
${userHistory.slice(0, 10).map(s => `- ${s.symptomName} (Severity: ${s.severity}, Status: ${s.status}, Started: ${s.startedAt.toLocaleDateString()})${s.endedAt ? `, Ended: ${s.endedAt.toLocaleDateString()}` : ''}`).join('\n')}
` : ''}

Analyze this symptom and provide:
1. Key insights about the symptom
2. Possible pattern connections with history (if any)
3. Specific recommendations (3-5 actionable items)
4. Risk factors to watch for
5. Confidence level (0.0 to 1.0)

Respond in JSON format:
{
  "insights": "Brief clinical insights about this symptom",
  "patternAnalysis": "Pattern connections with history (or null if none)",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "riskFactors": ["risk1", "risk2"],
  "confidence": 0.85
}`;
  }

  private buildLongTermAnalysisPrompt(
    symptoms: HistoricalSymptom[],
    userAge?: number,
    medicalConditions?: string[]
  ): string {
    // Group symptoms by type
    const symptomSummary = symptoms.reduce((acc, s) => {
      acc[s.symptomName] = (acc[s.symptomName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedSymptoms = Object.entries(symptomSummary)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return `You are a medical AI assistant analyzing long-term health patterns. User has logged ${symptoms.length} symptoms over time.

${userAge ? `Patient Age: ${userAge} years` : ''}
${medicalConditions && medicalConditions.length > 0 ? `Known Conditions: ${medicalConditions.join(', ')}` : ''}

Most Frequent Symptoms:
${sortedSymptoms.map(([name, count]) => `- ${name}: ${count} occurrences`).join('\n')}

Recent Symptoms (last 10):
${symptoms.slice(0, 10).map(s => `- ${s.symptomName} (Severity: ${s.severity}, Status: ${s.status}, ${s.startedAt.toLocaleDateString()}${s.bodyLocation ? `, Location: ${s.bodyLocation}` : ''})`).join('\n')}

Identify and analyze:
1. Recurring patterns or cycles
2. Symptom trends (worsening, improving, stable)
3. Potential risk factors or triggers
4. Preventive recommendations

Respond with a JSON array of insights (0-5 insights):
[
  {
    "type": "pattern|trend|risk_factor|recommendation",
    "title": "Brief title",
    "description": "Detailed description",
    "severity": "low|medium|high|critical",
    "relatedSymptoms": ["symptom1", "symptom2"],
    "recommendations": ["action1", "action2"],
    "confidence": 0.85,
    "metadata": {}
  }
]

Return empty array [] if no significant patterns found.`;
  }

  private parseSymptomInsights(response: string): AIInsightResult {
    try {
      // Extract JSON from response (might have markdown code blocks)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        insights: parsed.insights || 'No specific insights available.',
        patternAnalysis: parsed.patternAnalysis || undefined,
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        insights: 'AI analysis completed. Monitor your symptoms and consult a healthcare provider if they worsen.',
        recommendations: ['Track symptom progression', 'Note any changes in severity', 'Seek medical attention if concerned'],
        riskFactors: [],
        confidence: 0.5,
      };
    }
  }

  private parseLongTermInsights(response: string, _symptoms: HistoricalSymptom[]): LongTermInsight[] {
    try {
      // Extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((insight: any) => insight.title && insight.description)
        .map((insight: any) => ({
          type: ['pattern', 'trend', 'risk_factor', 'recommendation'].includes(insight.type)
            ? insight.type
            : 'recommendation',
          title: insight.title,
          description: insight.description,
          severity: ['low', 'medium', 'high', 'critical'].includes(insight.severity)
            ? insight.severity
            : 'medium',
          relatedSymptoms: Array.isArray(insight.relatedSymptoms) ? insight.relatedSymptoms : [],
          recommendations: Array.isArray(insight.recommendations) ? insight.recommendations : [],
          confidence: typeof insight.confidence === 'number' ? insight.confidence : 0.5,
          metadata: insight.metadata || {},
        }));
    } catch (error) {
      console.error('Error parsing long-term insights:', error);
      return [];
    }
  }

  private getFallbackInsights(symptomData: SymptomContext): AIInsightResult {
    const recommendations: string[] = [];
    const riskFactors: string[] = [];

    // Basic rule-based recommendations
    if (symptomData.severity >= 7) {
      recommendations.push('Monitor symptoms closely for any worsening');
      recommendations.push('Keep a detailed symptom diary');
      riskFactors.push('High severity may indicate serious condition');
    }

    if (symptomData.temperature && symptomData.temperature >= 101) {
      recommendations.push('Stay hydrated and get adequate rest');
      riskFactors.push('Elevated temperature detected');
    }

    if (symptomData.heartRate && (symptomData.heartRate > 100 || symptomData.heartRate < 60)) {
      riskFactors.push('Abnormal heart rate detected');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring your symptoms');
      recommendations.push('Maintain a healthy lifestyle');
      recommendations.push('Consult a healthcare provider if symptoms persist');
    }

    return {
      insights: 'Basic symptom analysis completed. AI insights are not available without Gemini API configuration.',
      recommendations,
      riskFactors,
      confidence: 0.3,
    };
  }
}

export const geminiService = new GeminiService();
