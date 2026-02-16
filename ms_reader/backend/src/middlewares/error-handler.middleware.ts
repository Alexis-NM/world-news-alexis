import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error.js';
import { logger } from '../config/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      type: 'AppError',
      statusCode: err.statusCode,
      message: err.message,
      url: req.url,
      method: req.method
    });

    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.url,
      ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
    });
  }

  logger.error({
    type: 'UnhandledError',
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Une erreur interne est survenue',
    timestamp: new Date().toISOString(),
    path: req.url,
    ...(process.env['NODE_ENV'] === 'development' && {
      stack: err.stack,
      details: err.message
    })
  });
};
