import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import entityRoutes from './routes/entityRoutes';
import incidentRoutes from './routes/incidentRoutes';
import locationRoutes from './routes/locationRoutes';
import authRoutes from './routes/authRoutes';
import suggestionRoutes from './routes/suggestionRoutes';
import voteRoutes from './routes/voteRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'https://prismatic-gumption-e04f83.netlify.app',
    'https://*.netlify.app'
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    const entityCount = await prisma.entity.count();
    await prisma.$disconnect();
    res.json({ 
      status: 'ok', 
      message: 'Eerie API is running',
      database: 'connected',
      entities: entityCount
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Eerie API is running but database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌙 Eerie API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👻 Entities: http://localhost:${PORT}/api/entities`);
});

export default app;
