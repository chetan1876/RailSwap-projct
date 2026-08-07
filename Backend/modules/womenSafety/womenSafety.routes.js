const express = require("express");

const router = express.Router();

const WomenSafetyController = require("./womenSafety.controller");

const {
  getDashboardValidation,
  getSafetyScoreValidation,
  getSafeSeatsValidation,
  getCompanionsValidation,
  deleteCompanionValidation,
  connectCompanionValidation,
  emergencySOSValidation,
  contactRPFValidation,
  helplineValidation,
  insightValidation,
} = require("./womenSafety.validation");

const validate = require("../../middleware/validation.middleware");
const authMiddleware = require("../../middleware/auth.middleware");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.post(
  "/:userId/dashboard",
  authMiddleware,
  validate(getDashboardValidation),
  WomenSafetyController.initializeDashboard
);

router.get(
  "/:userId/dashboard",
  authMiddleware,
  validate(getDashboardValidation),
  WomenSafetyController.getDashboard
);

router.patch(
  "/:userId/dashboard/refresh",
  authMiddleware,
  validate(getDashboardValidation),
  WomenSafetyController.refreshDashboard
);

router.patch(
  "/:userId/dashboard/reset",
  authMiddleware,
  validate(getDashboardValidation),
  WomenSafetyController.resetDashboard
);

router.delete(
  "/:userId/dashboard",
  authMiddleware,
  validate(getDashboardValidation),
  WomenSafetyController.deleteDashboard
);

/*
|--------------------------------------------------------------------------
| Safety Score
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/safety-score",
  authMiddleware,
  validate(getSafetyScoreValidation),
  WomenSafetyController.getSafetyScore
);

router.patch(
  "/:userId/safety-score/refresh",
  authMiddleware,
  validate(getSafetyScoreValidation),
  WomenSafetyController.refreshSafetyScore
);

/*
|--------------------------------------------------------------------------
| Safe Seats
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/safe-seats",
  authMiddleware,
  validate(getSafeSeatsValidation),
  WomenSafetyController.getSafeSeats
);

/*
|--------------------------------------------------------------------------
| Companions
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/companions",
  authMiddleware,
  validate(getCompanionsValidation),
  WomenSafetyController.getCompanions
);

router.get(
  "/:userId/companions/verified",
  authMiddleware,
  validate(getCompanionsValidation),
  WomenSafetyController.getVerifiedCompanions
);

router.patch(
  "/:userId/companions/refresh",
  authMiddleware,
  validate(getCompanionsValidation),
  WomenSafetyController.refreshCompanions
);

router.post(
  "/:userId/companions/connect",
  authMiddleware,
  validate(connectCompanionValidation),
  WomenSafetyController.connectCompanion
);

router.delete(
  "/:userId/companions/:companionId",
  authMiddleware,
  validate(deleteCompanionValidation),
  WomenSafetyController.disconnectCompanion
);

/*
|--------------------------------------------------------------------------
| AI Insight
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/insight",
  authMiddleware,
  validate(insightValidation),
  WomenSafetyController.getAIInsight
);

/*
|--------------------------------------------------------------------------
| Emergency
|--------------------------------------------------------------------------
*/

router.post(
  "/:userId/sos",
  authMiddleware,
  validate(emergencySOSValidation),
  WomenSafetyController.raiseSOS
);

router.get(
  "/:userId/emergency-status",
  authMiddleware,
  validate(getDashboardValidation),
  WomenSafetyController.getEmergencyStatus
);

router.post(
  "/:userId/rpf",
  authMiddleware,
  validate(contactRPFValidation),
  WomenSafetyController.contactRPF
);

router.post(
  "/:userId/helpline",
  authMiddleware,
  validate(helplineValidation),
  WomenSafetyController.contactHelpline
);

module.exports = router;