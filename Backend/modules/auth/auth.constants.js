/**
 * =====================================================
 *                  AUTH CONSTANTS
 * =====================================================
 */

// JWT Expiry
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// OTP
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

// Password Reset
const RESET_TOKEN_EXPIRY_MINUTES = 15;

// Password
const PASSWORD_SALT_ROUNDS = 12;

// Login Security
const MAX_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_DURATION_MINUTES = 15;

// Roles
const USER_ROLES = {
    USER: "USER",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
};

// Account Status
const ACCOUNT_STATUS = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    BLOCKED: "BLOCKED",
};

// Email Templates
const EMAIL_TYPES = {
    VERIFY_EMAIL: "VERIFY_EMAIL",
    RESET_PASSWORD: "RESET_PASSWORD",
};

// HTTP Messages
const AUTH_MESSAGES = {

    REGISTER_SUCCESS:
        "Registration successful. OTP sent to your email.",

    EMAIL_ALREADY_EXISTS:
        "Email already registered.",

    EMAIL_NOT_VERIFIED:
        "Please verify your email first.",

    EMAIL_VERIFIED:
        "Email verified successfully.",

    INVALID_OTP:
        "Invalid OTP.",

    OTP_EXPIRED:
        "OTP has expired.",

    OTP_SENT:
        "OTP sent successfully.",

    LOGIN_SUCCESS:
        "Login successful.",

    INVALID_CREDENTIALS:
        "Invalid email or password.",

    ACCOUNT_LOCKED:
        "Account is temporarily locked. Try again later.",

    ACCOUNT_BLOCKED:
        "Your account has been blocked.",

    ACCOUNT_SUSPENDED:
        "Your account has been suspended.",

    USER_NOT_FOUND:
        "User not found.",

    PASSWORD_RESET_SENT:
        "Password reset email sent successfully.",

    PASSWORD_RESET_SUCCESS:
        "Password reset successful.",

    INVALID_RESET_TOKEN:
        "Invalid or expired reset token.",

    LOGOUT_SUCCESS:
        "Logout successful.",

    SERVER_ERROR:
        "Internal server error.",
};

module.exports = {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,

    OTP_LENGTH,
    OTP_EXPIRY_MINUTES,

    RESET_TOKEN_EXPIRY_MINUTES,

    PASSWORD_SALT_ROUNDS,

    MAX_LOGIN_ATTEMPTS,
    ACCOUNT_LOCK_DURATION_MINUTES,

    USER_ROLES,
    ACCOUNT_STATUS,
    EMAIL_TYPES,

    AUTH_MESSAGES,
};