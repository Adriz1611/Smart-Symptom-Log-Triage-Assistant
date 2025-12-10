import { Router } from 'express';
import { body } from 'express-validator';
import { SymptomController } from '../controllers/symptom.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create symptom
router.post(
  '/',
  validate([
    body('symptomName').trim().notEmpty().withMessage('Symptom name is required'),
    body('severity')
      .isInt({ min: 1, max: 10 })
      .withMessage('Severity must be between 1 and 10'),
    body('bodyLocation').optional().trim(),
    body('startedAt').optional().isISO8601(),
    body('details.characteristic').optional().trim(),
    body('details.frequency').optional().trim(),
    body('details.temperature').optional().isFloat(),
    body('details.heartRate').optional().isInt({ min: 30, max: 250 }),
  ]),
  SymptomController.create
);

// Get all symptoms
router.get('/', SymptomController.getAll);

// Seed symptoms for testing
router.post('/seed', SymptomController.seedSymptoms);

// Get timeline
router.get('/timeline', SymptomController.getTimeline);

// Get symptom by ID
router.get('/:id', SymptomController.getById);

// Update symptom
router.put('/:id', SymptomController.update);

// Delete symptom
router.delete('/:id', SymptomController.delete);

export default router;
