import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error';
import type { AuthUser } from '../types/api';

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(401, 'Access token required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError(403, 'Invalid or expired token');
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    throw new AppError(403, 'Admin access required');
  }
  next();
};

export const requireManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'MANAGER' && req.user?.role !== 'ADMIN') {
    throw new AppError(403, 'Manager or Admin access required');
  }
  next();
};
