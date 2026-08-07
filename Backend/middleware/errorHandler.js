'use strict';

const ApiError = require('../shared/apiError');
const { logger } = require('../shared/logger');

/**
 * Global Express error handling middleware.
 * Must be registered LAST in app.js (after all routes).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known operational errors (ApiError)
  if (err instanceof ApiError || err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Database validation error.',
      errors: messages,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    });
  }

  // Handle JWT errors (shouldn't reach here, but safety net)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Authentication failed.' });
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  // Generic 500 for unexpected errors
  return res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.',
  });
};

module.exports = errorHandler;
