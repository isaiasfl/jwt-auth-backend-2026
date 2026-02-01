import { z } from 'zod';

// Schema para crear un nuevo Template
export const createTemplateSchema = z.object({
  body: z.object({
    // Reemplaza con los campos de tu recurso
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
  }),
});

// Schema para actualizar un Template
export const updateTemplateSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    name: z.string().min(1, 'El nombre es requerido').optional(),
    description: z.string().optional(),
  }),
});

// Schema para obtener un Template por ID
export const getTemplateSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

// Schema para eliminar un Template
export const deleteTemplateSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

// Schema para query params en listado
export const getTemplatesQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
  }),
});

// Tipos TypeScript
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>['body'];
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>['body'];
export type GetTemplatesQuery = z.infer<typeof getTemplatesQuerySchema>['query'];
