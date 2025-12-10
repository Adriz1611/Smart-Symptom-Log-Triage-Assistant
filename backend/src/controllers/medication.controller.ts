import { Request, Response } from 'express';
import { PrismaClient, MedicationStatus, MedicationLogStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class MedicationController {
  // Create new medication
  async createMedication(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        name,
        dosage,
        frequency,
        timeSlots,
        startDate,
        endDate,
        purpose,
        prescribedBy,
        sideEffects,
        notes,
        reminderEnabled
      } = req.body;

      const medication = await prisma.medication.create({
        data: {
          userId,
          name,
          dosage,
          frequency,
          timeSlots: timeSlots || [],
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          purpose,
          prescribedBy,
          sideEffects: sideEffects || [],
          notes,
          reminderEnabled: reminderEnabled ?? true,
          status: 'ACTIVE'
        }
      });

      // Create initial medication logs for today
      if (timeSlots && timeSlots.length > 0) {
        await this.createLogsForMedication(medication.id, timeSlots);
      }

      res.status(201).json(medication);
    } catch (error) {
      console.error('Error creating medication:', error);
      res.status(500).json({ error: 'Failed to create medication' });
    }
  }

  // Get all medications for user
  async getMedications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { status } = req.query;

      const medications = await prisma.medication.findMany({
        where: {
          userId,
          ...(status && { status: status as MedicationStatus })
        },
        include: {
          logs: {
            where: {
              scheduledTime: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999))
              }
            },
            orderBy: { scheduledTime: 'asc' }
          },
          _count: {
            select: { logs: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      res.status(500).json({ error: 'Failed to fetch medications' });
    }
  }

  // Get single medication with full logs
  async getMedicationById(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      const medication = await prisma.medication.findFirst({
        where: {
          id,
          userId: userId!
        },
        include: {
          logs: {
            orderBy: { scheduledTime: 'desc' },
            take: 50
          }
        }
      });

      if (!medication) {
        return res.status(404).json({ error: 'Medication not found' });
      }

      res.json(medication);
    } catch (error) {
      console.error('Error fetching medication:', error);
      res.status(500).json({ error: 'Failed to fetch medication' });
    }
  }

  // Update medication
  async updateMedication(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      const medication = await prisma.medication.findFirst({
        where: { id, userId: userId! }
      });

      if (!medication) {
        return res.status(404).json({ error: 'Medication not found' });
      }

      const updated = await prisma.medication.update({
        where: { id },
        data: req.body
      });

      res.json(updated);
    } catch (error) {
      console.error('Error updating medication:', error);
      res.status(500).json({ error: 'Failed to update medication' });
    }
  }

  // Delete medication
  async deleteMedication(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      const medication = await prisma.medication.findFirst({
        where: { id, userId: userId! }
      });

      if (!medication) {
        return res.status(404).json({ error: 'Medication not found' });
      }

      await prisma.medication.delete({ where: { id } });

      res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
      console.error('Error deleting medication:', error);
      res.status(500).json({ error: 'Failed to delete medication' });
    }
  }

  // Log medication intake
  async logIntake(req: Request, res: Response) {
    try {
      const { logId } = req.params;
      const { status, notes, effectiveness, sideEffectsNoted } = req.body;

      const log = await prisma.medicationLog.update({
        where: { id: logId },
        data: {
          status: status || 'TAKEN',
          takenAt: status === 'TAKEN' ? new Date() : null,
          notes,
          effectiveness,
          sideEffectsNoted: sideEffectsNoted || []
        }
      });

      res.json(log);
    } catch (error) {
      console.error('Error logging intake:', error);
      res.status(500).json({ error: 'Failed to log intake' });
    }
  }

  // Get medication statistics
  async getMedicationStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { days = 30 } = req.query;
      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const medications = await prisma.medication.findMany({
        where: { userId },
        include: {
          logs: {
            where: {
              scheduledTime: { gte: startDate }
            }
          }
        }
      });

      const totalMedications = medications.length;
      const activeMedications = medications.filter(m => m.status === 'ACTIVE').length;

      let totalLogs = 0;
      let takenLogs = 0;
      let missedLogs = 0;

      medications.forEach(med => {
        totalLogs += med.logs.length;
        takenLogs += med.logs.filter(l => l.status === 'TAKEN').length;
        missedLogs += med.logs.filter(l => l.status === 'MISSED').length;
      });

      const adherenceRate = totalLogs > 0 ? (takenLogs / totalLogs) * 100 : 0;

      res.json({
        totalMedications,
        activeMedications,
        adherenceRate: Math.round(adherenceRate * 10) / 10,
        totalDoses: totalLogs,
        takenDoses: takenLogs,
        missedDoses: missedLogs,
        period: `${daysNum} days`
      });
    } catch (error) {
      console.error('Error fetching medication stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }

  // Helper: Create logs for medication
  private async createLogsForMedication(medicationId: string, timeSlots: string[]) {
    const today = new Date();
    const logs = timeSlots.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledTime = new Date(today);
      scheduledTime.setHours(hours, minutes, 0, 0);

      return {
        medicationId,
        scheduledTime,
        status: 'PENDING' as MedicationLogStatus
      };
    });

    await prisma.medicationLog.createMany({ data: logs });
  }

  // Background job: Create daily medication logs
  async createDailyLogs(req: Request, res: Response) {
    try {
      const activeMedications = await prisma.medication.findMany({
        where: { status: 'ACTIVE', reminderEnabled: true }
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      for (const medication of activeMedications) {
        // Check if logs already exist for today
        const existingLogs = await prisma.medicationLog.findFirst({
          where: {
            medicationId: medication.id,
            scheduledTime: {
              gte: today,
              lt: tomorrow
            }
          }
        });

        if (!existingLogs && medication.timeSlots.length > 0) {
          await this.createLogsForMedication(medication.id, medication.timeSlots);
        }
      }

      res.json({ message: 'Daily logs created successfully' });
    } catch (error) {
      console.error('Error creating daily logs:', error);
      res.status(500).json({ error: 'Failed to create daily logs' });
    }
  }
}
