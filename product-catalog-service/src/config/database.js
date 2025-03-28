// src/config/database.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import config from './environment.js';

// Configure mongoose options for security and performance
const mongooseOptions = {
  // Performance: Connection pool size
  maxPoolSize: 10,
  // Performance: Wait 15 seconds before timing out
  connectTimeoutMS: 15000,
  // Performance: Wait 30 seconds for operations
  socketTimeoutMS: 30000,
  // Reliability: Keep trying to send operations for 5 seconds
  serverSelectionTimeoutMS: 5000,
  // Reliability: Retry failed operations
  retryWrites: true,
  // Latency: Default to nearest primary for reads
  readPreference: 'primaryPreferred'
};

// Add TLS/SSL options only in production using the modern format
if (config.isProduction) {
  // Modern way to configure TLS in MongoDB driver
  mongooseOptions.tls = true;
}

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, mongooseOptions);
    
    // Log connection information (without sensitive details)
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    // Handle application termination - close DB connection gracefully
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection', err);
        process.exit(1);
      }
    });
    
    return conn;
  } catch (error) {
    logger.error('MongoDB connection error', error);
    process.exit(1);
  }
};