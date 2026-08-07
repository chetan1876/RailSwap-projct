const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const authMiddleware = require("../../middleware/auth.middleware");

/* =====================================================
                    PUBLIC ROUTES
===================================================== */

// Register User
router.post(
    "/register",
    authValidation.register,
    authController.register
);

// Verify Email OTP
router.post(
    "/verify-otp",
    authValidation.verifyOTP,
    authController.verifyOTP
);

// Resend OTP
router.post(
    "/resend-otp",
    authValidation.resendOTP,
    authController.resendOTP
);

// Forgot Password
router.post(
    "/forgot-password",
    authValidation.forgotPassword,
    authController.forgotPassword
);

// Verify Reset OTP
router.post(
    "/verify-reset-otp",
    authValidation.verifyResetOTP,
    authController.verifyResetOTP
);

// Reset Password
router.post(
    "/reset-password",
    authValidation.resetPassword,
    authController.resetPassword
);

// Login 
router.post(
    "/login",
    authValidation.login,
    authController.login
);

// Google Login
router.post(
    "/google",
    authController.googleLogin
);

// Refresh Access Token
router.post(
    "/refresh-token",
    authValidation.refreshToken,
    authController.refreshToken
);

/* =====================================================
                  PROTECTED ROUTES
===================================================== */

// Logout
router.post(
    "/logout",
    authMiddleware,
    authController.logout
);

module.exports = router;