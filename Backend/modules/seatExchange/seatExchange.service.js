const repository = require("./seatExchange.repository");
const { REQUEST_STATUS, PAYMENT_STATUS, DONATION_CONFIG, MESSAGE } = require("./seatExchange.constants");
const { seatExchangeDTO, seatExchangeDTOList } = require("./seatExchange.dto");
const { db, messaging } = require("../../config/firebase");

// =====================================================
// SEND FCM NOTIFICATION (SAFE UTILITY)
// =====================================================
const sendNotificationToUser = async (userId, title, body) => {
  try {
    if (!userId) return;

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return;

    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) return;

    await messaging.send({
      token: fcmToken,
      notification: { title, body },
      data: { type: "SEAT_EXCHANGE", userId: String(userId) },
    });
    console.log(`✅ Notification sent to ${userId}`);
  } catch (error) {
    console.warn("Notification skipped/error:", error.message);
  }
};

// =====================================================
// AI MATCH SCORING ALGORITHM
// =====================================================
const calculateAIMatchScore = (requester, candidate) => {
  let score = 0;
  const recommendations = [];

  // 1. Same Train & Date (20 pts)
  if (
    requester.trainNumber === candidate.trainNumber &&
    requester.journeyDate === candidate.journeyDate
  ) {
    score += 20;
  }

  // 2. Same Coach (+25 pts)
  const reqCoach = (requester.preferredCoach || requester.coach || "").toUpperCase();
  const candCoach = (candidate.coach || "").toUpperCase();
  if (reqCoach && candCoach && reqCoach === candCoach) {
    score += 25;
    recommendations.push("Recommend Same Coach First");
  }

  // 3. Same Cabin / Compartment (+15 pts)
  const reqSeat = parseInt(requester.preferredSeatNumber || requester.seatNumber) || 0;
  const candSeat = parseInt(candidate.seatNumber) || 0;
  if (reqSeat > 0 && candSeat > 0) {
    const reqCabin = Math.ceil(reqSeat / 8);
    const candCabin = Math.ceil(candSeat / 8);
    if (reqCabin === candCabin) {
      score += 15;
      recommendations.push("Recommend Same Cabin First");
      recommendations.push("Recommend Lowest Walking Distance");
    }
  }

  // 4. Nearby Seat (+15 pts)
  if (Math.abs(reqSeat - candSeat) <= 3 && Math.abs(reqSeat - candSeat) > 0) {
    score += 15;
    recommendations.push("Recommend Nearby Seat");
  }

  // 5. Priorities (Medical, Senior Citizen, Family)
  if (requester.medicalPriority || candidate.medicalPriority) {
    score += 10;
    recommendations.push("Medical Priority Swap");
  }

  if (
    requester.seniorCitizenPriority ||
    candidate.seniorCitizenPriority ||
    requester.age >= 60 ||
    candidate.age >= 60
  ) {
    score += 10;
    recommendations.push("Senior Citizen Priority");
  }

  if (requester.familyPriority || candidate.familyPriority) {
    score += 10;
    recommendations.push("Recommend Safest Exchange");
  }

  let finalMatchScore = Math.min(99, Math.max(65, score));
  if (!recommendations.length) {
    recommendations.push("Highest Success Probability");
  }

  return {
    matchPercentage: finalMatchScore,
    aiRecommendations: Array.from(new Set(recommendations)),
  };
};

// =====================================================
// CREATE SEAT EXCHANGE REQUEST (NO UPFRONT PAYMENT)
// =====================================================
const createSeatExchangeRequest = async (data) => {
  const payload = {
    ...data,
    user: data.user || "user123",
    status: REQUEST_STATUS.PENDING,
    paymentUnlocked: false,
    donationPaid: false,
    donationAmount: DONATION_CONFIG.FEE_AMOUNT,
    paymentStatus: PAYMENT_STATUS.PENDING,
  };

  const request = await repository.createRequest(payload);

  return {
    success: true,
    message: MESSAGE.REQUEST_CREATED,
    data: seatExchangeDTO(request),
  };
};

// =====================================================
// ACCEPT SEAT EXCHANGE REQUEST (Unlocks Paytm Payment)
// =====================================================
const acceptSeatExchange = async (id, matchedUserId = "user123") => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  // Update status to ACCEPTED & unlock payment screen (PAYMENT_PENDING)
  const updated = await repository.updateRequest(id, {
    status: REQUEST_STATUS.ACCEPTED,
    matchedUser: matchedUserId,
    paymentUnlocked: true,
    paymentStatus: PAYMENT_STATUS.UNLOCKED,
    acceptedAt: new Date().toISOString(),
  });

  await sendNotificationToUser(
    request.user,
    "Seat Exchange Confirmed!",
    "Your seat exchange request has been accepted by passenger! Payment Screen is now unlocked."
  );

  return {
    success: true,
    message: MESSAGE.REQUEST_ACCEPTED,
    data: seatExchangeDTO(updated),
  };
};

// =====================================================
// PROCESS PAYTM PAYMENT (POST-ACCEPTANCE ₹50)
// =====================================================
const processPaytmPayment = async (requestId, amount = 50, paymentMethod = "PAYTM") => {
  const request = await repository.getRequestById(requestId);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  // Generate Paytm Transaction ID
  const transactionId = `PAYTM_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`;

  // Record Paytm Transaction
  await repository.recordTransaction({
    requestId,
    userId: request.user || "user123",
    passengerName: request.passengerName,
    amount: DONATION_CONFIG.FEE_AMOUNT,
    currency: DONATION_CONFIG.CURRENCY,
    paymentMethod,
    transactionId,
    type: "POST_ACCEPTANCE_PAYTM_DONATION",
    status: "SUCCESS",
  });

  // Also record receiver escrow reward transfer
  if (request.matchedUser) {
    await repository.recordTransaction({
      requestId,
      userId: request.matchedUser,
      amount: DONATION_CONFIG.FEE_AMOUNT,
      currency: DONATION_CONFIG.CURRENCY,
      transactionId: `REWARD_${transactionId}`,
      type: "RECEIVER_ESCROW_REWARD",
      status: "SUCCESS",
    });
  }

  // Update status to Exchange Completed
  const updatedRequest = await repository.updatePostAcceptancePayment(
    requestId,
    transactionId
  );

  return {
    success: true,
    message: MESSAGE.PAYMENT_SUCCESSFUL,
    transactionId,
    data: seatExchangeDTO(updatedRequest),
  };
};

// =====================================================
// GET ALL REQUESTS
// =====================================================
const getAllSeatExchangeRequests = async () => {
  const requests = await repository.getAllRequests();

  return {
    success: true,
    count: requests.length,
    data: seatExchangeDTOList(requests),
  };
};

// =====================================================
// GET REQUEST BY ID
// =====================================================
const getSeatExchangeRequestById = async (id) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  return {
    success: true,
    data: seatExchangeDTO(request),
  };
};

// =====================================================
// FIND MATCHING PASSENGERS WITH AI SCORING
// =====================================================
const findMatchingPassengers = async (requestData) => {
  const { trainNumber, journeyDate, requestId } = requestData;

  if (!trainNumber || !journeyDate) {
    return {
      success: true,
      message: MESSAGE.NO_MATCH_FOUND,
      count: 0,
      data: [],
    };
  }

  const candidates = await repository.findMatchesByTrainAndDate(
    trainNumber,
    journeyDate,
    requestId
  );

  // Filter pending candidates
  const validCandidates = candidates.filter(
    (c) => c.status === REQUEST_STATUS.PENDING || c.status === REQUEST_STATUS.ACCEPTED
  );

  const scoredMatches = validCandidates.map((candidate) => {
    const { matchPercentage, aiRecommendations } = calculateAIMatchScore(
      requestData,
      candidate
    );

    return seatExchangeDTO({
      ...candidate,
      matchPercentage,
      aiRecommendations,
    });
  });

  scoredMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    success: true,
    message: scoredMatches.length ? MESSAGE.MATCH_FOUND : MESSAGE.NO_MATCH_FOUND,
    count: scoredMatches.length,
    data: scoredMatches,
  };
};

// =====================================================
// REJECT SEAT EXCHANGE REQUEST
// =====================================================
const rejectSeatExchange = async (id) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  const updated = await repository.updateRequest(id, {
    status: REQUEST_STATUS.REJECTED,
  });

  await sendNotificationToUser(
    request.user,
    "Seat Exchange Declined",
    "Your seat exchange request was not accepted by the passenger."
  );

  return {
    success: true,
    message: MESSAGE.REQUEST_REJECTED,
    data: seatExchangeDTO(updated),
  };
};

// =====================================================
// CANCEL SEAT EXCHANGE REQUEST
// =====================================================
const cancelSeatExchange = async (id) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  const updated = await repository.updateRequest(id, {
    status: REQUEST_STATUS.CANCELLED,
  });

  return {
    success: true,
    message: MESSAGE.REQUEST_CANCELLED,
    data: seatExchangeDTO(updated),
  };
};

// =====================================================
// GET PAYMENT HISTORY
// =====================================================
const getPaymentHistory = async (userId = "user123") => {
  const history = await repository.getPaymentHistory(userId);

  return {
    success: true,
    count: history.length,
    data: history,
  };
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
};
