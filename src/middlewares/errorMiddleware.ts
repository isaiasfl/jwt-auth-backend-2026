import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { errorResponse } from '../utils/response.js';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log del error para debugging
  console.error('❌ Error:', err);

  // Error de validación Zod
  if (err instanceof ZodError) {
    return res.status(400).json(
      errorResponse('VALIDATION_ERROR', 'Error de validación', err.errors)
    );
  }

  // AppError personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorResponse(err.code, err.message, err.details)
    );
  }

  // Error genérico
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Error interno del servidor';

  return res.status(statusCode).json(
    errorResponse('INTERNAL_ERROR', message)
  );
};
