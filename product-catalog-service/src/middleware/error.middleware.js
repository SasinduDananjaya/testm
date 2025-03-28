// src/middleware/error.middleware.js
import logger from '../utils/logger.js';
import config from '../config/environment.js';

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Set default status and error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error (with sensitive data masked in production)
  if (config.isProduction) {
    // Mask sensitive data in request body
    const sanitizedReq = { ...req };
    if (sanitizedReq.body) {
      // Mask any sensitive fields
      if (sanitizedReq.headers && sanitizedReq.headers.authorization) {
        sanitizedReq.headers.authorization = '[REDACTED]';
      }
    }
    
    logger.error('Application error', {
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
      request: {
        method: sanitizedReq.method,
        path: sanitizedReq.path,
        query: sanitizedReq.query,
        body: sanitizedReq.body
      }
    });
  } else {
    // In development, log the full error
    logger.error('Application error', {
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
      request: {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body
      }
    });
  }

  // Development vs Production error responses
  if (config.isDevelopment) {
    // In development, send detailed error
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // In production, send limited error info
    // For 500 errors, use a generic message
    if (err.statusCode === 500) {
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server'
      });
    }
    
    // For other errors, send the actual error message
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

export default errorMiddleware;