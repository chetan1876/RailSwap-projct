"use strict";

const express = require("express");

const router = express.Router();

const groupJourneyController = require("./groupJourney.controller");

/*
========================================
GROUP JOURNEY ROUTES
========================================
*/

// Create Group
router.post("/", groupJourneyController.createGroup);

// Get All Groups
router.get("/", groupJourneyController.getGroups);

// Join Group
router.post("/:id/join", groupJourneyController.joinGroup);

module.exports = router;
