const { body, param } = require(
  "express-validator"
);

/*
====================================
UPDATE PROFILE VALIDATION
====================================
*/

const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      "Full name must be between 3 and 100 characters"
    ),

  body("phoneNumber")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Invalid Indian mobile number"
    ),

  body("gender")
    .optional()
    .isIn([
      "MALE",
      "FEMALE",
      "OTHER",
    ])
    .withMessage(
      "Invalid gender value"
    ),

  body("age")
    .optional()
    .isInt({
      min: 1,
      max: 120,
    })
    .withMessage(
      "Age must be between 1 and 120"
    ),

  body("city")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "City name too long"
    ),

  body("state")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "State name too long"
    ),

  body("profileImage")
    .optional()
    .isURL()
    .withMessage(
      "Profile image must be a valid URL"
    ),

  body("emergencyContact.name")
    .optional()
    .trim()
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Emergency contact name is invalid"
    ),

  body("emergencyContact.phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Invalid emergency contact number"
    ),
];

/*
====================================
USER ID PARAM VALIDATION
====================================
*/

const userIdValidation = [
  param("id")
    .isMongoId()
    .withMessage(
      "Invalid user id"
    ),
];

/*
====================================
UPDATE USER STATUS
====================================
*/

const updateStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Status is required"
    )
    .isIn([
      "ACTIVE",
      "SUSPENDED",
      "BLOCKED",
      "PENDING_VERIFICATION",
    ])
    .withMessage(
      "Invalid user status"
    ),
];

module.exports = {
  updateProfileValidation,
  userIdValidation,
  updateStatusValidation,
};