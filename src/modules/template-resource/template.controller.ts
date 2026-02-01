import type { Request, Response, NextFunction } from 'express';
import { TemplateService } from './template.service.js';
import { successResponse } from '../../utils/response.js';
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  GetTemplatesQuery,
} from './template.schemas.js';

const templateService = new TemplateService();

export class TemplateController {
  async getTemplates(
    req: Request<object, object, object, GetTemplatesQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const result = await templateService.getTemplates(userId, req.query);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getTemplateById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const template = await templateService.getTemplateById(req.params.id, userId);
      res.json(successResponse(template));
    } catch (error) {
      next(error);
    }
  }

  async createTemplate(
    req: Request<object, object, CreateTemplateInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const template = await templateService.createTemplate(userId, req.body);
      res.status(201).json(successResponse(template));
    } catch (error) {
      next(error);
    }
  }

  async updateTemplate(
    req: Request<{ id: string }, object, UpdateTemplateInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const template = await templateService.updateTemplate(
        req.params.id,
        userId,
        req.body
      );
      res.json(successResponse(template));
    } catch (error) {
      next(error);
    }
  }

  async deleteTemplate(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const result = await templateService.deleteTemplate(req.params.id, userId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}
