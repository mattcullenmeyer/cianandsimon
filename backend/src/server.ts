import cors from 'cors';
import express, { Application } from 'express';
import pinoHttp from 'pino-http';

import { logger } from './logger';
import balancesRoutes from './routes/balances';
import transactionsRoutes from './routes/transactions';

export const app: Application = express();

app.use(cors({ origin: process.env.FRONTEND_DOMAIN }));
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'success' });
});

app.use('/balances', balancesRoutes);
app.use('/transactions', transactionsRoutes);
