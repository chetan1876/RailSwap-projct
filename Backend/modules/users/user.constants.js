/*
========================================
USER ROLES
========================================
*/

const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  SUPER_ADMIN: "SUPER_ADMIN",
};

/*
========================================
USER STATUS
========================================
*/

const USER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BLOCKED: "BLOCKED",
  PENDING_VERIFICATION:
    "PENDING_VERIFICATION",
};

/*
========================================
USER GENDER
========================================
*/

const USER_GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

/*
========================================
DEFAULT VALUES
========================================
*/

const DEFAULT_USER_VALUES = {
  TRUST_SCORE: 100,
  TOTAL_TRIPS: 0,
  SUCCESSFUL_EXCHANGES: 0,
  CANCELLED_EXCHANGES: 0,
  FAILED_LOGIN_ATTEMPTS: 0,
};

/*
========================================
SECURITY CONFIGURATION
========================================
*/

const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_DURATION:
    30 * 60 * 1000, // 30 minutes
};

/*
========================================
OTP CONFIGURATION
========================================
*/

const OTP_CONFIG = {
  OTP_LENGTH: 6,
  OTP_EXPIRY:
    10 * 60 * 1000, // 10 minutes
};

/*
========================================
PASSWORD RESET CONFIGURATION
========================================
*/

const PASSWORD_RESET_CONFIG = {
  TOKEN_EXPIRY:
    15 * 60 * 1000, // 15 minutes
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  USER_GENDER,
  DEFAULT_USER_VALUES,
  SECURITY_CONFIG,
  OTP_CONFIG,
  PASSWORD_RESET_CONFIG,
};