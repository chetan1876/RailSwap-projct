// Convert Single Seat Exchange Document
const mapSeatExchange = (seatExchange) => {
  if (!seatExchange) return null;

  return {
    id: seatExchange._id,

    passenger: {
      id: seatExchange.user?._id,
      name: seatExchange.passengerName,
      age: seatExchange.age,
      gender: seatExchange.gender,
    },

    train: {
      pnr: seatExchange.pnr,
      trainNumber: seatExchange.trainNumber,
      trainName: seatExchange.trainName,
      journeyDate: seatExchange.journeyDate,
      boardingStation: seatExchange.boardingStation,
      destinationStation: seatExchange.destinationStation,
    },

    currentSeat: {
      coach: seatExchange.coach,
      seatNumber: seatExchange.seatNumber,
      seatType: seatExchange.seatType,
    },

    preferredSeat: seatExchange.preferredSeat,

    status: seatExchange.status,

    matchPercentage: seatExchange.matchPercentage,

    matchedUser: seatExchange.matchedUser
      ? {
          id: seatExchange.matchedUser._id,
          name: seatExchange.matchedUser.name,
          email: seatExchange.matchedUser.email,
        }
      : null,

    createdAt: seatExchange.createdAt,
    updatedAt: seatExchange.updatedAt,
  };
};

// Convert Multiple Documents
const mapSeatExchangeList = (seatExchanges = []) => {
  return seatExchanges.map(mapSeatExchange);
};

module.exports = {
  mapSeatExchange,
  mapSeatExchangeList,
};