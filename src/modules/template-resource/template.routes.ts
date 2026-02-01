import { Router } from 'express';
import { TemplateController } from './template.controller.js';
import { requireAuth } from '../../middlewares/authMiddleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
  getTemplateSchema,
  deleteTemplateSchema,
  getTemplatesQuerySchema,
} from './template.schemas.js';

const router = Router();
const templateController = new TemplateController();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// GET /api/templates - Listar templates
router.get('/', validateRequest(getTemplatesQuerySchema), (req, res, next) =>
  templateController.getTemplates(req, res, next)
);

// GET /api/templates/:id - Obtener template por ID
router.get('/:id', validateRequest(getTemplateSchema), (req, res, next) =>
  templateController.getTemplateById(req, res, next)
);

// POST /api/templates - Crear nuevo template
router.post('/', validateRequest(createTemplateSchema), (req, res, next) =>
  templateController.createTemplate(req, res, next)
);

// PUT /api/templates/:id - Actualizar template
router.put('/:id', validateRequest(updateTemplateSchema), (req, res, next) =>
  templateController.updateTemplate(req, res, next)
);

// DELETE /api/templates/:id - Eliminar template
router.delete('/:id', validateRequest(deleteTemplateSchema), (req, res, next) =>
  templateController.deleteTemplate(req, res, next)
);

export default router;
