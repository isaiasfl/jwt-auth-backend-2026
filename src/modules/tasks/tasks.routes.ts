import { Router } from 'express';
import { TasksController } from './tasks.controller.js';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
  deleteTaskSchema,
  getTasksQuerySchema,
} from './tasks.schemas.js';

const router = Router();
const tasksController = new TasksController();

// Todas las rutas requieren autenticación
router.use(requireAuth);

router.get('/', validateRequest(getTasksQuerySchema), (req, res, next) =>
  tasksController.getTasks(req, res, next)
);

router.get('/:id', validateRequest(getTaskSchema), (req, res, next) =>
  tasksController.getTaskById(req, res, next)
);

router.post('/', validateRequest(createTaskSchema), (req, res, next) =>
  tasksController.createTask(req, res, next)
);

router.put('/:id', validateRequest(updateTaskSchema), (req, res, next) =>
  tasksController.updateTask(req, res, next)
);

router.delete('/:id', validateRequest(deleteTaskSchema), (req, res, next) =>
  tasksController.deleteTask(req, res, next)
);

export default router;
