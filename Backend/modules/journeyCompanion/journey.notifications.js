const { calculateJourneyProgress } = require("./journey.utils");

/*
========================================
SMART NOTIFICATIONS & REMINDERS ENGINE
========================================
*/

/**
 * Generate active reminder configurations & triggers for a journey
 */
const generateJourneyReminders = (journey, userSettings = {}) => {
  const progress = calculateJourneyProgress(journey);

  const reminders = [
    {
      id: "boarding_reminder",
      title: "Boarding Reminder",
      type: "BOARDING",
      minutesBefore: userSettings.boardingMinutes || 45,
      description: `Prepare to board train ${journey.trainNumber || ""} at Platform ${journey.platform || "PF-1"}.`,
      icon: "fa-train-subway",
      isEnabled: userSettings.boardingReminder !== false,
      isTriggered: progress >= 10 && progress < 100,
    },
    {
      id: "station_reminder",
      title: "Next Station Alert",
      type: "STATION",
      minutesBefore: userSettings.stationMinutes || 15,
      description: "Train approaching your intermediate check-in station.",
      icon: "fa-bell",
      isEnabled: userSettings.stationReminder !== false,
      isTriggered: progress >= 40 && progress < 90,
    },
    {
      id: "destination_reminder",
      title: "Destination Arrival Alert",
      type: "DESTINATION",
      minutesBefore: userSettings.destinationMinutes || 30,
      description: `Approaching final destination ${journey.to || "Destination"}. Get ready to deboard.`,
      icon: "fa-location-dot",
      isEnabled: userSettings.destinationReminder !== false,
      isTriggered: progress >= 85,
    },
    {
      id: "luggage_reminder",
      title: "Luggage Check Reminder",
      type: "LUGGAGE",
      minutesBefore: userSettings.luggageMinutes || 20,
      description:
        "Count your luggage, phone, charger, and wallet under the seat before leaving.",
      icon: "fa-suitcase-rolling",
      isEnabled: userSettings.luggageReminder !== false,
      isTriggered: progress >= 80,
    },
    {
      id: "wakeup_reminder",
      title: "Night Wake-Up Alarm",
      type: "WAKEUP",
      minutesBefore: userSettings.wakeupMinutes || 35,
      description:
        "Smart wake-up alarm set 35 mins prior to destination arrival.",
      icon: "fa-clock",
      isEnabled: userSettings.wakeupReminder !== false,
      isTriggered: progress >= 75 && progress < 95,
    },
  ];

  return reminders;
};

module.exports = {
  generateJourneyReminders,
};
