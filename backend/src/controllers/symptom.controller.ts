import { Response } from 'express';
import { AuthRequest, SymptomCreateData } from '../types';
import prisma from '../config/database';
import { enhancedTriageService } from '../services/enhanced-triage.service';

export class SymptomController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const symptomData: SymptomCreateData = req.body;

      // Create symptom
      const symptom = await prisma.symptom.create({
        data: {
          userId,
          symptomName: symptomData.symptomName,
          bodyLocation: symptomData.bodyLocation,
          severity: symptomData.severity,
          startedAt: symptomData.startedAt ? new Date(symptomData.startedAt) : new Date(),
          status: symptomData.status as any || 'ACTIVE',
          details: symptomData.details ? {
            create: {
              characteristic: symptomData.details.characteristic,
              frequency: symptomData.details.frequency,
              triggers: symptomData.details.triggers || [],
              alleviatingFactors: symptomData.details.alleviatingFactors || [],
              aggravatingFactors: symptomData.details.aggravatingFactors || [],
              notes: symptomData.details.notes,
              temperature: symptomData.details.temperature,
              heartRate: symptomData.details.heartRate,
              bloodPressure: symptomData.details.bloodPressure,
            },
          } : undefined,
        },
        include: {
          details: true,
        },
      });

      // Get user's recent symptom history for context
      const recentSymptoms = await prisma.symptom.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: 20,
        select: {
          symptomName: true,
          severity: true,
          startedAt: true,
          endedAt: true,
          status: true,
          bodyLocation: true,
        },
      });

      // Map to match HistoricalSymptom type
      const historyData = recentSymptoms.map((s: any) => ({
        symptomName: s.symptomName,
        severity: s.severity,
        startedAt: s.startedAt,
        endedAt: s.endedAt || undefined,
        status: s.status,
        bodyLocation: s.bodyLocation || undefined,
      }));

      // Perform enhanced triage assessment with AI
      const triageResult = await enhancedTriageService.assessSymptom({
        symptomName: symptom.symptomName,
        severity: symptom.severity,
        bodyLocation: symptom.bodyLocation || undefined,
        characteristic: symptom.details?.characteristic || undefined,
        frequency: symptom.details?.frequency || undefined,
        temperature: symptom.details?.temperature || undefined,
        heartRate: symptom.details?.heartRate || undefined,
        bloodPressure: symptom.details?.bloodPressure || undefined,
        triggers: symptom.details?.triggers || undefined,
        alleviatingFactors: symptom.details?.alleviatingFactors || undefined,
        aggravatingFactors: symptom.details?.aggravatingFactors || undefined,
        notes: symptom.details?.notes || undefined,
      }, historyData);

      // Save triage assessment with AI insights
      const assessment = await prisma.triageAssessment.create({
        data: {
          symptomId: symptom.id,
          urgencyLevel: triageResult.urgencyLevel,
          score: triageResult.score,
          reasoning: triageResult.reasoning,
          recommendation: triageResult.recommendation,
          redFlags: triageResult.redFlags,
          aiInsights: triageResult.aiInsights || null,
          patternAnalysis: triageResult.patternAnalysis || null,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          symptom,
          triage: assessment,
        },
        message: 'Symptom logged successfully.',
      });
    } catch (error) {
      console.error('Create symptom error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create symptom.',
      });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { status, limit = '50', offset = '0' } = req.query;

      const symptoms = await prisma.symptom.findMany({
        where: {
          userId,
          ...(status ? { status: status as any } : {}),
        },
        include: {
          details: true,
          triageAssessments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          treatments: true,
        },
        orderBy: { startedAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });

      const total = await prisma.symptom.count({
        where: {
          userId,
          ...(status ? { status: status as any } : {}),
        },
      });

      res.status(200).json({
        success: true,
        data: {
          symptoms,
          pagination: {
            total,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
          },
        },
      });
    } catch (error) {
      console.error('Get symptoms error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve symptoms.',
      });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const symptom = await prisma.symptom.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          details: true,
          triageAssessments: {
            orderBy: { createdAt: 'desc' },
          },
          treatments: true,
          attachments: true,
        },
      });

      if (!symptom) {
        res.status(404).json({
          success: false,
          error: 'Symptom not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: symptom,
      });
    } catch (error) {
      console.error('Get symptom error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve symptom.',
      });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updateData = req.body;

      // Verify ownership
      const existingSymptom = await prisma.symptom.findFirst({
        where: { id, userId },
      });

      if (!existingSymptom) {
        res.status(404).json({
          success: false,
          error: 'Symptom not found.',
        });
        return;
      }

      const symptom = await prisma.symptom.update({
        where: { id },
        data: {
          ...(updateData.symptomName && { symptomName: updateData.symptomName }),
          ...(updateData.bodyLocation && { bodyLocation: updateData.bodyLocation }),
          ...(updateData.severity && { severity: updateData.severity }),
          ...(updateData.status && { status: updateData.status }),
          ...(updateData.endedAt && { endedAt: new Date(updateData.endedAt) }),
        },
        include: {
          details: true,
          triageAssessments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      res.status(200).json({
        success: true,
        data: symptom,
        message: 'Symptom updated successfully.',
      });
    } catch (error) {
      console.error('Update symptom error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update symptom.',
      });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      // Verify ownership
      const symptom = await prisma.symptom.findFirst({
        where: { id, userId },
      });

      if (!symptom) {
        res.status(404).json({
          success: false,
          error: 'Symptom not found.',
        });
        return;
      }

      await prisma.symptom.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Symptom deleted successfully.',
      });
    } catch (error) {
      console.error('Delete symptom error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete symptom.',
      });
    }
  }

  static async getTimeline(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { startDate, endDate } = req.query;

      const where: any = { userId };

      if (startDate || endDate) {
        where.startedAt = {};
        if (startDate) where.startedAt.gte = new Date(startDate as string);
        if (endDate) where.startedAt.lte = new Date(endDate as string);
      }

      const symptoms = await prisma.symptom.findMany({
        where,
        include: {
          details: true,
          triageAssessments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { startedAt: 'asc' },
      });

      // Group by date
      type SymptomWithRelations = typeof symptoms[number];
    interface TimelineAccumulator {
      [date: string]: SymptomWithRelations[];
    }

    const timeline: TimelineAccumulator = (symptoms as SymptomWithRelations[]).reduce<TimelineAccumulator>(
      (acc: TimelineAccumulator, symptom: SymptomWithRelations): TimelineAccumulator => {
        const date: string = new Date(symptom.startedAt).toISOString().split('T')[0];
        if (!acc[date]) {
        acc[date] = [];
        }
        acc[date].push(symptom);
        return acc;
      },
      {}
    );

      res.status(200).json({
        success: true,
        data: timeline,
      });
    } catch (error) {
      console.error('Get timeline error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve timeline.',
      });
    }
  }
}