import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

import patientRoutes from './routes/patientRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import scenarioRoutes from './routes/scenarioRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/health', healthRoutes);

// Root greeting
app.get('/', (_req, res) => {
  res.json({
    service: 'LeadlessGuard / HealthHeart Clinical Telemetry Engine',
    version: '1.0.0',
    status: 'ONLINE',
  });
});

// Start Server & Connect Database
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`[LeadlessGuard Server] Running on http://localhost:${PORT}`);
  });
};

startServer();
