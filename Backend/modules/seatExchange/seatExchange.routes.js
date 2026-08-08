const express = require("express");

const router = express.Router();

const seatExchangeController =
  require("./seatExchange.controller");


// =====================================================
// CREATE SEAT EXCHANGE REQUEST
// =====================================================

router.post(
  "/request",
  seatExchangeController.createSeatExchangeRequest
);


// =====================================================
// PROCESS PAYTM PAYMENT POST-ACCEPTANCE
// ₹50 Fee
// =====================================================

router.post(
  "/pay-post-acceptance",
  seatExchangeController.processPaytmPayment
);


// =====================================================
// PROCESS PAYMENT
// =====================================================

router.post(
  "/pay",
  seatExchangeController.processPaytmPayment
);


// =====================================================
// GET ALL SEAT EXCHANGE REQUESTS
// =====================================================

router.get(
  "/requests",
  seatExchangeController.getAllSeatExchangeRequests
);


// =====================================================
// GET PAYMENT HISTORY
// =====================================================

router.get(
  "/payments",
  seatExchangeController.getPaymentHistory
);


// =====================================================
// GET SEAT EXCHANGE REQUEST BY ID
// =====================================================

router.get(
  "/requests/:id",
  seatExchangeController.getSeatExchangeRequestById
);


// =====================================================
// FIND MATCHING PASSENGERS
// AI SCORING
// =====================================================

router.post(
  "/find-matches",
  seatExchangeController.findMatchingPassengers
);


// =====================================================
// ACCEPT SEAT EXCHANGE
// =====================================================

router.patch(
  "/accept/:id",
  seatExchangeController.acceptSeatExchange
);


// =====================================================
// REJECT SEAT EXCHANGE
// =====================================================

router.patch(
  "/reject/:id",
  seatExchangeController.rejectSeatExchange
);


// =====================================================
// CANCEL SEAT EXCHANGE
// =====================================================

router.patch(
  "/cancel/:id",
  seatExchangeController.cancelSeatExchange
);


// =====================================================
// GENERATE STRUCTURED REVIEW PACKET
// =====================================================
//
// Example:
// GET /seat-exchange/review-packet/:id
//
// Only COMPLETED exchanges can generate
// the review packet.
//

router.get(
  "/review-packet/:id",
  seatExchangeController.generateReviewPacket
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;