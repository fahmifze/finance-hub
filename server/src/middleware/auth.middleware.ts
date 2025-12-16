import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { sendUnauthorized } from '../utils/response';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendUnauthorized(res, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return sendUnauthorized(res, 'Invalid or expired token');
  }
}

// Optional authentication - doesn't fail if no token, but sets user if valid token exists
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
  } catch (error) {
    // Invalid token, continue without user (don't fail)
  }

  next();
}
