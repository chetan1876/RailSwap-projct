/*
========================================
NOTIFICATION TYPE
========================================
*/

const NOTIFICATION_TYPE = {

  EMERGENCY_MEDICAL:
    "EMERGENCY_MEDICAL",

  WOMEN_SAFETY:
    "WOMEN_SAFETY",

  SEAT_EXCHANGE:
    "SEAT_EXCHANGE",

  JOURNEY_COMPANION:
    "JOURNEY_COMPANION",

  AI_RECOMMENDATION:
    "AI_RECOMMENDATION",

  PAYMENT:
    "PAYMENT",

  PROFILE:
    "PROFILE",

  SYSTEM:
    "SYSTEM",

};

/*
========================================
NOTIFICATION PRIORITY
========================================
*/

const NOTIFICATION_PRIORITY = {

  LOW:
    "LOW",

  MEDIUM:
    "MEDIUM",

  HIGH:
    "HIGH",

  CRITICAL:
    "CRITICAL",

};

/*
========================================
NOTIFICATION STATUS
========================================
*/

const NOTIFICATION_STATUS = {

  READ:
    true,

  UNREAD:
    false,

};

/*
========================================
SORT ORDER
========================================
*/

const SORT_ORDER = {

  ASC:
    "ASC",

  DESC:
    "DESC",

};

/*
========================================
DEFAULT VALUES
========================================
*/

const DEFAULT_NOTIFICATION = {

  PRIORITY:
    NOTIFICATION_PRIORITY.MEDIUM,

  TYPE:
    NOTIFICATION_TYPE.SYSTEM,

  IS_READ:
    NOTIFICATION_STATUS.UNREAD,

};

/*
========================================
SUCCESS MESSAGE
========================================
*/

const SUCCESS_MESSAGE = {

  CREATED:
    "Notification created successfully.",

  FETCHED:
    "Notifications fetched successfully.",

  UPDATED:
    "Notification updated successfully.",

  READ:
    "Notification marked as read.",

  READ_ALL:
    "All notifications marked as read.",

  DELETED:
    "Notification deleted successfully.",

  DELETE_ALL:
    "All notifications deleted successfully.",

};

/*
========================================
ERROR MESSAGE
========================================
*/

const ERROR_MESSAGE = {

  NOT_FOUND:
    "Notification not found.",

  INVALID_NOTIFICATION:
    "Invalid notification.",

  USER_NOT_FOUND:
    "User not found.",

};

/*
========================================
PRIORITY & SOURCE MODULE
========================================
*/

const PRIORITY = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

const SOURCE_MODULE = {
  SYSTEM: "SYSTEM",
  EMERGENCY_MEDICAL: "EMERGENCY_MEDICAL",
  WOMEN_SAFETY: "WOMEN_SAFETY",
  SEAT_EXCHANGE: "SEAT_EXCHANGE",
  LOST_FOUND: "LOST_FOUND",
  COMPLAINT: "COMPLAINT",
  JOURNEY_COMPANION: "JOURNEY_COMPANION",
  PAYMENT: "PAYMENT",
};

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  NOTIFICATION_TYPE,

  NOTIFICATION_PRIORITY,

  NOTIFICATION_STATUS,

  PRIORITY,

  SOURCE_MODULE,

  SORT_ORDER,

  DEFAULT_NOTIFICATION,

  SUCCESS_MESSAGE,

  ERROR_MESSAGE,

};