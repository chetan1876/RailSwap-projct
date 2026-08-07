const { body, validationResult } = require("express-validator");
const ApiResponse = require("../../shared/apiResponse");

/* =====================================================
                VALIDATION RESULT
===================================================== */

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res
            .status(422)
            .json(
                ApiResponse.validationError(
                    errors.array()
                )
            );

    }

    next();

};

/* =====================================================
                    REGISTER
===================================================== */

const register = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ min: 3, max: 50 })
        .withMessage("Full name must be between 3 and 50 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address.")
        .normalizeEmail(),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        .withMessage(
            "Password must contain uppercase, lowercase, number and special character."
        ),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {

            if (value !== req.body.password) {

                throw new Error(
                    "Passwords do not match."
                );

            }

            return true;

        }),

    validate,

];

/* =====================================================
                    LOGIN
===================================================== */

const login = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),

    validate,

];

/* =====================================================
                VERIFY OTP
===================================================== */

const verifyOTP = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits.")
        .isNumeric()
        .withMessage("OTP must contain only numbers."),

    validate,

];

/* =====================================================
                RESEND OTP
===================================================== */

const resendOTP = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),

    validate,

];

/* =====================================================
            FORGOT PASSWORD
===================================================== */

const forgotPassword = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),

    validate,

];

/* =====================================================
            VERIFY RESET OTP
===================================================== */

const verifyResetOTP = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits.")
        .isNumeric()
        .withMessage("OTP must contain only numbers."),

    validate,

];

/* =====================================================
            RESET PASSWORD
===================================================== */

const resetPassword = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits.")
        .isNumeric()
        .withMessage("OTP must contain only numbers."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        .withMessage(
            "Password must contain uppercase, lowercase, number and special character."
        ),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {

            if (value !== req.body.password) {

                throw new Error(
                    "Passwords do not match."
                );

            }

            return true;

        }),

    validate,

];

/* =====================================================
                REFRESH TOKEN
===================================================== */

const refreshToken = [

    body("refreshToken")
        .notEmpty()
        .withMessage("Refresh token is required."),

    validate,

];

module.exports = {

    register,

    login,

    verifyOTP,

    resendOTP,

    forgotPassword,

    verifyResetOTP,

    resetPassword,

    refreshToken,

};