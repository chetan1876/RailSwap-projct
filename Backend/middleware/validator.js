'use strict';

const { logger } = require('../shared/logger');

/**
 * Joi-based validation middleware factory.
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @param {'body'|'query'|'params'} target - Which part of the request to validate
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message.replace(/"/g, "'")).join('; ');
      logger.warn('Validation failed', { target, messages, path: req.path });
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map((d) => ({
          field: d.path.join('.'),
          message: d.message.replace(/"/g, "'"),
        })),
      });
    }

    // Replace with sanitized/defaulted values
    req[target] = value;
    next();
  };
};

module.exports = validate;
