import { Request, Response, NextFunction } from 'express';
import { 
  PrismaClientKnownRequestError, 
  PrismaClientValidationError 
} from '@prisma/client/runtime/library';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: 'A record with this unique field already exists.',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Record not found.',
      });
      return;
    }
  }

  if (err instanceof PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: 'Invalid data provided.',
    });
    return;
  }

  // Custom operational errors
  if (err.isOperational) {
    res.status(err.statusCode || 400).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred.' 
      : err.message,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found.`,
  });
};