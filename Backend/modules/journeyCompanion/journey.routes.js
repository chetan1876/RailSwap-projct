const express = require("express");
const router = express.Router();

const journeyController = require("./journey.controller");

/*
========================================
JOURNEY ROUTES
========================================
*/

// Create Journey
router.post("/create", journeyController.createJourney);

// Search Train / PNR
router.get("/search", journeyController.searchTrainOrPNR);

// AI Assistant & Tips
router.post("/ai-tips", journeyController.getJourneyTips);
router.post("/ai-assistant", journeyController.askAIAssistant);

// Checklist Management
router.post("/checklist/:journeyId", journeyController.addChecklistItem);
router.patch(
  "/checklist/:journeyId/:itemId/toggle",
  journeyController.toggleChecklistItem,
);
router.delete(
  "/checklist/:journeyId/:itemId",
  journeyController.deleteChecklistItem,
);

// Notes Management
router.post("/notes/:journeyId", journeyController.addJourneyNote);
router.patch("/notes/:journeyId/:noteId/pin", journeyController.togglePinNote);
router.delete("/notes/:journeyId/:noteId", journeyController.deleteJourneyNote);

// Analytics & Memories
router.get("/analytics/:userId", journeyController.getUserAnalytics);
router.post("/memories/:journeyId", journeyController.saveJourneyMemory);

// Get Details
router.get("/details/:journeyId", journeyController.getJourney);

// Update & Delete Journey
router.put("/update/:journeyId", journeyController.updateJourney);
router.delete("/delete/:journeyId", journeyController.deleteJourney);

// Get All Journeys of User (Must be placed after static parameter routes)
router.get("/user/:userId", journeyController.getJourneys);
router.get("/:userId", journeyController.getJourneys);

module.exports = router;
