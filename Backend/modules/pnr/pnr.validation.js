const Joi = require("joi");

const verifyPNRSchema = Joi.object({
  pnr: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "PNR number is required.",
      "string.length": "PNR must be exactly 10 digits.",
      "string.pattern.base": "PNR must contain only numbers.",
      "any.required": "PNR number is required.",
    }),
});

module.exports = {
  verifyPNRSchema,
};
