import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export function requireKioskAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.auth;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as {
      familyId?: string;
    };
    if (!payload.familyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.locals.familyId = payload.familyId;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireParentAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.auth;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as {
      parentId: string;
    };
    res.locals.parentId = payload.parentId;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireFamilyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.auth;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as {
      parentId: string;
      familyId?: string;
    };
    if (!payload.familyId) {
      res.status(403).json({ error: 'Family selection required' });
      return;
    }
    res.locals.parentId = payload.parentId;
    res.locals.familyId = payload.familyId;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
