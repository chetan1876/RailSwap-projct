const Joi = require("joi");

/*
========================================
COMMON PARAMS
========================================
*/

const adminId = Joi.string()
  .trim()
  .required();

const userId = Joi.string()
  .trim()
  .required();

/*
========================================
INITIALIZE ADMIN
========================================
*/

const initializeAdminValidation = {

  body: Joi.object({

    id: Joi.string()
      .trim()
      .required(),

    name: Joi.string()
      .trim()
      .required(),

    email: Joi.string()
      .email()
      .trim()
      .required(),

    role: Joi.string()
      .trim()
      .required(),

    status: Joi.string()
      .trim()
      .required(),

    permissions: Joi.array()
      .items(Joi.string())
      .default([]),

  }),

};

/*
========================================
GET PROFILE
========================================
*/

const getProfileValidation = {

  params: Joi.object({

    adminId,

  }),

};

/*
========================================
UPDATE PROFILE
========================================
*/

const updateProfileValidation = {

  params: Joi.object({

    adminId,

  }),

  body: Joi.object({

    name: Joi.string()
      .trim()
      .optional(),

    email: Joi.string()
      .email()
      .trim()
      .optional(),

    role: Joi.string()
      .trim()
      .optional(),

    status: Joi.string()
      .trim()
      .optional(),

    permissions: Joi.array()
      .items(Joi.string())
      .optional(),

  }).min(1),

};
/*
========================================
DELETE ADMIN
========================================
*/

const deleteAdminValidation = {

  params: Joi.object({

    adminId,

  }),

};

/*
========================================
GET DASHBOARD
========================================
*/

const getDashboardValidation = {

  query: Joi.object({

    refresh: Joi.boolean()
      .optional(),

  }),

};

/*
========================================
GET ALL USERS
========================================
*/

const getUsersValidation = {

  query: Joi.object({

    page: Joi.number()
      .integer()
      .min(1)
      .optional(),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional(),

    search: Joi.string()
      .trim()
      .allow("")
      .optional(),

    status: Joi.string()
      .trim()
      .optional(),

  }),

};

/*
========================================
GET USER
========================================
*/

const getUserValidation = {

  params: Joi.object({

    userId,

  }),

};

/*
========================================
BLOCK USER
========================================
*/

const blockUserValidation = {

  params: Joi.object({

    userId,

  }),

};

/*
========================================
UNBLOCK USER
========================================
*/

const unblockUserValidation = {

  params: Joi.object({

    userId,

  }),

};

/*
========================================
DELETE USER
========================================
*/

const deleteUserValidation = {

  params: Joi.object({

    userId,

  }),

};

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  initializeAdminValidation,

  getProfileValidation,

  updateProfileValidation,

  deleteAdminValidation,

  getDashboardValidation,

  getUsersValidation,

  getUserValidation,

  blockUserValidation,

  unblockUserValidation,

  deleteUserValidation,

};