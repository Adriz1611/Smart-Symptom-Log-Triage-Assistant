import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from '../types';
import config from '../config/env';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid token.',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          error: 'Token expired. Please refresh your token.',
        });
        return;
      }
      res.status(401).json({
        success: false,
        error: 'Invalid token.',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error.',
    });
  }
};
