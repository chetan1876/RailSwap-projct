const Joi = require("joi");

/*
========================================
COMMON USER ID
========================================
*/

const userId = Joi.string()
  .trim()
  .required();

/*
========================================
GET DASHBOARD
========================================
*/

const getDashboardValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
GET RESPONSE TIME
========================================
*/

const getResponseTimeValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
GET DOCTORS
========================================
*/

const getDoctorsValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
GET DONORS
========================================
*/

const getDonorsValidation = {
  params: Joi.object({
    userId,
  }),
};

/*
========================================
CONNECT DOCTOR
========================================
*/

const connectDoctorValidation = {

  params: Joi.object({
    userId,
  }),

  body: Joi.object({

    name: Joi.string().trim().required(),

    speciality: Joi.string().trim().required(),

    hospital: Joi.string().trim().required(),

    coach: Joi.string().trim().required(),

    seatNumber: Joi.string().trim().required(),

    phone: Joi.string()
      .trim()
      .min(10)
      .max(15)
      .required(),

    experience: Joi.number()
      .min(0)
      .max(60)
      .required(),

    profileImage: Joi.string()
      .trim()
      .allow("")
      .optional(),

  }),

};

/*
========================================
CONNECT DONOR
========================================
*/

const connectDonorValidation = {

  params: Joi.object({
    userId,
  }),

  body: Joi.object({

    name: Joi.string().trim().required(),

    blood: Joi.string().trim().required(),

    coach: Joi.string().trim().required(),

    seatNumber: Joi.string().trim().required(),

    phone: Joi.string()
      .trim()
      .min(10)
      .max(15)
      .required(),

    profileImage: Joi.string()
      .trim()
      .allow("")
      .optional(),

  }),

};

/*
========================================
EMERGENCY SOS
========================================
*/

const emergencySOSValidation = {

  params: Joi.object({
    userId,
  }),

  body: Joi.object({

    coach: Joi.string().trim().required(),

    seatNumber: Joi.string().trim().required(),

    emergencyType: Joi.string().trim().required(),

    patientName: Joi.string().trim().required(),

    message: Joi.string()
      .trim()
      .allow("")
      .optional(),

    latitude: Joi.number().optional(),

    longitude: Joi.number().optional(),

  }),

};

/*
========================================
CONTACT DOCTOR
========================================
*/

const contactDoctorValidation = {

  params: Joi.object({
    userId,
  }),

  body: Joi.object({

    doctorId: Joi.string()
      .trim()
      .required(),

    patientName: Joi.string()
      .trim()
      .required(),

    emergencyType: Joi.string()
      .trim()
      .required(),

  }),

};

/*
========================================
HELPLINE
========================================
*/

const helplineValidation = {

  params: Joi.object({
    userId,
  }),

  body: Joi.object({

    issue: Joi.string()
      .trim()
      .required(),

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

  getResponseTimeValidation,

  getDoctorsValidation,

  getDonorsValidation,

  connectDoctorValidation,

  connectDonorValidation,

  emergencySOSValidation,

  contactDoctorValidation,

  helplineValidation,

  insightValidation,

};