import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { successResponse } from '../../utils/response.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

const authService = new AuthService();

export class AuthController {
  async register(
    req: Request<object, object, RegisterInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request<object, object, LoginInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.login(req.body);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await authService.getMe(userId);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }
}
