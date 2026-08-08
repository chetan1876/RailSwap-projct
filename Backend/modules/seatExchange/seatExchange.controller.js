const seatExchangeService = require("./seatExchange.service");


// =====================================================
// CREATE SEAT EXCHANGE REQUEST
// Default: PENDING, no upfront payment
// =====================================================

const createSeatExchangeRequest = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await seatExchangeService.createSeatExchangeRequest(
        req.body
      );

    return res
      .status(201)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// PROCESS PAYTM PAYMENT POST-ACCEPTANCE
// ₹50
// =====================================================

const processPaytmPayment = async (
  req,
  res,
  next
) => {

  try {

    const {
      requestId,
      amount,
      paymentMethod,
    } = req.body;

    const result =
      await seatExchangeService.processPaytmPayment(
        requestId,
        amount,
        paymentMethod
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// GET ALL REQUESTS
// =====================================================

const getAllSeatExchangeRequests = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await seatExchangeService.getAllSeatExchangeRequests();

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// GET REQUEST BY ID
// =====================================================

const getSeatExchangeRequestById = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;

    const result =
      await seatExchangeService.getSeatExchangeRequestById(
        id
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// FIND MATCHING PASSENGERS
// =====================================================

const findMatchingPassengers = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await seatExchangeService.findMatchingPassengers(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// ACCEPT SEAT EXCHANGE
// Unlocks Paytm Payment Screen
// =====================================================

const acceptSeatExchange = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;

    const { matchedUserId } =
      req.body;

    const result =
      await seatExchangeService.acceptSeatExchange(
        id,
        matchedUserId
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// REJECT SEAT EXCHANGE
// =====================================================

const rejectSeatExchange = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;

    const result =
      await seatExchangeService.rejectSeatExchange(
        id
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// CANCEL SEAT EXCHANGE
// =====================================================

const cancelSeatExchange = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;

    const result =
      await seatExchangeService.cancelSeatExchange(
        id
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// GET PAYMENT HISTORY
// =====================================================

const getPaymentHistory = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      req.query.userId ||
      "user123";

    const result =
      await seatExchangeService.getPaymentHistory(
        userId
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// GENERATE STRUCTURED REVIEW PACKET
// =====================================================

const generateReviewPacket = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;

    const {
      userNotes = "",
    } = req.body || {};

    const result =
      await seatExchangeService.generateReviewPacket(
        id,
        userNotes
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    next(error);

  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  createSeatExchangeRequest,

  processPaytmPayment,

  getAllSeatExchangeRequests,

  getSeatExchangeRequestById,

  findMatchingPassengers,

  acceptSeatExchange,

  rejectSeatExchange,

  cancelSeatExchange,

  getPaymentHistory,

  generateReviewPacket,

};