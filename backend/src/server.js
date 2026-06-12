import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, syncDatabase } from './models/index.js';
import templateRoutes from './routes/templates.js';
import recommendationRoutes from './routes/recommendations.js';
import activityRoutes from './routes/activity.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/activity', activityRoutes);

async function start() {
  await syncDatabase();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start();
