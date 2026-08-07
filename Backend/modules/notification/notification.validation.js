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
COMMON NOTIFICATION ID
========================================
*/

const notificationId = Joi.string()
  .trim()
  .required();

/*
========================================
INITIALIZE NOTIFICATIONS
========================================
*/

const initializeNotificationValidation = {

  params: Joi.object({

    userId,

  }),

};

/*
========================================
GET ALL NOTIFICATIONS
========================================
*/

const getAllNotificationsValidation = {

  params: Joi.object({

    userId,

  }),

};

/*
========================================
GET SINGLE NOTIFICATION
========================================
*/

const getNotificationValidation = {

  params: Joi.object({

    notificationId,

  }),

};
/*
========================================
CREATE NOTIFICATION
========================================
*/

const createNotificationValidation = {

  body: Joi.object({

    userId: Joi.string()
      .trim()
      .required(),

    title: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required(),

    message: Joi.string()
      .trim()
      .min(3)
      .max(500)
      .required(),

    type: Joi.string()
      .trim()
      .required(),

    priority: Joi.string()
      .trim()
      .required(),

    sourceModule: Joi.string()
      .trim()
      .required(),

  }),

};

/*
========================================
MARK AS READ
========================================
*/

const markAsReadValidation = {

  params: Joi.object({

    notificationId,

  }),

};

/*
========================================
DELETE NOTIFICATION
========================================
*/

const deleteNotificationValidation = {

  params: Joi.object({

    notificationId,

  }),

};
module.exports = {

  initializeNotificationValidation,

  createNotificationValidation,

  getNotificationValidation,

  getAllNotificationsValidation,

  markAsReadValidation,

  deleteNotificationValidation,

};