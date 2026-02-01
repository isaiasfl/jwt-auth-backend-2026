import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  GetTemplatesQuery,
} from './template.schemas.js';

export class TemplateService {
  // Listar templates con paginación y búsqueda
  async getTemplates(userId: string, query: GetTemplatesQuery) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where = {
      userId, // Si el recurso tiene ownership por usuario
      ...(query.search && {
        name: {
          contains: query.search,
          mode: 'insensitive' as const,
        },
      }),
    };

    // Reemplaza 'template' con el nombre de tu modelo en Prisma
    const [templates, total] = await Promise.all([
      // prisma.template.findMany({
      //   where,
      //   skip,
      //   take: limit,
      //   orderBy: { createdAt: 'desc' },
      // }),
      // prisma.template.count({ where }),
      Promise.resolve([]), // Placeholder
      Promise.resolve(0), // Placeholder
    ]);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Obtener template por ID
  async getTemplateById(templateId: string, userId: string) {
    // Reemplaza con tu modelo
    // const template = await prisma.template.findFirst({
    //   where: {
    //     id: templateId,
    //     userId,
    //   },
    // });

    const template = null; // Placeholder

    if (!template) {
      throw new AppError('Recurso no encontrado', 404, 'TEMPLATE_NOT_FOUND');
    }

    return template;
  }

  // Crear nuevo template
  async createTemplate(userId: string, data: CreateTemplateInput) {
    // Reemplaza con tu modelo
    // const template = await prisma.template.create({
    //   data: {
    //     ...data,
    //     userId,
    //   },
    // });

    const template = { ...data, userId }; // Placeholder

    return template;
  }

  // Actualizar template
  async updateTemplate(
    templateId: string,
    userId: string,
    data: UpdateTemplateInput
  ) {
    // Verificar ownership
    // const existingTemplate = await prisma.template.findFirst({
    //   where: {
    //     id: templateId,
    //     userId,
    //   },
    // });

    const existingTemplate = null; // Placeholder

    if (!existingTemplate) {
      throw new AppError('Recurso no encontrado', 404, 'TEMPLATE_NOT_FOUND');
    }

    // Actualizar
    // const template = await prisma.template.update({
    //   where: { id: templateId },
    //   data,
    // });

    const template = { ...existingTemplate, ...data }; // Placeholder

    return template;
  }

  // Eliminar template
  async deleteTemplate(templateId: string, userId: string) {
    // Verificar ownership
    // const existingTemplate = await prisma.template.findFirst({
    //   where: {
    //     id: templateId,
    //     userId,
    //   },
    // });

    const existingTemplate = null; // Placeholder

    if (!existingTemplate) {
      throw new AppError('Recurso no encontrado', 404, 'TEMPLATE_NOT_FOUND');
    }

    // Eliminar
    // await prisma.template.delete({
    //   where: { id: templateId },
    // });

    return { message: 'Recurso eliminado exitosamente' };
  }
}
