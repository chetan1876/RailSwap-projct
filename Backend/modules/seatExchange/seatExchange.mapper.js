// ==========================================
// Convert Single Seat Exchange Document
// ==========================================

const mapSeatExchange = (seatExchange) => {
  if (!seatExchange) return null;

  return {
    // ==========================================
    // BASIC
    // ==========================================

    id: seatExchange._id || seatExchange.id || null,


    // ==========================================
    // PASSENGER
    // ==========================================

    passenger: {
      id:
        seatExchange.user?._id ||
        seatExchange.user?.id ||
        seatExchange.user ||
        null,

      name:
        seatExchange.passengerName || "",

      age:
        seatExchange.age || null,

      gender:
        seatExchange.gender || "",
    },


    // ==========================================
    // TRAIN / JOURNEY
    // ==========================================

    train: {
      pnr:
        seatExchange.pnr || "",

      trainNumber:
        seatExchange.trainNumber || "",

      trainName:
        seatExchange.trainName || "",

      journeyDate:
        seatExchange.journeyDate || "",

      boardingStation:
        seatExchange.boardingStation || "",

      destinationStation:
        seatExchange.destinationStation || "",
    },


    // ==========================================
    // CURRENT SEAT
    // ==========================================

    currentSeat: {
      coach:
        seatExchange.coach || "",

      seatNumber:
        seatExchange.seatNumber || null,

      seatType:
        seatExchange.seatType || "",
    },


    // ==========================================
    // PREFERRED SEAT
    // ==========================================

    preferredSeat:
      seatExchange.preferredSeat ||
      (
        seatExchange.preferredCoach &&
        seatExchange.preferredSeatNumber
          ? `Coach ${seatExchange.preferredCoach} Seat ${seatExchange.preferredSeatNumber}`
          : "Any"
      ),


    // ==========================================
    // PREFERENCE INFORMATION
    // ==========================================

    preferences: {
      preferredCoach:
        seatExchange.preferredCoach || "",

      preferredSeatNumber:
        seatExchange.preferredSeatNumber || null,

      sameCoachPreferred:
        seatExchange.sameCoachPreferred || false,

      sameCabinPreferred:
        seatExchange.sameCabinPreferred || false,

      medicalPriority:
        seatExchange.medicalPriority || false,

      seniorCitizenPriority:
        seatExchange.seniorCitizenPriority || false,

      familyPriority:
        seatExchange.familyPriority || false,
    },


    // ==========================================
    // STATUS
    // ==========================================

    status:
      seatExchange.status || "PENDING",


    // ==========================================
    // AI MATCH INFORMATION
    // ==========================================

    matchPercentage:
      seatExchange.matchPercentage || 0,

    aiRecommendations:
      Array.isArray(seatExchange.aiRecommendations)
        ? seatExchange.aiRecommendations
        : [],


    // ==========================================
    // MATCHED PASSENGER
    // ==========================================

    matchedUser:
      seatExchange.matchedUser
        ? {
            id:
              seatExchange.matchedUser._id ||
              seatExchange.matchedUser.id ||
              null,

            name:
              seatExchange.matchedUser.name || "",

            email:
              seatExchange.matchedUser.email || "",
          }
        : null,


    // ==========================================
    // PAYMENT INFORMATION
    // ==========================================

    payment: {
      paymentUnlocked:
        seatExchange.paymentUnlocked || false,

      donationPaid:
        seatExchange.donationPaid || false,

      donationAmount:
        seatExchange.donationAmount ?? 50,

      transactionId:
        seatExchange.transactionId || null,

      paymentStatus:
        seatExchange.paymentStatus || "NOT_REQUIRED",

      paymentProvider:
        seatExchange.paymentProvider || "PAYTM",
    },


    // ==========================================
    // REVIEW PACKET INFORMATION
    // ==========================================

    review: {
      userNotes:
        seatExchange.userNotes ||
        seatExchange.notes ||
        "",

      reviewTag:
        seatExchange.reviewTag || "",

      reviewPacketId:
        seatExchange.reviewPacketId || null,

      reviewPacketStatus:
        seatExchange.reviewPacketStatus || null,
    },


    // ==========================================
    // TIMESTAMPS
    // ==========================================

    createdAt:
      seatExchange.createdAt || null,

    updatedAt:
      seatExchange.updatedAt || null,
  };
};


// ==========================================
// Convert Multiple Documents
// ==========================================

const mapSeatExchangeList = (seatExchanges = []) => {
  return seatExchanges.map(mapSeatExchange);
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  mapSeatExchange,
  mapSeatExchangeList,
};