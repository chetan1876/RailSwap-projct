const pnrResponseDTO = (pnr) => {
  return {
    id: pnr._id,
    pnr: pnr.pnr,
    passengerName: pnr.passengerName,
    trainNumber: pnr.trainNumber,
    trainName: pnr.trainName,
    from: pnr.from,
    to: pnr.to,
    journeyDate: pnr.journeyDate,
    coach: pnr.coach,
    seat: pnr.seat,
    status: pnr.status,
  };
};

module.exports = {
  pnrResponseDTO,
};
