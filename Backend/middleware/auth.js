'use strict';

const jwt = require('jsonwebtoken');
const ApiError = require('../shared/apiError');
const { logger } = require('../shared/logger');

/**
 * JWT Authentication Middleware.
 * Verifies the Bearer token in the Authorization header.
 * On success, attaches decoded payload as req.user.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Access denied. No token provided.'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(ApiError.unauthorized('Access denied. Invalid token format.'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET is not set in environment variables.');
      return next(ApiError.internal('Server authentication configuration error.'));
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (error) {
    logger.warn('JWT verification failed', { error: error.message });

    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Session expired. Please log in again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token. Please log in again.'));
    }

    return next(ApiError.unauthorized('Authentication failed.'));
  }
};

module.exports = authMiddleware;
