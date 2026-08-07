const EmergencyMedicalService = require("./emergencyMedical.service");

class EmergencyMedicalController {

  /*
  ========================================
  INITIALIZE DASHBOARD
  ========================================
  */

  async initializeDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.initializeDashboard(
          userId
        );

      return res.status(200).json({
        success: true,
        message: "Emergency Medical Dashboard initialized successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getDashboard(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET RESPONSE TIME
  ========================================
  */

  async getResponseTime(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getResponseTime(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET DOCTORS
  ========================================
  */

  async getDoctors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getDoctors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET AVAILABLE DOCTORS
  ========================================
  */

  async getAvailableDoctors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getAvailableDoctors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET DONORS
  ========================================
  */

  async getDonors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getDonors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET AVAILABLE DONORS
  ========================================
  */

  async getAvailableDonors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getAvailableDonors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET AI INSIGHT
  ========================================
  */

  async getAIInsight(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getAIInsight(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  CONNECT DOCTOR
  ========================================
  */

  async connectDoctor(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.connectDoctor(
          userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Doctor connected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  CONNECT DONOR
  ========================================
  */

  async connectDonor(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.connectDonor(
          userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Donor connected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }
    /*
  ========================================
  DISCONNECT DOCTOR
  ========================================
  */

  async disconnectDoctor(req, res, next) {

    try {

      const { userId, doctorId } = req.params;

      const response =
        await EmergencyMedicalService.disconnectDoctor(
          userId,
          doctorId
        );

      return res.status(200).json({
        success: true,
        message: "Doctor disconnected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  DISCONNECT DONOR
  ========================================
  */

  async disconnectDonor(req, res, next) {

    try {

      const { userId, donorId } = req.params;

      const response =
        await EmergencyMedicalService.disconnectDonor(
          userId,
          donorId
        );

      return res.status(200).json({
        success: true,
        message: "Donor disconnected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  RAISE SOS
  ========================================
  */

  async raiseSOS(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.raiseSOS(
          userId,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  CONTACT DOCTOR
  ========================================
  */

  async contactDoctor(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.contactDoctor(
          userId,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  CONTACT HELPLINE
  ========================================
  */

  async contactHelpline(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.contactHelpline(
          userId,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  REFRESH DASHBOARD
  ========================================
  */

  async refreshDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.refreshDashboard(
          userId
        );

      return res.status(200).json({
        success: true,
        message: "Dashboard refreshed successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  REFRESH RESPONSE TIME
  ========================================
  */

  async refreshResponseTime(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.refreshResponseTime(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  REFRESH DOCTORS
  ========================================
  */

  async refreshDoctors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.refreshDoctors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  REFRESH DONORS
  ========================================
  */

  async refreshDonors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.refreshDonors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET EMERGENCY STATUS
  ========================================
  */

  async getEmergencyStatus(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getEmergencyStatus(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  RESET DASHBOARD
  ========================================
  */

  async resetDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.resetDashboard(
          userId
        );

      return res.status(200).json({
        success: true,
        message: "Dashboard reset successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  DELETE DASHBOARD
  ========================================
  */

  async deleteDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.deleteDashboard(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

}

module.exports =
  new EmergencyMedicalController();
