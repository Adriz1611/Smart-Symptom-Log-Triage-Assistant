import express from 'express';
import { MedicationController } from '../controllers/medication.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const medicationController = new MedicationController();

// All routes require authentication
router.use(authenticate);

// Medication CRUD
router.post('/', (req, res) => medicationController.createMedication(req, res));
router.get('/', (req, res) => medicationController.getMedications(req, res));
router.get('/stats', (req, res) => medicationController.getMedicationStats(req, res));
router.get('/:id', (req, res) => medicationController.getMedicationById(req, res));
router.put('/:id', (req, res) => medicationController.updateMedication(req, res));
router.delete('/:id', (req, res) => medicationController.deleteMedication(req, res));

// Medication logging
router.post('/logs/:logId/intake', (req, res) => medicationController.logIntake(req, res));

// Background job endpoint (could be called by cron)
router.post('/jobs/create-daily-logs', (req, res) => medicationController.createDailyLogs(req, res));

export default router;
