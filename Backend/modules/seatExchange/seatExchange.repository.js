const { db } = require("../../config/firebase");


// ==========================================
// COLLECTIONS
// ==========================================

const SEAT_EXCHANGE_COLLECTION = "seatExchange";
const PAYMENT_COLLECTION = "seatExchangePayments";


// ==========================================
// CREATE SEAT EXCHANGE REQUEST
// Default: PENDING, no upfront payment
// ==========================================

const createRequest = async (payload) => {
  const docRef = await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .add({
      ...payload,

      status: "PENDING",

      paymentUnlocked: false,

      donationPaid: false,

      donationAmount: 50,

      paymentStatus: "NOT_REQUIRED",

      paymentProvider: "PAYTM",

      createdAt: new Date(),

      updatedAt: new Date(),
    });

  return {
    id: docRef.id,

    ...payload,

    status: "PENDING",

    paymentUnlocked: false,

    donationPaid: false,

    donationAmount: 50,

    paymentStatus: "NOT_REQUIRED",

    paymentProvider: "PAYTM",
  };
};


// ==========================================
// GET ALL REQUESTS
// ==========================================

const getAllRequests = async () => {
  try {
    const snapshot = await db
      .collection(SEAT_EXCHANGE_COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (err) {

    console.warn(
      "Fallback query without orderBy:",
      err.message
    );

    const snapshot = await db
      .collection(SEAT_EXCHANGE_COLLECTION)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
};


// ==========================================
// GET REQUEST BY ID
// ==========================================

const getRequestById = async (id) => {

  const doc = await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .doc(id)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};


// ==========================================
// GET USER REQUESTS
// ==========================================

const getUserRequests = async (userId) => {

  const snapshot = await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .where("user", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


// ==========================================
// FIND MATCHING CANDIDATES
// By Train & Journey Date
// ==========================================

const findMatchesByTrainAndDate = async (
  trainNumber,
  journeyDate,
  excludeId = null
) => {

  const snapshot = await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .where("trainNumber", "==", trainNumber)
    .where("journeyDate", "==", journeyDate)
    .get();

  const results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (excludeId) {

    return results.filter(
      (item) => item.id !== excludeId
    );

  }

  return results;
};


// ==========================================
// UPDATE REQUEST
// ==========================================

const updateRequest = async (id, data) => {

  await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .doc(id)
    .update({

      ...data,

      updatedAt: new Date(),

    });

  return await getRequestById(id);
};


// ==========================================
// UPDATE POST-ACCEPTANCE PAYMENT
// ==========================================

const updatePostAcceptancePayment = async (
  id,
  transactionId
) => {

  await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .doc(id)
    .update({

      donationPaid: true,

      paymentStatus: "PAID",

      transactionId,

      status: "COMPLETED",

      updatedAt: new Date(),

    });

  return await getRequestById(id);
};


// ==========================================
// RECORD PAYTM TRANSACTION
// ==========================================

const recordTransaction = async (
  transactionData
) => {

  const docRef = await db
    .collection(PAYMENT_COLLECTION)
    .add({

      ...transactionData,

      createdAt: new Date(),

    });

  return {

    id: docRef.id,

    ...transactionData,

  };
};


// ==========================================
// GET PAYMENT HISTORY
// ==========================================

const getPaymentHistory = async (userId) => {

  try {

    const snapshot = await db
      .collection(PAYMENT_COLLECTION)
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (err) {

    console.error(
      "Payment history fetch error:",
      err
    );

    return [];

  }
};


// ==========================================
// GET COMPLETED REQUEST FOR REVIEW PACKET
// ==========================================

const getCompletedRequestById = async (id) => {

  const request = await getRequestById(id);

  if (!request) {
    return null;
  }

  // Review Packet should only be generated
  // after the seat exchange is completed.

  if (request.status !== "COMPLETED") {
    return null;
  }

  return request;
};


// ==========================================
// DELETE REQUEST
// ==========================================

const deleteRequest = async (id) => {

  await db
    .collection(SEAT_EXCHANGE_COLLECTION)
    .doc(id)
    .delete();

  return {

    success: true,

    message: "Request deleted successfully",

  };
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  createRequest,

  getAllRequests,

  getRequestById,

  getUserRequests,

  findMatchesByTrainAndDate,

  updateRequest,

  updatePostAcceptancePayment,

  recordTransaction,

  getPaymentHistory,

  getCompletedRequestById,

  deleteRequest,

};