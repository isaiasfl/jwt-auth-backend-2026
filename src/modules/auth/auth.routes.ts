import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { registerSchema, loginSchema } from './auth.schemas.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validateRequest(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.get('/me', requireAuth, (req, res, next) =>
  authController.getMe(req, res, next)
);

export default router;
