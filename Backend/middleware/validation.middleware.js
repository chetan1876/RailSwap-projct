module.exports = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }

    // Params Validation
    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((e) => e.message),
        });
      }
    }

    // Body Validation
    if (schema.body) {
      const { error } = schema.body.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((e) => e.message),
        });
      }
    }

    // Query Validation
    if (schema.query) {
      const { error } = schema.query.validate(req.query, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((e) => e.message),
        });
      }
    }

    next();
  };
};