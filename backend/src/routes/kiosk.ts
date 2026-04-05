import { Router } from 'express';
import { z } from 'zod';

import { requireFamilyAuth } from '../middleware/auth';
import { createOtp, exchangeOtpForToken } from '../services/kiosk';

const router: Router = Router();

router.post('/otp', requireFamilyAuth, async (_req, res) => {
  const { familyId } = res.locals;
  const otp = await createOtp(familyId);
  res.status(201).json({ otp });
});

const exchangeOtpSchema = z.object({
  otp: z.string().length(6),
});

router.post('/token-exchange', async (req, res) => {
  const result = exchangeOtpSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { otp } = result.data;
  const token = await exchangeOtpForToken(otp);
  if (!token) {
    res.status(401).json({ error: 'Invalid or expired OTP' });
    return;
  }

  res.status(200).json({ token });
});

export default router;
