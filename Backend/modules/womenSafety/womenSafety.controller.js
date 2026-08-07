const WomenSafetyService = require("./womenSafety.service");

class WomenSafetyController {

  async initializeDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.initializeDashboard(userId);

      return res.status(201).json({
        success: true,
        message: "Women Safety Dashboard initialized successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

async getDashboard(req, res, next) {
  try {
    const { userId } = req.params;

    console.log("Dashboard API Hit");
    console.log("User ID:", userId);

    const response =
      await WomenSafetyService.getDashboard(userId);

    console.log("Response:", response);

    return res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.log("Controller Error:", error);
    next(error);
  }
}

  async getSafetyScore(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.getSafetyScore(userId);

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  async getCompanions(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.getCompanions(userId);

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  async getVerifiedCompanions(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.getVerifiedCompanions(userId);

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  async getSafeSeats(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.getSafeSeats(userId);

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  async getAIInsight(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.getAIInsight(userId);

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

    async connectCompanion(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.connectCompanion(
          userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Companion connected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  async disconnectCompanion(req, res, next) {

    try {

      const { userId, companionId } = req.params;

      const response =
        await WomenSafetyService.disconnectCompanion(
          userId,
          companionId
        );

      return res.status(200).json({
        success: true,
        message: "Companion disconnected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  async raiseSOS(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.raiseSOS(
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

  async contactRPF(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.contactRPF(
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

  async contactHelpline(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.contactHelpline(
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

  async refreshDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.refreshDashboard(
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

  async refreshSafetyScore(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.refreshSafetyScore(
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

  async refreshCompanions(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.refreshCompanions(
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

    async getEmergencyStatus(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.getEmergencyStatus(
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

  async resetDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.resetDashboard(
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

  async deleteDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await WomenSafetyService.deleteDashboard(
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

module.exports = new WomenSafetyController();