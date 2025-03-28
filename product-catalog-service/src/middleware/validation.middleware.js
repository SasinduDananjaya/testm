// src/middleware/validation.middleware.js
import logger from '../utils/logger.js';

/**
 * Validates product input for creation and updates
 */
const validateProductInput = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  // Validate required fields
  if (!name) errors.push('Product name is required');
  if (!description) errors.push('Product description is required');
  if (price === undefined || price === null) errors.push('Product price is required');
  if (!category) errors.push('Product category is required');

  // Validate field types and formats
  if (name && typeof name !== 'string') errors.push('Product name must be a string');
  if (description && typeof description !== 'string') errors.push('Product description must be a string');
  if (price !== undefined && price !== null) {
    if (typeof price !== 'number') errors.push('Product price must be a number');
    if (price < 0) errors.push('Product price cannot be negative');
  }
  if (category && typeof category !== 'string') errors.push('Product category must be a string');

  // Validate field lengths
  if (name && name.length > 100) errors.push('Product name cannot exceed 100 characters');
  if (description && description.length > 2000) errors.push('Product description cannot exceed 2000 characters');

  // If there are validation errors, return them
  if (errors.length > 0) {
    logger.warn('Product validation failed', { errors, payload: req.body });
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Generic error handler middleware
 */
const handleValidationErrors = (err, req, res, next) => {
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    
    logger.warn('Mongoose validation error', { errors });
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    
    logger.warn('MongoDB duplicate key error', { field, value: err.keyValue[field] });
    
    return res.status(400).json({
      status: 'error',
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
    });
  }
  
  next(err);
};

export default {
  validateProductInput,
  handleValidationErrors
};