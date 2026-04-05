import { Router } from 'express';
import { z } from 'zod';

import { requireParentAuth } from '../middleware/auth';
import { loginParent, selectFamily, signupParent } from '../services/parent';

const router: Router = Router();

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

router.post('/signup', async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { email, password } = result.data;
  const parentId = await signupParent({ email, password });
  if (!parentId) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  res.status(201).json({ parentId });
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { email, password } = result.data;
  const loginResult = await loginParent({ email, password });
  if (!loginResult) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.status(200).json(loginResult);
});

const selectFamilySchema = z.object({
  familyId: z.string().min(1),
});

router.post('/select-family', requireParentAuth, async (req, res) => {
  const result = selectFamilySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { familyId } = result.data;
  const { parentId } = res.locals;

  const token = await selectFamily({ parentId, familyId });
  if (!token) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  res.status(200).json({ token });
});

export default router;
