/*
========================================
RESPONSE STATUS
========================================
*/

const RESPONSE_STATUS = {
  FAST: "FAST RESPONSE",
  NORMAL: "NORMAL RESPONSE",
  DELAYED: "DELAYED RESPONSE",
  EXCELLENT: "EXCELLENT RESPONSE",
  GOOD: "GOOD RESPONSE",
  AVERAGE: "AVERAGE RESPONSE",
};

/*
========================================
DOCTOR STATUS
========================================
*/

const DOCTOR_STATUS = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  OFFLINE: "OFFLINE",
};

/*
========================================
VOLUNTEER STATUS
========================================
*/

const VOLUNTEER_STATUS = {
  ACTIVE: "ACTIVE",
  READY: "READY",
  OFFLINE: "OFFLINE",
};

/*
========================================
EMERGENCY STATUS
========================================
*/

const EMERGENCY_STATUS = {
  ACTIVE: "ACTIVE",
  RESOLVED: "RESOLVED",
  PENDING: "PENDING",
};

/*
========================================
BLOOD DONOR STATUS
========================================
*/

const BLOOD_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
};

/*
========================================
AI RISK LEVEL
========================================
*/

const RISK_LEVEL = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

/*
========================================
EMERGENCY TYPES
========================================
*/

const EMERGENCY_TYPE = {
  MEDICAL: "MEDICAL",
  ACCIDENT: "ACCIDENT",
  HEART_ATTACK: "HEART ATTACK",
  BLEEDING: "BLEEDING",
  OTHER: "OTHER",
};

/*
========================================
DEFAULT AI INSIGHT
========================================
*/

const DEFAULT_AI_INSIGHT = {
  title: "AI Medical Insight",

  description:
    "Nearest medical assistance is available within 2 minutes. Verified doctors and blood donors are available nearby.",

  riskLevel: RISK_LEVEL.LOW,
};

module.exports = {
  RESPONSE_STATUS,
  DOCTOR_STATUS,
  VOLUNTEER_STATUS,
  EMERGENCY_STATUS,
  BLOOD_STATUS,
  RISK_LEVEL,
  EMERGENCY_TYPE,
  DEFAULT_AI_INSIGHT,
};