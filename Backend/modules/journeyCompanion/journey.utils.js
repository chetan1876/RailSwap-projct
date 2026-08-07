const { PRESET_TRAINS, JOURNEY_STATUS } = require("./journey.constants");

/*
========================================
JOURNEY UTILS
========================================
*/

/**
 * Calculate journey progress percentage (0 - 100)
 */
const calculateJourneyProgress = (journey) => {
  if (journey.progress !== undefined && journey.progress !== null) {
    return Math.min(100, Math.max(0, Number(journey.progress)));
  }

  if (journey.status === JOURNEY_STATUS.COMPLETED) {
    return 100;
  }

  if (journey.status === JOURNEY_STATUS.UPCOMING) {
    return 0;
  }

  // Calculate based on departure & arrival times if present
  try {
    const now = new Date();
    const [depHours, depMins] = (journey.departureTime || "08:00")
      .split(":")
      .map(Number);
    const [arrHours, arrMins] = (journey.arrivalTime || "20:00")
      .split(":")
      .map(Number);

    const depDate = new Date(journey.journeyDate || now);
    depDate.setHours(depHours || 8, depMins || 0, 0, 0);

    const arrDate = new Date(journey.journeyDate || now);
    arrDate.setHours(arrHours || 20, arrMins || 0, 0, 0);
    if (arrDate <= depDate) {
      arrDate.setDate(arrDate.getDate() + 1);
    }

    if (now < depDate) return 0;
    if (now > arrDate) return 100;

    const totalDuration = arrDate.getTime() - depDate.getTime();
    const elapsed = now.getTime() - depDate.getTime();

    return Math.min(
      100,
      Math.max(0, Math.round((elapsed / totalDuration) * 100)),
    );
  } catch (error) {
    return 45; // Default safe progress for active journeys
  }
};

/**
 * Search preset trains database by query
 */
const searchPresetTrains = (query) => {
  if (!query || typeof query !== "string") return PRESET_TRAINS;

  const q = query.toLowerCase().trim();

  return PRESET_TRAINS.filter(
    (t) =>
      t.trainNumber.toLowerCase().includes(q) ||
      t.trainName.toLowerCase().includes(q) ||
      t.from.toLowerCase().includes(q) ||
      t.to.toLowerCase().includes(q),
  );
};

/**
 * Generate mock PNR details from a 10-digit PNR
 */
const generateMockPNRDetails = (pnrNumber) => {
  const cleanPNR = String(pnrNumber).trim();
  const train =
    PRESET_TRAINS[
      Math.abs(
        cleanPNR.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
      ) % PRESET_TRAINS.length
    ];

  const today = new Date().toISOString().split("T")[0];

  return {
    pnr: cleanPNR,
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    from: train.from,
    to: train.to,
    departureTime: train.departureTime,
    arrivalTime: train.arrivalTime,
    journeyDate: today,
    coach: "B2",
    seat: "34 (Side Lower)",
    platform: "PF-4",
    status: JOURNEY_STATUS.IN_TRANSIT,
    bookingStatus: "CNF / B2-34",
    totalDistanceKm: train.totalDistanceKm,
    stations: train.stations,
    famousFood: train.famousFood,
  };
};

/**
 * Format remaining time in minutes to readable string
 */
const formatTimeRemaining = (minutes) => {
  if (minutes <= 0) return "Arrived / Journey Completed";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs === 0) return `${mins} mins`;
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs} hrs ${mins} mins`;
};

/**
 * Determine status from progress
 */
const determineStatusFromProgress = (progress) => {
  if (progress <= 0) return JOURNEY_STATUS.UPCOMING;
  if (progress < 15) return JOURNEY_STATUS.BOARDING;
  if (progress < 85) return JOURNEY_STATUS.IN_TRANSIT;
  if (progress < 100) return JOURNEY_STATUS.ARRIVING_SOON;
  return JOURNEY_STATUS.COMPLETED;
};

module.exports = {
  calculateJourneyProgress,
  searchPresetTrains,
  generateMockPNRDetails,
  formatTimeRemaining,
  determineStatusFromProgress,
};
