import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { initDatabase } from './services/dbService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security & Logging Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://*.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Mount Core API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'AgroSmart AI Backend API',
    status: 'online',
    version: '1.2.0',
    documentation: '/api/metadata',
    health: '/api/health'
  });
});

// Centralized 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[AgroSmart AI Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected agronomic calculation error occurred.'
  });
});

// Start Server & Connect Database
async function startServer() {
  await initDatabase();
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌾 AgroSmart AI Backend listening on http://0.0.0.0:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Crops API: http://localhost:${PORT}/api/crops`);
  });
}

startServer().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
