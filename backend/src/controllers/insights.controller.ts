import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { geminiService } from '../services/gemini.service';

export class InsightsController {
  /**
   * Get AI-powered long-term health insights
   */
  static async getLongTermInsights(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      // Check if AI is enabled
      if (!geminiService.isEnabled()) {
        res.status(200).json({
          success: true,
          data: {
            insights: [],
            message: 'AI insights require Gemini API configuration. Add GEMINI_API_KEY to your .env file.',
          },
        });
        return;
      }

      // Get all user symptoms for analysis
      const symptoms = await prisma.symptom.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: 100, // Analyze last 100 symptoms
        select: {
          symptomName: true,
          severity: true,
          startedAt: true,
          endedAt: true,
          status: true,
          bodyLocation: true,
        },
      });

      if (symptoms.length === 0) {
        res.status(200).json({
          success: true,
          data: {
            insights: [],
            message: 'Not enough symptom data for pattern analysis. Log more symptoms to get AI insights.',
          },
        });
        return;
      }

      // Get user profile for context
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const userAge = user?.dateOfBirth 
        ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : undefined;

      // Map symptoms to match HistoricalSymptom type
      const historyData = symptoms.map((s: any) => ({
        symptomName: s.symptomName,
        severity: s.severity,
        startedAt: s.startedAt,
        endedAt: s.endedAt || undefined,
        status: s.status,
        bodyLocation: s.bodyLocation || undefined,
      }));

      // Generate AI insights
      const aiInsights = await geminiService.analyzeLongTermPatterns(
        historyData,
        userAge,
        user?.profile?.medicalConditions || undefined
      );

      // Store insights in database
      const savedInsights = await Promise.all(
        aiInsights.map(insight =>
          prisma.healthInsight.create({
            data: {
              userId,
              insightType: insight.type,
              title: insight.title,
              description: insight.description,
              severity: insight.severity,
              relatedSymptoms: insight.relatedSymptoms,
              recommendations: insight.recommendations,
              confidence: insight.confidence,
              metadata: insight.metadata || {},
            },
          })
        )
      );

      res.status(200).json({
        success: true,
        data: {
          insights: savedInsights,
          analyzed: symptoms.length,
          message: aiInsights.length > 0 
            ? `Generated ${aiInsights.length} insights from ${symptoms.length} symptoms.`
            : 'No significant patterns detected yet. Continue logging symptoms for better insights.',
        },
      });
    } catch (error) {
      console.error('Get insights error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate health insights.',
      });
    }
  }

  /**
   * Get stored health insights
   */
  static async getStoredInsights(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { type, limit = '10' } = req.query;

      const insights = await prisma.healthInsight.findMany({
        where: {
          userId,
          ...(type ? { insightType: type as string } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
      });

      res.status(200).json({
        success: true,
        data: { insights },
      });
    } catch (error) {
      console.error('Get stored insights error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve insights.',
      });
    }
  }

  /**
   * Delete an insight
   */
  static async deleteInsight(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const insight = await prisma.healthInsight.findFirst({
        where: { id, userId },
      });

      if (!insight) {
        res.status(404).json({
          success: false,
          error: 'Insight not found.',
        });
        return;
      }

      await prisma.healthInsight.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Insight deleted successfully.',
      });
    } catch (error) {
      console.error('Delete insight error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete insight.',
      });
    }
  }
}
