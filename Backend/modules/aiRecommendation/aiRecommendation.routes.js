"use strict";

const express = require("express");
const router = express.Router();

const aiRecommendationController = require("./aiRecommendation.controller");
const {
  getRecommendationSchema,
  prepareBookingSchema,
} = require("./aiRecommendation.validation");

const validate = require("../../middleware/validation.middleware");
const authMiddleware = require("../../middleware/auth.middleware");

// Generate personalized train/travel recommendations (requires authorization and request validation)
router.post(
  "/",
  authMiddleware,
  validate(getRecommendationSchema),
  aiRecommendationController.getRecommendation,
);

// Get supported booking providers
router.get(
  "/booking/providers",
  authMiddleware,
  aiRecommendationController.getBookingProviders,
);

// Prepare booking payload and provider redirect URL
router.post(
  "/booking/prepare",
  authMiddleware,
  validate(prepareBookingSchema),
  aiRecommendationController.prepareBooking,
);

// Get recommendation history logs for the user
router.get("/history", authMiddleware, aiRecommendationController.getHistory);

// Get recent recommendation logs for quick dashboard viewing
router.get(
  "/recent",
  authMiddleware,
  aiRecommendationController.getRecentRecommendations,
);

// Search recommendations in user's history
router.get(
  "/search",
  authMiddleware,
  aiRecommendationController.searchRecommendations,
);

// Get details of a single recommendation by document ID
router.get(
  "/:id",
  authMiddleware,
  aiRecommendationController.getRecommendationDetails,
);

// Bookmark or unbookmark a recommendation log
router.post(
  "/:id/bookmark",
  authMiddleware,
  aiRecommendationController.bookmarkRecommendation,
);

// Delete all recommendation logs from history
router.delete(
  "/history",
  authMiddleware,
  aiRecommendationController.clearHistory,
);

// Delete a single recommendation log from history
router.delete(
  "/:id",
  authMiddleware,
  aiRecommendationController.deleteRecommendation,
);

module.exports = router;
