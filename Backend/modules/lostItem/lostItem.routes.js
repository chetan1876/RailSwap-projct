const express = require("express");
const router = express.Router();

const {
  verifyPNRController,
  reportLostItemController,
  getMyLostItemsController,
  getLostItemByIdController,
  updateStatusController,
} = require("./lostItem.controller");

// Verify PNR for Lost Item
router.post("/verify-pnr", verifyPNRController);

// Create Lost Item Request
router.post("/report", reportLostItemController);

// Get My Lost Items
router.get("/my", getMyLostItemsController);

// Update Status (matches PATCH /api/lost-items/status)
router.patch("/status", updateStatusController);

// Update Status by ID (optional URL param support)
router.patch("/:id/status", updateStatusController);

// Get Lost Item by ID
router.get("/:id", getLostItemByIdController);

module.exports = router;
