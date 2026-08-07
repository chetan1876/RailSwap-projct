console.log("✅ PNR Routes Loaded");

const express = require("express");
const router = express.Router();

const {
  verifyPNRController,
  getPNRHistoryController,
} = require("./pnr.controller");

// ==========================================
// Verify PNR
// ==========================================
router.post("/verify", (req, res, next) => {
  console.log("✅ /verify route reached");
  next();
}, verifyPNRController);

// ==========================================
// Get PNR History
// ==========================================
router.get("/history", getPNRHistoryController);

module.exports = router;