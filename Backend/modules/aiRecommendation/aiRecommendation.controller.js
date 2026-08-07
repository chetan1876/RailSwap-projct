"use strict";

const aiService = require("./aiRecommendation.service");
const bookingService = require("./booking.service");
const ApiResponse = require("../../shared/apiResponse");
const logger = require("../../shared/logger");

/**
 * POST /
 * Generate a personalized train and travel recommendation.
 */
const getRecommendation = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    logger.info("Generating AI Recommendation", { userEmail, body: req.body });

    const result = await aiService.generateRecommendation(userEmail, req.body);

    return res.status(201).json(
      ApiResponse.success("AI Recommendation generated successfully.", result, 201)
    );
  } catch (error) {
    logger.error("Error in getRecommendation controller", { error: error.message });
    next(error);
  }
};

/**
 * GET /history
 * Fetch recommendation history for the logged in user.
 */
const getHistory = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    logger.info("Fetching recommendation history", { userEmail });

    const history = await aiService.getHistory(userEmail);

    return res.status(200).json(
      ApiResponse.success("Recommendation history retrieved successfully.", history)
    );
  } catch (error) {
    logger.error("Error in getHistory controller", { error: error.message });
    next(error);
  }
};

/**
 * GET /recent
 * Fetch recent recommendations for the logged in user.
 */
const getRecentRecommendations = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    logger.info("Fetching recent recommendations", { userEmail, limit });

    const recent = await aiService.getRecent(userEmail, limit);

    return res.status(200).json(
      ApiResponse.success("Recent recommendations retrieved successfully.", recent)
    );
  } catch (error) {
    logger.error("Error in getRecentRecommendations controller", { error: error.message });
    next(error);
  }
};

/**
 * GET /search
 * Search recommendation history by source or destination name.
 */
const searchRecommendations = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    const query = req.query.q;
    if (!query) {
      return res.status(400).json(
        ApiResponse.badRequest("Search query parameter 'q' is required.")
      );
    }

    logger.info("Searching recommendations", { userEmail, query });

    const results = await aiService.searchRecommendations(userEmail, query);

    return res.status(200).json(
      ApiResponse.success("Recommendations search completed successfully.", results)
    );
  } catch (error) {
    logger.error("Error in searchRecommendations controller", { error: error.message });
    next(error);
  }
};

/**
 * GET /:id
 * Fetch detailed view of a single recommendation by ID.
 */
const getRecommendationDetails = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    const { id } = req.params;

    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    logger.info("Fetching recommendation details", { userEmail, id });

    const details = await aiService.getById(id, userEmail);

    return res.status(200).json(
      ApiResponse.success("Recommendation details retrieved successfully.", details)
    );
  } catch (error) {
    logger.error("Error in getRecommendationDetails controller", { error: error.message });
    next(error);
  }
};

/**
 * POST /:id/bookmark
 * Toggle bookmark status.
 */
const bookmarkRecommendation = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    const { id } = req.params;

    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    logger.info("Bookmarking recommendation", { userEmail, id });

    const result = await aiService.toggleBookmark(id, userEmail);

    return res.status(200).json(
      ApiResponse.success(
        result.isBookmarked
          ? "Recommendation bookmarked successfully."
          : "Recommendation unbookmarked successfully.",
        result
      )
    );
  } catch (error) {
    logger.error("Error in bookmarkRecommendation controller", { error: error.message });
    next(error);
  }
};

/**
 * DELETE /history
 * Clear all recommendation logs.
 */
const clearHistory = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    logger.info("Clearing all recommendation history", { userEmail });

    const result = await aiService.clearHistory(userEmail);

    return res.status(200).json(
      ApiResponse.success("All recommendation history cleared successfully.", result)
    );
  } catch (error) {
    logger.error("Error in clearHistory controller", { error: error.message });
    next(error);
  }
};

/**
 * DELETE /:id
 * Delete a specific recommendation log.
 */
const deleteRecommendation = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    const { id } = req.params;

    if (!userEmail) {
      return res.status(401).json(ApiResponse.unauthorized("User authentication required."));
    }

    logger.info("Deleting recommendation log", { userEmail, id });

    const result = await aiService.deleteRecommendation(id, userEmail);

    return res.status(200).json(
      ApiResponse.success("Recommendation log deleted successfully.", result)
    );
  } catch (error) {
    logger.error("Error in deleteRecommendation controller", { error: error.message });
    next(error);
  }
};

/**
 * GET /booking/providers
 * Returns supported booking partner configurations.
 */
const getBookingProviders = async (req, res, next) => {
  try {
    const providers = bookingService.getProviders();
    return res.status(200).json(
      ApiResponse.success("Booking providers retrieved successfully.", providers)
    );
  } catch (error) {
    logger.error("Error in getBookingProviders controller", { error: error.message });
    next(error);
  }
};

/**
 * POST /booking/prepare
 * Prepares booking payload and provider redirect URL.
 */
const prepareBooking = async (req, res, next) => {
  try {
    logger.info("Preparing booking redirect URL", { body: req.body });
    const result = bookingService.prepareBooking(req.body);
    return res.status(200).json(
      ApiResponse.success("Booking details prepared successfully.", result)
    );
  } catch (error) {
    logger.error("Error in prepareBooking controller", { error: error.message });
    next(error);
  }
};

module.exports = {
  getRecommendation,
  getHistory,
  getRecentRecommendations,
  getRecommendationDetails,
  bookmarkRecommendation,
  deleteRecommendation,
  clearHistory,
  searchRecommendations,
  getBookingProviders,
  prepareBooking,
};
