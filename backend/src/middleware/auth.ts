import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userToken?: string;
  decodedToken?: Record<string, unknown>;
}

export function extractToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.userToken = authHeader.substring(7);
    try {
      req.decodedToken = jwt.decode(req.userToken) as Record<string, unknown>;
    } catch {
      req.decodedToken = undefined;
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.userToken) {
    res.status(401).json({ error: 'Unauthorized', message: 'No access token provided' });
    return;
  }
  next();
}

