const express = require("express");

const router = express.Router();

/* Controllers */
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getUserById,
  updateUserStatus,
} = require("./user.controller");

/* Middlewares */
const authMiddleware = require(
  "../../middleware/auth.middleware"
);

const authorize = require(
  "../../middleware/role.middleware"
);

const {
  updateProfileValidation,
  userIdValidation,
  updateStatusValidation,
} = require(
  "./user.validation"
);

/*
===================================
USER PROFILE ROUTES
===================================
*/

/* Get Logged In User Profile */
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

/* Update Logged In User Profile */
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

/* Delete Logged In User Account */
router.delete(
  "/profile",
  authMiddleware,
  deleteProfile
);

/*
===================================
ADMIN ROUTES
===================================
*/

/* Get Any User By ID */
router.get(
  "/:id",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  getUserById
);

/* Update User Status */
router.patch(
  "/:id/status",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  updateUserStatus
);

router.put(
  "/profile",
  authMiddleware,
  updateProfileValidation,
  updateProfile
);

router.get(
  "/:id",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  userIdValidation,
  getUserById
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  userIdValidation,
  updateStatusValidation,
  updateUserStatus
);

module.exports = router;