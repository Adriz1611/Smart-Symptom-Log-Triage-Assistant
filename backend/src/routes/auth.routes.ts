import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Register
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  ]),
  AuthController.register
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  AuthController.login
);

// Refresh token
router.post(
  '/refresh',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ]),
  AuthController.refreshToken
);

// Logout
router.post('/logout', AuthController.logout);

export default router;
