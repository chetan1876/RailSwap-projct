/*
========================================
ADMIN COLLECTION
========================================
*/

const ADMIN_COLLECTION = "admins";

/*
========================================
ADMIN ROLES
========================================
*/

const ADMIN_ROLES = {

  SUPER_ADMIN: "SUPER_ADMIN",

  ADMIN: "ADMIN",

};

/*
========================================
ADMIN STATUS
========================================
*/

const ADMIN_STATUS = {

  ACTIVE: "ACTIVE",

  BLOCKED: "BLOCKED",

};

/*
========================================
DEFAULT PERMISSIONS
========================================
*/

const DEFAULT_PERMISSIONS = [

  "dashboard",

  "users",

  "seatExchange",

  "journeyCompanion",

  "womenSafety",

  "emergencyMedical",

  "notification",

];

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  ADMIN_COLLECTION,

  ADMIN_ROLES,

  ADMIN_STATUS,

  DEFAULT_PERMISSIONS,

};