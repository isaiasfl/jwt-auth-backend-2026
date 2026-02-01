import type { Request, Response, NextFunction } from 'express';
import { TasksService } from './tasks.service.js';
import { successResponse } from '../../utils/response.js';
import type { CreateTaskInput, UpdateTaskInput, GetTasksQuery } from './tasks.schemas.js';

const tasksService = new TasksService();

export class TasksController {
  async getTasks(
    req: Request<object, object, object, GetTasksQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const result = await tasksService.getTasks(userId, req.query);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const task = await tasksService.getTaskById(req.params.id, userId);
      res.json(successResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async createTask(
    req: Request<object, object, CreateTaskInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const task = await tasksService.createTask(userId, req.body);
      res.status(201).json(successResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: Request<{ id: string }, object, UpdateTaskInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const task = await tasksService.updateTask(req.params.id, userId, req.body);
      res.json(successResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const result = await tasksService.deleteTask(req.params.id, userId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}
