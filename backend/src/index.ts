import express from 'express';
import cors from 'cors';
import monitorsRouter from './api/monitors.js';
import { requireAuth } from './middleware/auth.js';
import { startScheduler } from './worker/scheduler.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Protected routes
app.use('/api/monitor', requireAuth, monitorsRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});

// Start scheduler in the same process for simplicity
startScheduler();
