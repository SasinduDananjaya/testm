// app.js - Express application setup
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';

import productRoutes from './routes/product.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import { connectDB } from './config/database.js';
import logger from './utils/logger.js';
import config from './config/environment.js';

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (config.isDevelopment) {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 100, // 100 requests from same IP in 15 minutes
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later!'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'category'] // Allow duplicate query params for these fields
}));

// Enable CORS
app.use(cors());

// Compress all responses
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Service is healthy' });
});

// API routes
app.use('/api/products', productRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorMiddleware);

export default app;