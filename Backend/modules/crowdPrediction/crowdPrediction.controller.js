"use strict";

const crowdService = require("./crowdPrediction.service");
const { validationResult } = require("express-validator");

/*
========================================
POST /crowd/search
Smart search - detect type automatically
========================================
*/
const searchCrowd = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { query, date, time, coach, classType, station } = req.body;
    const filters = { date, time, coach, classType, station };

    const result = await crowdService.predictCrowdBySearch(query, filters);

    return res.status(200).json({
      success: true,
      message: "Crowd prediction generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] searchCrowd error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/train/:id
Get full crowd data for a specific train
========================================
*/
const getTrainCrowd = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await crowdService.getTrainCrowd(id);

    return res.status(200).json({
      success: true,
      message: "Train crowd data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getTrainCrowd error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/coach/:coach
Get crowd data for a specific coach
========================================
*/
const getCoachCrowd = async (req, res) => {
  try {
    const { coach } = req.params;
    const result = await crowdService.getCoachCrowd(coach);

    return res.status(200).json({
      success: true,
      message: "Coach crowd data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getCoachCrowd error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/heatmap/:train
Get heatmap data for a train
========================================
*/
const getHeatmap = async (req, res) => {
  try {
    const { train } = req.params;
    const result = await crowdService.getTrainHeatmap(train);

    return res.status(200).json({
      success: true,
      message: "Heatmap data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getHeatmap error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/timeline/:train
Get crowd timeline prediction
========================================
*/
const getTimeline = async (req, res) => {
  try {
    const { train } = req.params;
    const result = await crowdService.getTrainTimeline(train);

    return res.status(200).json({
      success: true,
      message: "Timeline data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getTimeline error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/recommendation
Get AI smart recommendations
========================================
*/
const getRecommendation = async (req, res) => {
  try {
    const { query } = req.query;
    const result = await crowdService.getSmartRecommendations(query);

    return res.status(200).json({
      success: true,
      message: "Recommendations generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getRecommendation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/alerts
Get smart alerts
========================================
*/
const getAlerts = async (req, res) => {
  try {
    const { query } = req.query;
    const result = await crowdService.getSmartAlerts(query);

    return res.status(200).json({
      success: true,
      message: "Alerts retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getAlerts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/*
========================================
GET /crowd/dashboard
Get dashboard summary
========================================
*/
const getDashboard = async (req, res) => {
  try {
    const result = await crowdService.getDashboardSummary();

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("[CrowdPrediction] getDashboard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  searchCrowd,
  getTrainCrowd,
  getCoachCrowd,
  getHeatmap,
  getTimeline,
  getRecommendation,
  getAlerts,
  getDashboard,
};
