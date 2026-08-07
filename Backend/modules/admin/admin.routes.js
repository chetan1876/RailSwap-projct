const express = require("express");

const router = express.Router();

const AdminController = require("./admin.controller");

const validate = require("../../middleware/validation.middleware");

const authMiddleware = require("../../middleware/auth.middleware");

const {

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

} = require("./admin.validation");

/*
========================================
ADMIN PROFILE
========================================
*/

router.post(

  "/initialize",

  authMiddleware,

  validate(initializeAdminValidation),

  AdminController.initializeAdmin

);

router.get(

  "/profile/:adminId",

  authMiddleware,

  validate(getProfileValidation),

  AdminController.getProfile

);

router.patch(

  "/profile/:adminId",

  authMiddleware,

  validate(updateProfileValidation),

  AdminController.updateProfile

);

router.delete(

  "/profile/:adminId",

  authMiddleware,

  validate(deleteAdminValidation),

  AdminController.deleteAdmin

);
/*
========================================
DASHBOARD
========================================
*/

router.get(

  "/dashboard",

  authMiddleware,

  validate(getDashboardValidation),

  AdminController.getDashboard

);

/*
========================================
USER MANAGEMENT
========================================
*/

router.get(

  "/users",

  authMiddleware,

  validate(getUsersValidation),

  AdminController.getUsers

);

router.get(

  "/users/:userId",

  authMiddleware,

  validate(getUserValidation),

  AdminController.getUser

);
/*
========================================
USER MANAGEMENT
========================================
*/

router.patch(

  "/users/:userId/block",

  authMiddleware,

  validate(blockUserValidation),

  AdminController.blockUser

);

router.patch(

  "/users/:userId/unblock",

  authMiddleware,

  validate(unblockUserValidation),

  AdminController.unblockUser

);

router.delete(

  "/users/:userId",

  authMiddleware,

  validate(deleteUserValidation),

  AdminController.deleteUser

);

/*
========================================
EXPORT ROUTER
========================================
*/

module.exports = router;