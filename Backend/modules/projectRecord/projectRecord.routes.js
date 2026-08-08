const express = require("express");
const router = express.Router();

const controller = require("./projectRecord.controller");

// Get role-scoped project records (accepts optional ?role= & ?status= query parameters)
router.get("/", controller.getRecords);

// Seed initial records
router.post("/seed", controller.seedRecords);

// Get single record by ID
router.get("/:id", controller.getRecordById);

// Create new project record
router.post("/", controller.createRecord);

module.exports = router;
