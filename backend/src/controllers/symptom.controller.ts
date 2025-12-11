import { Response } from 'express';
import { AuthRequest, SymptomCreateData } from '../types';
import prisma from '../config/database';
import { enhancedTriageService } from '../services/enhanced-triage.service';
import { SymptomStatus, UrgencyLevel } from '@prisma/client';

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
      const { status, limit, offset = '0' } = req.query;

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
        ...(limit ? { take: parseInt(limit as string) } : {}),
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
            limit: limit ? parseInt(limit as string) : null,
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

  static async seedSymptoms(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      
      console.log('🌱 Starting seed process for user:', userId);
      
      // Symptom data for seeding
      const symptomNames = [
        'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue', 'Nausea', 'Dizziness',
        'Back Pain', 'Chest Pain', 'Abdominal Pain', 'Joint Pain', 'Muscle Ache',
        'Shortness of Breath', 'Runny Nose', 'Congestion', 'Sneezing', 'Chills',
        'Night Sweats', 'Loss of Appetite', 'Insomnia', 'Anxiety', 'Depression',
        'Stomach Cramps', 'Diarrhea', 'Constipation', 'Bloating', 'Heartburn',
        'Rash', 'Itching', 'Dry Skin', 'Acne', 'Swelling', 'Bruising',
        'Tingling', 'Numbness', 'Weakness', 'Tremors', 'Vertigo', 'Earache',
        'Vision Problems', 'Eye Pain', 'Toothache', 'Gum Pain', 'Jaw Pain',
        'Neck Pain', 'Shoulder Pain', 'Elbow Pain', 'Wrist Pain', 'Hip Pain',
        'Knee Pain', 'Ankle Pain', 'Foot Pain', 'Migraine', 'Tension Headache'
      ];

      const bodyLocations = [
        'Head', 'Forehead', 'Temples', 'Back of Head', 'Neck', 'Throat',
        'Chest', 'Upper Back', 'Lower Back', 'Abdomen', 'Stomach',
        'Left Shoulder', 'Right Shoulder', 'Left Arm', 'Right Arm',
        'Left Elbow', 'Right Elbow', 'Left Wrist', 'Right Wrist',
        'Left Hip', 'Right Hip', 'Left Knee', 'Right Knee',
        'Left Ankle', 'Right Ankle', 'Left Foot', 'Right Foot',
        'Eyes', 'Ears', 'Nose', 'Mouth', 'Jaw', 'Whole Body'
      ];

      const statuses: SymptomStatus[] = ['ACTIVE', 'IMPROVING', 'WORSENING', 'RESOLVED', 'MONITORING'];
      const urgencyLevels: UrgencyLevel[] = ['EMERGENCY', 'URGENT', 'SEMI_URGENT', 'NON_URGENT', 'SELF_CARE'];

      const notes = [
        'Started after waking up', 'Got worse after eating', 'Improved with rest',
        'Triggered by stress', 'Occurred during exercise', 'Worse in the evening',
        'Better in the morning', 'Associated with weather change', 'Started after work',
        'Improved with medication', 'Persistent throughout the day', 'Comes and goes',
        'Sharp and sudden onset', 'Gradual onset', 'Dull and constant',
        'Throbbing pain', 'Burning sensation', 'Stabbing pain',
        'Radiating to other areas', 'Limited mobility'
      ];

      // Medication data for seeding
      const medications = [
        { name: 'Ibuprofen', dosage: '400mg', purpose: 'Pain relief and inflammation', timeSlots: ['08:00', '20:00'] },
        { name: 'Paracetamol', dosage: '500mg', purpose: 'Fever and pain relief', timeSlots: ['09:00', '15:00', '21:00'] },
        { name: 'Amoxicillin', dosage: '250mg', purpose: 'Bacterial infection treatment', timeSlots: ['08:00', '14:00', '20:00'] },
        { name: 'Omeprazole', dosage: '20mg', purpose: 'Acid reflux and heartburn', timeSlots: ['07:00'] },
        { name: 'Metformin', dosage: '500mg', purpose: 'Blood sugar control', timeSlots: ['08:00', '20:00'] },
        { name: 'Lisinopril', dosage: '10mg', purpose: 'Blood pressure management', timeSlots: ['08:00'] },
        { name: 'Atorvastatin', dosage: '20mg', purpose: 'Cholesterol management', timeSlots: ['21:00'] },
        { name: 'Levothyroxine', dosage: '75mcg', purpose: 'Thyroid hormone replacement', timeSlots: ['06:30'] },
        { name: 'Cetirizine', dosage: '10mg', purpose: 'Allergy relief', timeSlots: ['22:00'] },
        { name: 'Vitamin D3', dosage: '1000IU', purpose: 'Bone health and immunity', timeSlots: ['08:00'] },
        { name: 'Aspirin', dosage: '81mg', purpose: 'Cardiovascular protection', timeSlots: ['08:00'] },
        { name: 'Montelukast', dosage: '10mg', purpose: 'Asthma and allergy control', timeSlots: ['21:00'] },
      ];

      const doctors = [
        'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez',
        'Dr. James Wilson', 'Dr. Patricia Brown', 'Dr. David Lee'
      ];

      const sideEffects = [
        ['Mild nausea', 'Drowsiness'],
        ['Stomach upset', 'Headache'],
        ['Dizziness', 'Dry mouth'],
        []
      ];

      const getRandomElement = <T>(array: T[]): T => 
        array[Math.floor(Math.random() * array.length)];

      const getRandomInt = (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      const getRandomDate = (start: Date, end: Date): Date =>
        new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

      const yearStart = new Date('2025-01-01');
      const yearEnd = new Date('2025-12-31');
      const createdCount = 100;

      // Create symptoms in batches for better performance
      const symptoms = [];
      for (let i = 0; i < createdCount; i++) {
        const symptomName = getRandomElement(symptomNames);
        const bodyLocation = getRandomElement(bodyLocations);
        const severity = getRandomInt(1, 10);
        const status = getRandomElement(statuses);
        const startedAt = getRandomDate(yearStart, yearEnd);

        symptoms.push({
          userId,
          symptomName,
          bodyLocation,
          severity,
          status,
          startedAt,
          createdAt: startedAt,
          updatedAt: startedAt,
        });
      }

      // Bulk create symptoms
      console.log('📝 Creating symptoms...');
      await prisma.symptom.createMany({
        data: symptoms,
      });
      console.log(`✅ Created ${createdCount} symptoms`);

      // Get the created symptoms to add details
      console.log('🔍 Fetching created symptoms...');
      const createdSymptoms = await prisma.symptom.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: createdCount,
      });
      console.log(`✅ Found ${createdSymptoms.length} symptoms`);

      // Add details and triage assessments
      console.log('📋 Adding symptom details and triage assessments...');
      let detailsCount = 0;
      let triageCount = 0;
      
      for (const symptom of createdSymptoms) {
        try {
          // Add symptom details
          await prisma.symptomDetail.create({
            data: {
              symptomId: symptom.id,
              notes: getRandomElement(notes),
              characteristic: getRandomElement(['Sharp', 'Dull', 'Throbbing', 'Burning', 'Aching', 'Stabbing']),
              frequency: getRandomElement(['Constant', 'Intermittent', 'Occasional', 'Frequent']),
            }
          });
          detailsCount++;

          // Add triage assessment
          const urgencyLevel = getRandomElement(urgencyLevels);
          await prisma.triageAssessment.create({
            data: {
              symptomId: symptom.id,
              urgencyLevel,
              recommendation: `Based on severity ${symptom.severity}/10, seek ${urgencyLevel.toLowerCase().replace('_', ' ')} medical attention.`,
              redFlags: symptom.severity >= 8 ? ['High severity symptom', 'Requires immediate attention'] : [],
            }
          });
          triageCount++;
        } catch (detailError) {
          console.error(`❌ Error adding details for symptom ${symptom.id}:`, detailError);
          // Continue with other symptoms instead of failing completely
        }
      }
      console.log(`✅ Added ${detailsCount} symptom details and ${triageCount} triage assessments`);

      // ========== SEED MEDICATIONS ==========
      console.log('💊 Creating medications...');
      let medicationCount = 0;
      let medicationLogCount = 0;

      for (let i = 0; i < medications.length; i++) {
        try {
        const medData = medications[i];
        const medicationStatus = i < 10 ? 'ACTIVE' : i === 10 ? 'PAUSED' : 'DISCONTINUED';
        const startDate = getRandomDate(new Date('2025-01-01'), new Date('2025-06-01'));
        const endDate = medicationStatus === 'DISCONTINUED' ? getRandomDate(startDate, new Date()) : null;

        const medication = await prisma.medication.create({
          data: {
            userId,
            name: medData.name,
            dosage: medData.dosage,
            frequency: medData.timeSlots.length === 1 ? 'Once daily' : 
                       medData.timeSlots.length === 2 ? 'Twice daily' : 
                       medData.timeSlots.length === 3 ? 'Three times daily' : 'As needed',
            timeSlots: medData.timeSlots,
            startDate,
            endDate,
            purpose: medData.purpose,
            prescribedBy: getRandomElement(doctors),
            sideEffects: getRandomElement(sideEffects),
            notes: `${medData.purpose}. Take with ${Math.random() > 0.5 ? 'food' : 'water'}.`,
            reminderEnabled: Math.random() > 0.3,
            status: medicationStatus,
          }
        });

        medicationCount++;

          // Create medication logs for the past 30 days (only for ACTIVE medications)
          if (medicationStatus === 'ACTIVE') {
            for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
              const logDate = new Date();
              logDate.setDate(logDate.getDate() - dayOffset);
              
              for (const timeSlot of medData.timeSlots) {
                const [hours, minutes] = timeSlot.split(':').map(Number);
                const scheduledTime = new Date(logDate);
                scheduledTime.setHours(hours, minutes, 0, 0);

                // Only create logs for dates after medication start date
                if (scheduledTime >= startDate) {
                  // 85% taken, 10% skipped, 5% pending (for today's future doses)
                  const isPending = dayOffset === 0 && scheduledTime > new Date();
                  const status = isPending ? 'PENDING' as const : 
                               Math.random() < 0.85 ? 'TAKEN' as const : 
                               Math.random() < 0.67 ? 'SKIPPED' as const : 'MISSED' as const;

                  const takenAt = status === 'TAKEN' ? 
                    new Date(scheduledTime.getTime() + getRandomInt(-15, 30) * 60000) : // Within ±15-30 min
                    null;

                  await prisma.medicationLog.create({
                    data: {
                      medicationId: medication.id,
                      scheduledTime,
                      takenAt,
                      status,
                      notes: status === 'SKIPPED' ? 'Forgot to take' : 
                             status === 'MISSED' ? 'Was not at home' :
                             status === 'TAKEN' ? 'Taken as scheduled' : undefined,
                    }
                  });

                  medicationLogCount++;
                }
              }
            }
          }
        } catch (medError) {
          console.error(`❌ Error creating medication ${medData.name}:`, medError);
          // Continue with other medications
        }
      }
      
      console.log(`✅ Created ${medicationCount} medications with ${medicationLogCount} logs`);

      console.log('🎉 Seed process completed successfully!');
      
      res.status(200).json({
        success: true,
        message: `Successfully created ${createdCount} symptoms and ${medicationCount} medications`,
        data: {
          symptoms: {
            count: createdCount,
            dateRange: {
              start: yearStart.toISOString().split('T')[0],
              end: yearEnd.toISOString().split('T')[0],
            }
          },
          medications: {
            count: medicationCount,
            logs: medicationLogCount
          }
        }
      });
    } catch (error) {
      console.error('Seed symptoms error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      console.error('Error details:', { errorMessage, errorStack });
      
      res.status(500).json({
        success: false,
        error: 'Failed to seed symptoms.',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Failed to seed symptoms.',
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      });
    }
  }
}