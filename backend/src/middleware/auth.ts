import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.DEMO_MODE === 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT with Supabase
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
