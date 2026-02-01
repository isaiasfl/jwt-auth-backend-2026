import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { successResponse } from './utils/response.js';

// Importar rutas
import authRoutes from './modules/auth/auth.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Seguridad básica
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta más tarde',
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/health', (_req, res) => {
  res.json(
    successResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    })
  );
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/admin', adminRoutes);

// Ruta 404
app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Ruta no encontrada',
    },
  });
});

// Middleware de errores (debe ir al final)
app.use(errorMiddleware);

export default app;
