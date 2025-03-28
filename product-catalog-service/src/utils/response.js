// src/utils/response.js

/**
 * Creates a standardized success response
 * 
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Object} meta - Additional metadata
 */
export const success = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
      meta
    });
  };
  
  /**
   * Creates a standardized error response
   * 
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Error message
   * @param {Array|Object} errors - Detailed errors
   * @param {Object} meta - Additional metadata
   */
  export const error = (res, statusCode = 500, message = 'Error', errors = null, meta = {}) => {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
      meta
    });
  };
  
  /**
   * Creates a standardized not found response
   * 
   * @param {Object} res - Express response object
   * @param {String} message - Not found message
   */
  export const notFound = (res, message = 'Resource not found') => {
    return res.status(404).json({
      status: 'error',
      message
    });
  };
  
  /**
   * Creates a standardized validation error response
   * 
   * @param {Object} res - Express response object
   * @param {String} message - Validation error message
   * @param {Array} errors - Validation errors
   */
  export const validationError = (res, message = 'Validation failed', errors = []) => {
    return res.status(400).json({
      status: 'error',
      message,
      errors
    });
  };
  
  /**
   * Creates a standardized unauthorized response
   * 
   * @param {Object} res - Express response object
   * @param {String} message - Unauthorized message
   */
  export const unauthorized = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
      status: 'error',
      message
    });
  };
  
  /**
   * Creates a standardized forbidden response
   * 
   * @param {Object} res - Express response object
   * @param {String} message - Forbidden message
   */
  export const forbidden = (res, message = 'Access forbidden') => {
    return res.status(403).json({
      status: 'error',
      message
    });
  };