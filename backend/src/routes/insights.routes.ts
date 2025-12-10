import { Router } from 'express';
import { InsightsController } from '../controllers/insights.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/insights/generate
 * @desc    Generate new AI-powered long-term insights
 * @access  Private
 */
router.get('/generate', InsightsController.getLongTermInsights);

/**
 * @route   GET /api/insights
 * @desc    Get stored health insights
 * @access  Private
 */
router.get('/', InsightsController.getStoredInsights);

/**
 * @route   DELETE /api/insights/:id
 * @desc    Delete a health insight
 * @access  Private
 */
router.delete('/:id', InsightsController.deleteInsight);

export default router;
