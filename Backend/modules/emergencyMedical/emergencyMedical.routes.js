const express = require("express");

const router = express.Router();

const EmergencyMedicalController = require("./emergencyMedical.controller");

const {
  getDashboardValidation,
  getResponseTimeValidation,
  getDoctorsValidation,
  getDonorsValidation,
  connectDoctorValidation,
  connectDonorValidation,
  emergencySOSValidation,
  contactDoctorValidation,
  helplineValidation,
  insightValidation,
} = require("./emergencyMedical.validation");

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
  EmergencyMedicalController.initializeDashboard
);

router.get(
  "/:userId/dashboard",
  authMiddleware,
  validate(getDashboardValidation),
  EmergencyMedicalController.getDashboard
);

router.patch(
  "/:userId/dashboard/refresh",
  authMiddleware,
  validate(getDashboardValidation),
  EmergencyMedicalController.refreshDashboard
);

router.patch(
  "/:userId/dashboard/reset",
  authMiddleware,
  validate(getDashboardValidation),
  EmergencyMedicalController.resetDashboard
);

router.delete(
  "/:userId/dashboard",
  authMiddleware,
  validate(getDashboardValidation),
  EmergencyMedicalController.deleteDashboard
);

/*
|--------------------------------------------------------------------------
| Response Time
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/response-time",
  authMiddleware,
  validate(getResponseTimeValidation),
  EmergencyMedicalController.getResponseTime
);

router.patch(
  "/:userId/response-time/refresh",
  authMiddleware,
  validate(getResponseTimeValidation),
  EmergencyMedicalController.refreshResponseTime
);

/*
|--------------------------------------------------------------------------
| Doctors
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/doctors",
  authMiddleware,
  validate(getDoctorsValidation),
  EmergencyMedicalController.getDoctors
);

router.get(
  "/:userId/doctors/available",
  authMiddleware,
  validate(getDoctorsValidation),
  EmergencyMedicalController.getAvailableDoctors
);

router.patch(
  "/:userId/doctors/refresh",
  authMiddleware,
  validate(getDoctorsValidation),
  EmergencyMedicalController.refreshDoctors
);

router.post(
  "/:userId/doctors/connect",
  authMiddleware,
  validate(connectDoctorValidation),
  EmergencyMedicalController.connectDoctor
);

router.delete(
  "/:userId/doctors/:doctorId",
  authMiddleware,
  validate(getDoctorsValidation),
  EmergencyMedicalController.disconnectDoctor
);

/*
|--------------------------------------------------------------------------
| Blood Donors
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId/donors",
  authMiddleware,
  validate(getDonorsValidation),
  EmergencyMedicalController.getDonors
);

router.get(
  "/:userId/donors/available",
  authMiddleware,
  validate(getDonorsValidation),
  EmergencyMedicalController.getAvailableDonors
);

router.patch(
  "/:userId/donors/refresh",
  authMiddleware,
  validate(getDonorsValidation),
  EmergencyMedicalController.refreshDonors
);

router.post(
  "/:userId/donors/connect",
  authMiddleware,
  validate(connectDonorValidation),
  EmergencyMedicalController.connectDonor
);

router.delete(
  "/:userId/donors/:donorId",
  authMiddleware,
  validate(getDonorsValidation),
  EmergencyMedicalController.disconnectDonor
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
  EmergencyMedicalController.getAIInsight
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
  EmergencyMedicalController.raiseSOS
);

router.get(
  "/:userId/emergency-status",
  authMiddleware,
  validate(getDashboardValidation),
  EmergencyMedicalController.getEmergencyStatus
);

router.post(
  "/:userId/contact-doctor",
  authMiddleware,
  validate(contactDoctorValidation),
  EmergencyMedicalController.contactDoctor
);

router.post(
  "/:userId/helpline",
  authMiddleware,
  validate(helplineValidation),
  EmergencyMedicalController.contactHelpline
);

module.exports = router;