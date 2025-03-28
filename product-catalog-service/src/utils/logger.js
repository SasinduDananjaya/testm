// src/utils/logger.js
import winston from 'winston';
import config from '../config/environment.js';

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

// Configure Winston logger
const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'product-catalog-service' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs to combined.log
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, also log to the console with simpler formatting
if (config.isDevelopment || config.isTest) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    })
  );
}

// Function to mask sensitive data
const maskSensitiveData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const maskedObj = { ...obj };
  
  // Fields to mask
  const sensitiveFields = ['password', 'token', 'secret', 'jwt', 'authorization'];
  
  // Recursively mask sensitive fields
  Object.keys(maskedObj).forEach(key => {
    // If the field is sensitive, mask it
    if (sensitiveFields.includes(key.toLowerCase())) {
      maskedObj[key] = '[REDACTED]';
    } 
    // If the field is an object, recursively mask it
    else if (typeof maskedObj[key] === 'object' && maskedObj[key] !== null) {
      maskedObj[key] = maskSensitiveData(maskedObj[key]);
    }
  });
  
  return maskedObj;
};

// Wrap the winston logger to handle masking sensitive data
const wrappedLogger = {
  error: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.error(message, maskedMeta);
  },
  warn: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.warn(message, maskedMeta);
  },
  info: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.info(message, maskedMeta);
  },
  http: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.http(message, maskedMeta);
  },
  verbose: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.verbose(message, maskedMeta);
  },
  debug: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.debug(message, maskedMeta);
  },
  silly: (message, meta = {}) => {
    const maskedMeta = config.logging.maskSensitiveData ? maskSensitiveData(meta) : meta;
    logger.silly(message, maskedMeta);
  }
};

export default logger;