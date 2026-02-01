import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/authMiddleware.js';
import prisma from '../../config/prisma.js';
import { successResponse } from '../../utils/response.js';

const router = Router();

// Todas las rutas requieren autenticación y rol ADMIN
router.use(requireAuth);
router.use(requireRole('ADMIN'));

// Ejemplo: Listar todos los usuarios (solo admin)
router.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { tasks: true },
        },
      },
    });
    res.json(successResponse(users));
  } catch (error) {
    next(error);
  }
});

// Ejemplo: Estadísticas generales (solo admin)
router.get('/stats', async (_req, res, next) => {
  try {
    const [totalUsers, totalTasks, completedTasks] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.task.count({ where: { completed: true } }),
    ]);

    const stats = {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
    };

    res.json(successResponse(stats));
  } catch (error) {
    next(error);
  }
});

export default router;
