const { db } = require("../../config/firebase");

// Create Seat Exchange Request (Default: PENDING, no upfront payment)
const createRequest = async (payload) => {
  const docRef = await db.collection("seatExchange").add({
    ...payload,
    status: "PENDING",
    paymentUnlocked: false,
    donationPaid: false,
    donationAmount: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: docRef.id,
    ...payload,
    status: "PENDING",
    paymentUnlocked: false,
    donationPaid: false,
  };
};

// Get All Requests
const getAllRequests = async () => {
  try {
    const snapshot = await db
      .collection("seatExchange")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.warn("Fallback query without orderBy:", err.message);
    const snapshot = await db.collection("seatExchange").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
};

// Get Request By ID
const getRequestById = async (id) => {
  const doc = await db.collection("seatExchange").doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Get User Requests
const getUserRequests = async (userId) => {
  const snapshot = await db
    .collection("seatExchange")
    .where("user", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Find Matching Candidates (By Train & Date)
const findMatchesByTrainAndDate = async (trainNumber, journeyDate, excludeId = null) => {
  const snapshot = await db
    .collection("seatExchange")
    .where("trainNumber", "==", trainNumber)
    .where("journeyDate", "==", journeyDate)
    .get();

  const results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (excludeId) {
    return results.filter((item) => item.id !== excludeId);
  }

  return results;
};

// Update Request
const updateRequest = async (id, data) => {
  await db.collection("seatExchange").doc(id).update({
    ...data,
    updatedAt: new Date(),
  });

  return await getRequestById(id);
};

// Update Post-Acceptance Paytm Payment Status
const updatePostAcceptancePayment = async (id, transactionId) => {
  await db.collection("seatExchange").doc(id).update({
    donationPaid: true,
    paymentStatus: "PAID",
    transactionId: transactionId,
    status: "COMPLETED", // Status becomes Exchange Completed after payment
    updatedAt: new Date(),
  });

  return await getRequestById(id);
};

// Record Paytm Transaction
const recordTransaction = async (transactionData) => {
  const docRef = await db.collection("seatExchangePayments").add({
    ...transactionData,
    createdAt: new Date(),
  });

  return {
    id: docRef.id,
    ...transactionData,
  };
};

// Get Payment History
const getPaymentHistory = async (userId) => {
  try {
    const snapshot = await db
      .collection("seatExchangePayments")
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Payment history fetch error:", err);
    return [];
  }
};

// Delete Request
const deleteRequest = async (id) => {
  await db.collection("seatExchange").doc(id).delete();

  return {
    success: true,
    message: "Request deleted successfully",
  };
};

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
  deleteRequest,
};
