
// ==========================================
// Seat Exchange DTO
// ==========================================

class SeatExchangeDTO {
  constructor(data = {}) {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    this.id = data.id || data._id || null;


    // ==========================================
    // PASSENGER DETAILS
    // ==========================================

    this.passengerName = data.passengerName || "";
    this.age = data.age || null;
    this.gender = data.gender || "";


    // ==========================================
    // JOURNEY / TRAIN DETAILS
    // ==========================================

    this.pnr = data.pnr || "";
    this.trainNumber = data.trainNumber || "";
    this.trainName = data.trainName || "";

    this.journeyDate = data.journeyDate || "";
    this.boardingStation = data.boardingStation || "";
    this.destinationStation = data.destinationStation || "";


    // ==========================================
    // CURRENT SEAT DETAILS
    // ==========================================

    this.coach = data.coach || "";
    this.seatNumber = data.seatNumber || null;
    this.seatType = data.seatType || "";

    this.bookingStatus =
      data.bookingStatus || "Confirmed";


    // ==========================================
    // PREFERRED SEAT DETAILS
    // ==========================================

    this.preferredCoach =
      data.preferredCoach || "";

    this.preferredSeatNumber =
      data.preferredSeatNumber || null;

    this.preferredSeat =
      data.preferredSeat ||
      (
        data.preferredCoach && data.preferredSeatNumber
          ? `Coach ${data.preferredCoach} Seat ${data.preferredSeatNumber}`
          : "Any"
      );


    // ==========================================
    // SEAT PREFERENCE FLAGS
    // ==========================================

    this.sameCoachPreferred =
      data.sameCoachPreferred || false;

    this.sameCabinPreferred =
      data.sameCabinPreferred || false;

    this.medicalPriority =
      data.medicalPriority || false;

    this.seniorCitizenPriority =
      data.seniorCitizenPriority || false;

    this.familyPriority =
      data.familyPriority || false;


    // ==========================================
    // AI MATCHING
    // ==========================================

    this.matchPercentage =
      data.matchPercentage || 0;

    this.aiRecommendations =
      Array.isArray(data.aiRecommendations)
        ? data.aiRecommendations
        : [];


    // ==========================================
    // REQUEST STATUS
    // ==========================================

    this.status =
      data.status || "PENDING";

    this.paymentUnlocked =
      data.paymentUnlocked || false;


    // ==========================================
    // PAYMENT DETAILS
    // ==========================================

    this.donationPaid =
      data.donationPaid || false;

    this.donationAmount =
      data.donationAmount ?? 50;

    this.transactionId =
      data.transactionId || null;

    this.paymentStatus =
      data.paymentStatus || "NOT_REQUIRED";

    this.paymentProvider =
      data.paymentProvider || "PAYTM";


    // ==========================================
    // USER / MATCHED USER
    // ==========================================

    this.user =
      data.user || null;

    this.matchedUser =
      data.matchedUser || null;


    // ==========================================
    // TIMESTAMPS
    // ==========================================

    this.createdAt =
      data.createdAt || null;

    this.updatedAt =
      data.updatedAt || null;


    // ==========================================
    // REVIEW PACKET DATA
    // ==========================================

    // User notes for the structured review packet
    this.userNotes =
      data.userNotes ||
      data.notes ||
      "";


    // Optional review tag
    this.reviewTag =
      data.reviewTag || "";


    // Review packet generation status
    this.reviewPacketStatus =
      data.reviewPacketStatus || null;


    // Review packet ID
    this.reviewPacketId =
      data.reviewPacketId || null;
  }
}


// ==========================================
// SINGLE DTO
// ==========================================

const seatExchangeDTO = (data) => {
  return new SeatExchangeDTO(data);
};


// ==========================================
// DTO LIST
// ==========================================

const seatExchangeDTOList = (data = []) => {
  return data.map(
    (item) => new SeatExchangeDTO(item)
  );
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  SeatExchangeDTO,
  seatExchangeDTO,
  seatExchangeDTOList,
};

