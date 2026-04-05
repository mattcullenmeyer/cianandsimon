import { Router } from 'express';
import { z } from 'zod';

import { IANA_TIMEZONES } from '../constants';
import { requireParentAuth, requireFamilyAuth } from '../middleware/auth';
import { addChild, createFamily, getChildren } from '../services/family';

const router: Router = Router();

const createFamilySchema = z.object({
  name: z.string().min(1),
  timezone: z.string().refine((tz) => IANA_TIMEZONES.has(tz), {
    message: 'Invalid timezone',
  }),
});

router.post('/', requireParentAuth, async (req, res) => {
  const result = createFamilySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { name, timezone } = result.data;
  const { parentId } = res.locals;

  const familyId = await createFamily({ parentId, name, timezone });
  if (!familyId) {
    res.status(409).json({ error: 'Family already exists' });
    return;
  }

  res.status(201).json({ familyId });
});

const createChildSchema = z.object({
  name: z.string().min(1),
});

router.post('/child', requireFamilyAuth, async (req, res) => {
  const result = createChildSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { name } = result.data;
  const { parentId, familyId } = res.locals;

  const childId = await addChild({ familyId, parentId, name });
  res.status(201).json({ childId });
});

router.get('/children', requireFamilyAuth, async (_req, res) => {
  const { familyId } = res.locals;
  const children = await getChildren(familyId);
  res.status(200).json({ children });
});

export default router;
