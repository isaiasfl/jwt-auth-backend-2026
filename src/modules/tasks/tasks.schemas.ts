import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'El título es requerido'),
    completed: z.boolean().optional().default(false),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    title: z.string().min(1, 'El título es requerido').optional(),
    completed: z.boolean().optional(),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>['query'];
