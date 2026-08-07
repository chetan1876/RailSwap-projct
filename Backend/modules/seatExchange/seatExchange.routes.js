const express = require("express");
const router = express.Router();

const seatExchangeController = require("./seatExchange.controller");

// Create Seat Exchange Request
router.post(
  "/request",
  seatExchangeController.createSeatExchangeRequest
);

// Process Paytm Payment Post-Acceptance (₹50 Fee)
router.post(
  "/pay-post-acceptance",
  seatExchangeController.processPaytmPayment
);

router.post(
  "/pay",
  seatExchangeController.processPaytmPayment
);


// Get All Seat Exchange Requests
router.get(
  "/requests",
  seatExchangeController.getAllSeatExchangeRequests
);

// Get Payment History
router.get(
  "/payments",
  seatExchangeController.getPaymentHistory
);

// Get Seat Exchange Request By ID
router.get(
  "/requests/:id",
  seatExchangeController.getSeatExchangeRequestById
);

// Find Matching Passengers (AI Scoring)
router.post(
  "/find-matches",
  seatExchangeController.findMatchingPassengers
);

// Accept Seat Exchange
router.patch(
  "/accept/:id",
  seatExchangeController.acceptSeatExchange
);

// Reject Seat Exchange
router.patch(
  "/reject/:id",
  seatExchangeController.rejectSeatExchange
);

// Cancel Seat Exchange
router.patch(
  "/cancel/:id",
  seatExchangeController.cancelSeatExchange
);

module.exports = router;