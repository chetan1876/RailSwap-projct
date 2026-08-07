const Joi = require("joi");

/*
========================================
COMMON USER ID
========================================
*/

const userId = Joi.string().trim().required();

/*
========================================
COMMON COMPANION ID
========================================
*/

const companionId = Joi.string().trim().required();

/*
========================================
DASHBOARD
========================================
*/

const getDashboardValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
SAFETY SCORE
========================================
*/

const getSafetyScoreValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
SAFE SEATS
========================================
*/

const getSafeSeatsValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
GET COMPANIONS
========================================
*/

const getCompanionsValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
DELETE COMPANION
========================================
*/

const deleteCompanionValidation = {
  params: Joi.object({
    userId,
    companionId,
  }),
};

/*
========================================
CONNECT COMPANION
========================================
*/

const connectCompanionValidation = {
  body: Joi.object({
    name: Joi.string().trim().required(),

    age: Joi.number().min(18).max(100).required(),

    matchPercentage: Joi.number()
      .min(0)
      .max(100)
      .required(),

    coach: Joi.string().trim().required(),

    seatNumber: Joi.string().trim().required(),

    trainNumber: Joi.string()
      .trim()
      .allow("")
      .optional(),

    trainName: Joi.string()
      .trim()
      .allow("")
      .optional(),

    sourceStation: Joi.string()
      .trim()
      .allow("")
      .optional(),

    destinationStation: Joi.string()
      .trim()
      .allow("")
      .optional(),

    trustScore: Joi.number()
      .min(0)
      .max(100)
      .optional(),

    profileImage: Joi.string()
      .trim()
      .allow("")
      .optional(),
  }),
};

/*
========================================
SOS
========================================
*/

const emergencySOSValidation = {
  body: Joi.object({
    coach: Joi.string().trim().required(),

    seatNumber: Joi.string().trim().required(),

    latitude: Joi.number().optional(),

    longitude: Joi.number().optional(),

    emergencyMessage: Joi.string()
      .trim()
      .max(500)
      .allow("")
      .optional(),
  }),
};

/*
========================================
CONTACT RPF
========================================
*/

const contactRPFValidation = {
  body: Joi.object({
    coach: Joi.string().trim().required(),

    seatNumber: Joi.string().trim().required(),

    reason: Joi.string().trim().required(),
  }),
};

/*
========================================
HELPLINE
========================================
*/

const helplineValidation = {
  body: Joi.object({
    issue: Joi.string().trim().required(),

    phoneNumber: Joi.string()
      .trim()
      .min(10)
      .max(15)
      .required(),
  }),
};

/*
========================================
AI INSIGHT
========================================
*/

const insightValidation = {
  params: Joi.object({
    userId,
  }),
};

module.exports = {
  getDashboardValidation,
  getSafetyScoreValidation,
  getSafeSeatsValidation,
  getCompanionsValidation,
  deleteCompanionValidation,
  connectCompanionValidation,
  emergencySOSValidation,
  contactRPFValidation,
  helplineValidation,
  insightValidation,
};