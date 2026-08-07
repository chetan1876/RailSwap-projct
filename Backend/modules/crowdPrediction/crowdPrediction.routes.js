"use strict";

const express = require("express");
const router = express.Router();

const controller = require("./crowdPrediction.controller");
const {
  validateSearch,
  validateTrainId,
  validateCoach,
} = require("./crowdPrediction.validation");

/*
========================================
CROWD PREDICTION ROUTES
========================================
*/

// POST /api/crowd/search — Smart universal search
router.post("/search", validateSearch, controller.searchCrowd);

// GET /api/crowd/train/:id — Full crowd data for a train
router.get("/train/:id", validateTrainId, controller.getTrainCrowd);

// GET /api/crowd/coach/:coach — Coach specific data
router.get("/coach/:coach", validateCoach, controller.getCoachCrowd);

// GET /api/crowd/heatmap/:train — Heatmap data
router.get("/heatmap/:train", controller.getHeatmap);

// GET /api/crowd/timeline/:train — Timeline prediction
router.get("/timeline/:train", controller.getTimeline);

// GET /api/crowd/recommendation?query=... — AI smart recommendations
router.get("/recommendation", controller.getRecommendation);

// GET /api/crowd/alerts?query=... — Smart alerts
router.get("/alerts", controller.getAlerts);

// GET /api/crowd/dashboard — Dashboard summary
router.get("/dashboard", controller.getDashboard);

module.exports = router;
