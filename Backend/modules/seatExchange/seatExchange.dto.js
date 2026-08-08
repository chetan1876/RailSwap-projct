class SeatExchangeDTO {
  constructor(data) {
    this.id = data.id || data._id;

    this.passengerName = data.passengerName;
    this.age = data.age;
    this.gender = data.gender;

    this.pnr = data.pnr;
    this.trainNumber = data.trainNumber;
    this.trainName = data.trainName;

    this.journeyDate = data.journeyDate;
    this.boardingStation = data.boardingStation;
    this.destinationStation = data.destinationStation;

    this.coach = data.coach;
    this.seatNumber = data.seatNumber;
    this.seatType = data.seatType;
    this.bookingStatus = data.bookingStatus || "Confirmed";

    this.preferredCoach = data.preferredCoach;
    this.preferredSeatNumber = data.preferredSeatNumber;
    this.preferredSeat = data.preferredSeat || `Coach ${data.preferredCoach} Seat ${data.preferredSeatNumber}`;

    this.sameCoachPreferred = data.sameCoachPreferred || false;
    this.sameCabinPreferred = data.sameCabinPreferred || false;
    this.medicalPriority = data.medicalPriority || false;
    this.seniorCitizenPriority = data.seniorCitizenPriority || false;
    this.familyPriority = data.familyPriority || false;

    this.matchPercentage = data.matchPercentage || 0;
    this.aiRecommendations = data.aiRecommendations || [];

    this.status = data.status || "PENDING";
    this.paymentUnlocked = data.paymentUnlocked || false;

    this.donationPaid = data.donationPaid || false;
    this.donationAmount = data.donationAmount || 50;
    this.transactionId = data.transactionId || null;
    this.paymentStatus = data.paymentStatus || "NOT_REQUIRED";
    this.paymentProvider = data.paymentProvider || "PAYTM";

    this.notes = data.notes || "Passenger requested a lower berth for the journey.";

    this.user = data.user;
    this.matchedUser = data.matchedUser;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

const seatExchangeDTO = (data) => {
  return new SeatExchangeDTO(data);
};

const seatExchangeDTOList = (data = []) => {
  return data.map((item) => new SeatExchangeDTO(item));
};

module.exports = {
  SeatExchangeDTO,
  seatExchangeDTO,
  seatExchangeDTOList,
};
