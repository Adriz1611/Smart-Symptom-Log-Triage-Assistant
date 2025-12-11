import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export class MedicationController {
  // Create new medication
  async createMedication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
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
  async getMedications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { status } = req.query;

      // Use IST timezone (UTC+5:30 for India)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);
      const today = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), 0, 0, 0, 0));
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      console.log('Fetching medications with logs between:', today.toISOString(), 'and', tomorrow.toISOString());
      console.log('IST date range:', new Date(today.getTime() + istOffset).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), 'to', new Date(tomorrow.getTime() + istOffset).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

      const medications = await prisma.medication.findMany({
        where: {
          userId,
          ...(status && { status: status as any })
        },
        include: {
          logs: {
            where: {
              scheduledTime: {
                gte: today,
                lt: tomorrow
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

      console.log(`Found ${medications.length} medications`);
      medications.forEach(med => {
        console.log(`${med.name}: ${med.logs.length} logs for today`);
      });

      res.json(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      res.status(500).json({ error: 'Failed to fetch medications' });
    }
  }

  // Get single medication with full logs
  async getMedicationById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
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
        res.status(404).json({ error: 'Medication not found' });
        return;
      }

      res.json(medication);
    } catch (error) {
      console.error('Error fetching medication:', error);
      res.status(500).json({ error: 'Failed to fetch medication' });
    }
  }

  // Update medication
  async updateMedication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const medication = await prisma.medication.findFirst({
        where: { id, userId: userId! }
      });

      if (!medication) {
        res.status(404).json({ error: 'Medication not found' });
        return;
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
  async deleteMedication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const medication = await prisma.medication.findFirst({
        where: { id, userId: userId! }
      });

      if (!medication) {
        res.status(404).json({ error: 'Medication not found' });
        return;
      }

      await prisma.medication.delete({ where: { id } });

      res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
      console.error('Error deleting medication:', error);
      res.status(500).json({ error: 'Failed to delete medication' });
    }
  }

  // Log medication intake
  async logIntake(req: AuthRequest, res: Response): Promise<void> {
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
  async getMedicationStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
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
      const activeMedications = medications.filter((m: any) => m.status === 'ACTIVE').length;

      let totalLogs = 0;
      let takenLogs = 0;
      let missedLogs = 0;

      medications.forEach((med: any) => {
        totalLogs += med.logs.length;
        takenLogs += med.logs.filter((l: any) => l.status === 'TAKEN').length;
        missedLogs += med.logs.filter((l: any) => l.status === 'MISSED').length;
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
    // Use IST timezone (UTC+5:30 for India)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    const today = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), 0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    console.log(`Creating logs for medication ${medicationId}`);
    console.log(`Today range (IST): ${new Date(today.getTime() + istOffset).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} to ${new Date(tomorrow.getTime() + istOffset).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

    // Check for existing logs today to avoid duplicates
    const existingLogs = await prisma.medicationLog.findMany({
      where: {
        medicationId,
        scheduledTime: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const existingTimes = new Set(
      existingLogs.map(log => {
        // Convert UTC stored time to IST for comparison
        const istTime = new Date(log.scheduledTime.getTime() + istOffset);
        return `${istTime.getUTCHours().toString().padStart(2, '0')}:${istTime.getUTCMinutes().toString().padStart(2, '0')}`;
      })
    );

    console.log(`Found ${existingLogs.length} existing logs with times:`, Array.from(existingTimes));

    const logs = timeSlots
      .filter(time => {
        const filtered = !existingTimes.has(time);
        console.log(`Time slot ${time}: ${filtered ? 'will create' : 'already exists'}`);
        return filtered;
      })
      .map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        // Create a date in IST timezone, then convert to UTC for storage
        const istDate = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), hours, minutes, 0, 0));
        const scheduledTime = new Date(istDate.getTime() - (5.5 * 60 * 60 * 1000)); // Convert IST to UTC

        console.log(`Creating log for ${time} (IST) -> UTC: ${scheduledTime.toISOString()}`);

        return {
          medicationId,
          scheduledTime,
          status: 'PENDING' as const
        };
      });

    if (logs.length > 0) {
      console.log(`Inserting ${logs.length} new logs`);
      const created = await prisma.medicationLog.createMany({ 
        data: logs,
        skipDuplicates: true 
      });
      console.log(`Created ${created.count} logs`);
    } else {
      console.log('No new logs to create');
    }
  }

  // Background job: Create daily medication logs
  async createDailyLogs(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const activeMedications = await prisma.medication.findMany({
        where: { status: 'ACTIVE', reminderEnabled: true }
      });

      // Use IST timezone (UTC+5:30 for India)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);
      const today = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), 0, 0, 0, 0));
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

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

  // Clean duplicate logs (remove duplicates with same medication and scheduled time)
  async cleanDuplicateLogs(_req: AuthRequest, res: Response): Promise<void> {
    try {
      // Use IST timezone (UTC+5:30 for India)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);
      const today = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), 0, 0, 0, 0));
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      // Get all logs for today
      const allLogs = await prisma.medicationLog.findMany({
        where: {
          scheduledTime: {
            gte: today,
            lt: tomorrow
          }
        },
        orderBy: [
          { medicationId: 'asc' },
          { scheduledTime: 'asc' },
          { createdAt: 'asc' }
        ]
      });

      const seenKeys = new Set<string>();
      const duplicateIds: string[] = [];

      for (const log of allLogs) {
        const key = `${log.medicationId}-${log.scheduledTime.toISOString()}`;
        if (seenKeys.has(key)) {
          duplicateIds.push(log.id);
        } else {
          seenKeys.add(key);
        }
      }

      if (duplicateIds.length > 0) {
        await prisma.medicationLog.deleteMany({
          where: { id: { in: duplicateIds } }
        });
        res.json({ 
          message: `Removed ${duplicateIds.length} duplicate log(s)`,
          count: duplicateIds.length 
        });
      } else {
        res.json({ message: 'No duplicates found', count: 0 });
      }
    } catch (error) {
      console.error('Error cleaning duplicate logs:', error);
      res.status(500).json({ error: 'Failed to clean duplicate logs' });
    }
  }
}
