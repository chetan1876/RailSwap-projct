"use strict";

const Joi = require("joi");

/**
 * Wrapped in { body: schema } format so validation.middleware.js
 * correctly validates req.body via the schema.body branch.
 */
const getRecommendationSchema = {
  body: Joi.object({
    source: Joi.string().trim().required().messages({
      "string.empty": "Source station is required.",
      "any.required": "Source station is required.",
    }),
    destination: Joi.string().trim().required().messages({
      "string.empty": "Destination station is required.",
      "any.required": "Destination station is required.",
    }),
    travelDate: Joi.string().trim().required().messages({
      "string.empty": "Travel date is required.",
      "any.required": "Travel date is required.",
    }),
    travelClass: Joi.string().trim().allow("").optional().default("ALL"),
    passengers: Joi.number().integer().min(1).optional().default(1),
    budget: Joi.number().min(0).allow(null, "").optional(),
    preferences: Joi.object({
      seatPreference: Joi.string()
        .trim()
        .allow("")
        .optional()
        .default("No Preference"),
      classPreference: Joi.string()
        .trim()
        .allow("")
        .optional()
        .default("No Preference"),
      fastest: Joi.boolean().optional().default(false),
      cheapest: Joi.boolean().optional().default(false),
      leastCrowded: Joi.boolean().optional().default(false),
      familyFriendly: Joi.boolean().optional().default(false),
      studentFriendly: Joi.boolean().optional().default(false),
      seniorFriendly: Joi.boolean().optional().default(false),
      womenFriendly: Joi.boolean().optional().default(false),
      overnightTravel: Joi.boolean().optional().default(false),
      dayTravel: Joi.boolean().optional().default(false),
    })
      .optional()
      .default({}),
  }),
};

const prepareBookingSchema = {
  body: Joi.object({
    trainNumber: Joi.string().trim().required().messages({
      "string.empty": "Train number is required for booking.",
    }),
    trainName: Joi.string().trim().allow("").optional(),
    source: Joi.string().trim().required(),
    destination: Joi.string().trim().required(),
    travelDate: Joi.string().trim().required(),
    travelClass: Joi.string().trim().allow("").optional().default("ALL"),
    passengers: Joi.number().integer().min(1).optional().default(1),
    quota: Joi.string().trim().allow("").optional().default("GN"),
    seatPreference: Joi.string().trim().allow("").optional(),
    coachPreference: Joi.string().trim().allow("").optional(),
    providerId: Joi.string().trim().required().messages({
      "string.empty": "Booking provider ID is required.",
    }),
  }),
};

module.exports = {
  getRecommendationSchema,
  prepareBookingSchema,
};
