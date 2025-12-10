import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest, RegisterData, LoginCredentials } from '../types';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';

export class AuthController {
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, name, dateOfBirth }: RegisterData = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists.',
        });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          dateOfBirth: true,
          createdAt: true,
        },
      });

      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
          refreshToken,
        },
        message: 'User registered successfully.',
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed.',
      });
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password }: LoginCredentials = req.body;
      console.log('Login attempt for email:', email);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log('User not found:', email);
        res.status(401).json({
          success: false,
          error: 'Invalid credentials.',
        });
        return;
      }

      console.log('User found, verifying password...');
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        res.status(401).json({
          success: false,
          error: 'Invalid credentials.',
        });
        return;
      }

      console.log('Password valid, generating tokens...');
      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      console.log('Login successful for user:', email);
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
          },
          accessToken,
          refreshToken,
        },
        message: 'Login successful.',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed.',
      });
    }
  }

  static async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token required.',
        });
        return;
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token.',
        });
        return;
      }

      // Generate new access token
      const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

      res.status(200).json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token.',
      });
    }
  }

  static async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logout successful.',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Logout failed.',
      });
    }
  }
}
