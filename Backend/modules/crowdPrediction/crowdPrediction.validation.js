"use strict";

const { body, param, query } = require("express-validator");

/*
========================================
CROWD PREDICTION VALIDATION
========================================
*/

const validateSearch = [
  body("query")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Query must be between 1 and 200 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),

  body("time")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Time must be in HH:MM format"),
];

const validateTrainId = [
  param("id").trim().notEmpty().withMessage("Train ID is required"),
];

const validateCoach = [
  param("coach").trim().notEmpty().withMessage("Coach code is required"),
];

module.exports = {
  validateSearch,
  validateTrainId,
  validateCoach,
};
