import type { Request, Response, NextFunction } from 'express';
import { getUserFromRequest } from '../lib/supabase.js';

declare global {
  // augment Express Request with userId
  namespace Express {
    interface Request { userId?: string }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = await getUserFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = userId;
    next();
  } catch (e) {
    console.error('Auth error', e);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
