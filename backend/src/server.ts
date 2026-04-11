import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import pinoHttp from 'pino-http';

import { logger } from './logger';
import balancesRoutes from './routes/balances';
import choreRoutes from './routes/chore';
import familyRoutes from './routes/family';
import kioskRoutes from './routes/kiosk';
import parentRoutes from './routes/parent';
import transactionsRoutes from './routes/transactions';

export const app: Application = express();

app.use(cors({ origin: process.env.FRONTEND_DOMAIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'success' });
});

app.use('/chore', choreRoutes);
app.use('/family', familyRoutes);
app.use('/kiosk', kioskRoutes);
app.use('/parent', parentRoutes);

// Legacy routes
app.use('/transactions', transactionsRoutes);
app.use('/balances', balancesRoutes);
