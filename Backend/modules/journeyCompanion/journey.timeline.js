const { calculateJourneyProgress } = require("./journey.utils");
const { PRESET_TRAINS } = require("./journey.constants");

/*
========================================
JOURNEY TIMELINE ENGINE
========================================
*/

/**
 * Build dynamic timeline steps and station progress for a journey
 */
const buildJourneyTimeline = (journey) => {
  const progress = calculateJourneyProgress(journey);

  // Find matching preset train or create fallback stations
  const matchingTrain = PRESET_TRAINS.find(
    (t) =>
      t.trainNumber === journey.trainNumber ||
      t.trainName === journey.trainName,
  );

  const stations = matchingTrain
    ? matchingTrain.stations
    : [
        {
          name: journey.from || "Source Station",
          time: journey.departureTime || "08:00",
          distance: 0,
          stopDuration: "Departure",
        },
        {
          name: "Enroute Stop 1",
          time: "11:30",
          distance: 250,
          stopDuration: "5 mins",
        },
        {
          name: "Enroute Stop 2",
          time: "15:45",
          distance: 500,
          stopDuration: "10 mins",
        },
        {
          name: journey.to || "Destination Station",
          time: journey.arrivalTime || "20:00",
          distance: 750,
          stopDuration: "Arrival",
        },
      ];

  const totalStations = stations.length;
  const currentStationIndex = Math.min(
    totalStations - 1,
    Math.floor((progress / 100) * totalStations),
  );

  const currentStation = stations[currentStationIndex] || stations[0];
  const nextStation =
    stations[Math.min(totalStations - 1, currentStationIndex + 1)];

  const milestones = [
    {
      id: "ticket_confirmed",
      title: "Ticket Confirmed",
      subtitle: `Seat ${journey.coach || "Coach"}-${journey.seat || "Seat"} • PNR ${journey.pnr || "CNF"}`,
      status: "completed",
      timestamp: "Confirmed",
      icon: "fa-ticket",
    },
    {
      id: "boarding_soon",
      title: "Boarding Soon",
      subtitle: `Platform ${journey.platform || "PF-1"} • ${journey.from || "Source"}`,
      status: progress >= 10 ? "completed" : "active",
      timestamp: journey.departureTime || "Departure",
      icon: "fa-person-walking-luggage",
    },
    {
      id: "train_started",
      title: "Train Started",
      subtitle: `${journey.trainName || "Train"} departed on time`,
      status:
        progress >= 20 ? "completed" : progress >= 10 ? "active" : "pending",
      timestamp: journey.departureTime || "Started",
      icon: "fa-train",
    },
    {
      id: "reached_station",
      title: `Reached ${currentStation.name}`,
      subtitle: `Stop duration: ${currentStation.stopDuration} • Covered ${currentStation.distance} km`,
      status:
        progress >= 85 ? "completed" : progress >= 30 ? "active" : "pending",
      timestamp: currentStation.time,
      icon: "fa-location-dot",
    },
    {
      id: "next_station",
      title: `Next Station: ${nextStation.name}`,
      subtitle:
        progress >= 100
          ? "Reached final destination"
          : `ETA: ${nextStation.time}`,
      status:
        progress >= 95 ? "completed" : progress >= 50 ? "active" : "pending",
      timestamp: nextStation.time,
      icon: "fa-arrow-right-long",
    },
    {
      id: "journey_completed",
      title: "Journey Completed",
      subtitle: `Arrived at ${journey.to || "Destination"}`,
      status: progress >= 100 ? "completed" : "pending",
      timestamp: journey.arrivalTime || "Arrival",
      icon: "fa-flag-checkered",
    },
  ];

  return {
    progress,
    currentStationIndex,
    currentStation,
    nextStation,
    stations,
    milestones,
  };
};

module.exports = {
  buildJourneyTimeline,
};
