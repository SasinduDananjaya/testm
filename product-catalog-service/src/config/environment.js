// src/config/environment.js
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Environment configuration
const environment = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  // MongoDB configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/product_catalog',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d',
  
  // API rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100 // Max requests per windowMs
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    // Don't log sensitive data in production
    maskSensitiveData: process.env.NODE_ENV === 'production'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
};

// Validate required environment variables in production
if (environment.isProduction) {
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is required in production`);
    }
  });
}

export default environment;