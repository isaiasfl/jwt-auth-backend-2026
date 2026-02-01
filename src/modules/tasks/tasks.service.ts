import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import type { CreateTaskInput, UpdateTaskInput, GetTasksQuery } from './tasks.schemas.js';

export class TasksService {
  async getTasks(userId: string, query: GetTasksQuery) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.search && {
        title: {
          contains: query.search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new AppError('Tarea no encontrada', 404, 'TASK_NOT_FOUND');
    }

    return task;
  }

  async createTask(userId: string, data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });

    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new AppError('Tarea no encontrada', 404, 'TASK_NOT_FOUND');
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return task;
  }

  async deleteTask(taskId: string, userId: string) {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new AppError('Tarea no encontrada', 404, 'TASK_NOT_FOUND');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Tarea eliminada exitosamente' };
  }
}
